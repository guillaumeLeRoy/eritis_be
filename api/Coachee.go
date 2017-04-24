package api

import (
	"time"
	"google.golang.org/appengine/datastore"
	"golang.org/x/net/context"
	"google.golang.org/appengine/log"
	"google.golang.org/appengine"
)

/* Internal struct */
type Coachee struct {
	Key                     *datastore.Key `json:"id" datastore:"-"`
	FirebaseId              string `json:"firebase_id"`
	Email                   string `json:"email"`
	DisplayName             string `json:"display_name"`
	AvatarURL               string`json:"avatar_url"`
	StartDate               time.Time `json:"start_date"`
	AvailableSessionsCount  int `json:"available_sessions_count"`
	UpdateSessionsCountDate time.Time `json:"update_sessions_count_date"`
	SelectedCoach           *datastore.Key `json:"-"`
	PlanId                  PlanInt`json:"-"`
}

/* API struct */
type APICoachee struct {
	Coachee
	SelectedCoach *Coach `json:"selectedCoach"`
	Plan          *Plan `json:"plan"`
}

func (c Coachee) toAPI(coach *Coach, plan *Plan) APICoachee {
	return APICoachee{
		Coachee  : c,
		SelectedCoach: coach,
		Plan: plan,
	}
}

func (c *Coachee) getSelectedCoach(ctx context.Context) (*Coach, error) {
	var coach *Coach
	if (c.SelectedCoach != nil) {
		var err error
		coach, err = GetCoach(ctx, c.SelectedCoach)
		if err != nil {
			return nil, err
		}
	}
	return coach, nil
}

func getCoachee(ctx context.Context, key *datastore.Key) (*Coachee, error) {
	var coachee Coachee
	err := datastore.Get(ctx, key, &coachee)
	if err != nil {
		return nil, err
	}
	coachee.Key = key
	return &coachee, nil
}

//get Coachee for the given user id
func GetAPICoachee(ctx context.Context, key *datastore.Key) (*APICoachee, error) {
	log.Debugf(ctx, "getCoachee")

	//get from Datastore
	coachee, err := getCoachee(ctx, key)

	//now get selected Coach if any
	coach, err := coachee.getSelectedCoach(ctx)
	if err != nil {
		return nil, err
	}

	//get the plan
	plan := createPlanFromId(coachee.PlanId)

	//convert to API object
	var apiCoachee = coachee.toAPI(coach, plan)

	log.Debugf(ctx, "getCoachee, response %s", apiCoachee)

	return &apiCoachee, nil
}

//get all coachees
func getAllCoachees(ctx context.Context) ([]*Coachee, error) {
	var coachees []*Coachee
	keys, err := datastore.NewQuery("Coachee").GetAll(ctx, &coachees)
	if err != nil {
		return nil, err
	}

	//get Keys
	for i, coachee := range coachees {
		coachee.Key = keys[i]
	}

	return coachees, nil
}

//get all API coachees
func GetAllAPICoachees(ctx context.Context) ([]*APICoachee, error) {
	log.Debugf(ctx, "GetAllAPICoachees")

	var coachees []*Coachee
	keys, err := datastore.NewQuery("Coachee").GetAll(ctx, &coachees)
	if err != nil {
		return nil, err
	}

	var response []*APICoachee
	for i, coachee := range coachees {
		coachee.Key = keys[i]
		//get coach
		//now get selected Coach if any
		coach, err := coachee.getSelectedCoach(ctx)
		if err != nil {
			return nil, err
		}

		//get the plan
		plan := createPlanFromId(coachee.PlanId)

		apiCoachee := coachee.toAPI(coach, plan)
		response[i] = &apiCoachee

	}

	return response, nil
}

