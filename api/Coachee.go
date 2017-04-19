package api

import (
	"time"
	"google.golang.org/appengine/datastore"
	"golang.org/x/net/context"
	"google.golang.org/appengine/log"
)

/* Internal struct */
type Coachee struct {
	Key           *datastore.Key `json:"id" datastore:"-"`
	FirebaseId    string `json:"firebase_id"`
	Email         string `json:"email"`
	DisplayName   string `json:"display_name"`
	AvatarURL     string`json:"avatar_url"`
	StartDate     time.Time `json:"start_date"`
	SelectedCoach *datastore.Key `json:"-"`
	PlanId        PlanInt`json:"-"`
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


//get Coachee for the given user id
func GetCoachee(ctx context.Context, key *datastore.Key) (*APICoachee, error) {
	log.Debugf(ctx, "getCoachee")

	var coachee Coachee
	err := datastore.Get(ctx, key, &coachee)
	if err != nil {
		return nil, err
	}
	coachee.Key = key

	//now get selected Coach if any
	coach, err := coachee.getSelectedCoach(ctx)
	if err != nil {
		return nil, err
	}

	//get the plan
	plan := createPlanFromId(coachee.PlanId)

	var apiCoachee = coachee.toAPI(coach, plan)

	log.Debugf(ctx, "getCoachee, response %s", apiCoachee)

	return &apiCoachee, nil
}

//get all coachees
func GetAllCoachees(ctx context.Context) ([]*APICoachee, error) {
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

func (c *Coachee)Update(ctx context.Context, displayName string, avatarUrl string) (error) {
	log.Debugf(ctx, "update coachee displayName : %s, avatar Url : %s", displayName, avatarUrl)

	c.DisplayName = displayName
	c.AvatarURL = avatarUrl
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