func createCoacheeFromFirebaseUser(ctx context.Context, fbUser *FirebaseUser, planId PlanInt) (*APICoachee, error) {
	log.Debugf(ctx, "CoacheeFromFirebaseUser, fbUser %s, planId %s", fbUser, planId)

	var coachee Coachee
	coachee.Key = datastore.NewIncompleteKey(ctx, "Coachee", nil)

	//create new user
	coachee.FirebaseId = fbUser.UID
	coachee.Email = fbUser.Email
	coachee.DisplayName = fbUser.Email
	coachee.AvatarURL = gravatarURL(fbUser.Email)
	coachee.StartDate = time.Now()
	coachee.PlanId = planId

	//calculate available sessions
	var count = getSessionsCount(planId)
	coachee.AvailableSessionsCount = count
	coachee.UpdateSessionsCountDate = time.Now()

	//log.Infof(ctx, "saving new user: %s", aeuser.String())
	log.Debugf(ctx, "saving new user, firebase id  : %s, email : %s ", fbUser.UID, fbUser.Email)

	key, err := datastore.Put(ctx, coachee.Key, &coachee)
	if err != nil {
		return nil, err
	}
	coachee.Key = key

	//get the plan
	plan := createPlanFromId(coachee.PlanId)

	//no coach selected now
	var coacheeForApi = coachee.toAPI(nil, plan)
	return &coacheeForApi, nil
}

func getCoacheeFromFirebaseId(ctx context.Context, fbId string) (*APICoachee, error) {
	log.Debugf(ctx, "getCoacheeFromFirebaseId id : %s", fbId)

	var coachees []*Coachee

	keys, err := datastore.NewQuery("Coachee").Filter("FirebaseId =", fbId).GetAll(ctx, &coachees)
	if err != nil {
		return nil, err
	}

	if len(keys) == 0 {
		log.Debugf(ctx, "getCoacheeFromFirebaseId no keys")
		return nil, ErrNoUser
	}

	////todo too many users ??
	var coachee = coachees[0]
	var key = keys[0]
	//err = datastore.Get(ctx, key, &coachee)//TODO pk refaire un get ??
	//if err != nil {
	//	return nil, err
	//}
	coachee.Key = key

	//now get selected Coach if any
	coach, err := coachee.getSelectedCoach(ctx)
	if err != nil {
		return nil, err
	}

	//get the Plan
	plan := createPlanFromId(coachee.PlanId)

	res := coachee.toAPI(coach, plan)

	return &res, nil
}

func (c *Coachee)update(ctx context.Context) (error) {
	log.Debugf(ctx, "update coachee, email : %s, key : %s ", c.Email, c.Key)

	key, err := datastore.Put(ctx, c.Key, c)
	if err != nil {
		return err
	}
	c.Key = key

	return nil
}

/**
 Associate the given coach with this Coachee
 */
func (c *Coachee) UpdateSelectedCoach(ctx context.Context, coach *Coach) (*APICoachee, error) {
	log.Debugf(ctx, "UpdateSelectedCoach : %s", coach)

	c.SelectedCoach = coach.Key
	key, err := datastore.Put(ctx, c.Key, c)
	if err != nil {
		return nil, err
	}
	c.Key = key

	//get the plan
	plan := createPlanFromId(c.PlanId)

	//convert to APICoachee
	apiCoachee := c.toAPI(coach, plan)

	return &apiCoachee, nil
}

func (c *Coachee) refreshAvailableSessionsCount(ctx context.Context) (error) {
	plan := createPlanFromId(c.PlanId)

	//check if we can refresh
	if (canResetAvailableSessionsCount(ctx, c)) {
		//set value
		c.AvailableSessionsCount = plan.SessionsCount
		//refresh date
		c.UpdateSessionsCountDate = time.Now()

		log.Debugf(ctx, "refreshAvailableSessionsCount, for user %s, count %s", c.Email, c.AvailableSessionsCount)

		//save
		err := c.update(ctx)
		if err != nil {
			return err
		}
	}
	return nil
}

func canResetAvailableSessionsCount(ctx context.Context, c *Coachee) bool {
	var isDevServer = appengine.IsDevAppServer() && !isLiveEnvironment(ctx)

	if isDevServer {
		return true
	}
	day := time.Now().Day()

	log.Debugf(ctx, "canResetAvailableSessionsCount, last date : %s", c.UpdateSessionsCountDate)

	//reset the "1st" day of each month
	//reset if 1 month has passed
	if day == 1 {
		if c.UpdateSessionsCountDate.Month() != time.Now().Month() {
			return true
		}
	}
	return false
}

// decrease number of available sessions and save in datastore
func (c *Coachee) decreaseAvailableSessionsCount(ctx context.Context) error {

	//decrease of 1
	c.AvailableSessionsCount = c.AvailableSessionsCount - 1

	//save
	err := c.update(ctx)
	if err != nil {
		return err
	}

	return nil
}