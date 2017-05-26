package model

import (
	"time"
	"google.golang.org/appengine/datastore"
	"golang.org/x/net/context"
	"google.golang.org/appengine/log"
	"eritis_be/pkg/utils"
	"google.golang.org/appengine"
)

const COACHEE_ENTITY string = "Coachee"


/* Internal struct */
type Coachee struct {
	Key                     *datastore.Key `json:"-" datastore:"-"`
	FirebaseId              string `json:"-"`
	Email                   string `json:"email"`
	DisplayName             string `json:"display_name"`
	AvatarURL               string`json:"avatar_url"`
	StartDate               time.Time `json:"start_date"`
	AvailableSessionsCount  int `json:"available_sessions_count"`
	UpdateSessionsCountDate time.Time `json:"update_sessions_count_date"`
	SelectedCoach           *datastore.Key `json:"-"`
	AssociatedRh            *datastore.Key `json:"-"`
	PlanId                  PlanInt`json:"-"`
}

/* API struct */
type APICoachee struct {
	Id                      string `json:"id"`
	Email                   string `json:"email"`
	DisplayName             string `json:"display_name"`
	AvatarURL               string`json:"avatar_url"`
	StartDate               time.Time `json:"start_date"`
	AvailableSessionsCount  int `json:"available_sessions_count"`
	UpdateSessionsCountDate time.Time `json:"update_sessions_count_date"`
	SelectedCoach           *Coach `json:"selectedCoach"`
	AssociatedRh            *Rh `json:"associatedRh"`
	Plan                    *Plan `json:"plan"`
}

func (c *Coachee) ToCoacheeAPI(coach *Coach, rh *Rh, plan *Plan) *APICoachee {
	var res APICoachee
	res.Id = c.Key.Encode()
	res.Email = c.Email
	res.DisplayName = c.DisplayName
	res.AvatarURL = c.AvatarURL
	res.StartDate = c.StartDate
	res.AvailableSessionsCount = c.AvailableSessionsCount
	res.UpdateSessionsCountDate = c.UpdateSessionsCountDate
	res.SelectedCoach = coach
	res.AssociatedRh = rh
	res.Plan = plan

	return &res
}

func (c *Coachee) getSelectedCoach(ctx context.Context) (*Coach, error) {
	log.Debugf(ctx, "getSelectedCoach")

	var coach *Coach
	if c.SelectedCoach != nil {
		var err error
		coach, err = GetCoach(ctx, c.SelectedCoach)
		if err != nil {
			return nil, err
		}
	}
	return coach, nil
}

// get all coachees for this RH
func GetCoacheesForRh(ctx context.Context, rhKey *datastore.Key) ([]*Coachee, error) {
	log.Debugf(ctx, "getCoacheesForRh")

	var coachees []*Coachee
	keys, err := datastore.NewQuery(COACHEE_ENTITY).Filter("AssociatedRh =", rhKey).GetAll(ctx, &coachees)
	if err != nil {
		return nil, err
	}

	//get Keys
	for i, coachee := range coachees {
		coachee.Key = keys[i]
	}

	return coachees, nil

}

func GetCoachee(ctx context.Context, key *datastore.Key) (*Coachee, error) {
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
	coachee, err := GetCoachee(ctx, key)
	if err != nil {
		return nil, err
	}

	//convert to API object
	apiCoachee, err := coachee.GetAPICoachee(ctx)
	if err != nil {
		return nil, err
	}

	log.Debugf(ctx, "getCoachee, response %s", apiCoachee)

	return apiCoachee, nil
}

func (c *Coachee)GetAPICoachee(ctx context.Context) (*APICoachee, error) {

	//now get selected Coach if any
	coach, err := c.getSelectedCoach(ctx)
	if err != nil {
		return nil, err
	}

	//get the Rh
	rh, err := GetRh(ctx, c.AssociatedRh)

	//get the plan
	plan := CreatePlanFromId(c.PlanId)

	//convert to API object
	var apiCoachee = c.ToCoacheeAPI(coach, rh, plan)

	log.Debugf(ctx, "GetAPICoachee, response %s", apiCoachee)

	return apiCoachee, nil
}


//get all coachees
func GetAllCoachees(ctx context.Context) ([]*Coachee, error) {
	var coachees []*Coachee
	keys, err := datastore.NewQuery(COACHEE_ENTITY).GetAll(ctx, &coachees)
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

	coachees, err := GetAllCoachees(ctx)
	if err != nil {
		return nil, err
	}

	var response []*APICoachee = make([]*APICoachee, len(coachees))
	for i, coachee := range coachees {
		log.Debugf(ctx, "GetAllAPICoachees, coachee %s, index %s", coachee, i)

		response[i], err = GetAPICoachee(ctx, coachee.Key)
		if err != nil {
			return nil, err
		}
	}

	return response, nil
}

func GetCoacheeForEmail(ctx context.Context, email string) ([]*Coachee, error) {
	log.Debugf(ctx, "GetCoacheeForEmail %s", email)

	var coachees []*Coachee
	keys, err := datastore.NewQuery(COACHEE_ENTITY).Filter("Email =", email).GetAll(ctx, &coachees)
	if err != nil {
		return nil, err
	}

	//get Keys
	for i, coachee := range coachees {
		coachee.Key = keys[i]
	}

	return coachees, nil
}

func createCoacheeFromFirebaseUser(ctx context.Context, fbUser *FirebaseUser, planId PlanInt, rhKey *datastore.Key) (*APICoachee, error) {
	log.Debugf(ctx, "CoacheeFromFirebaseUser, fbUser %s, planId %s", fbUser, planId)

	var coachee Coachee
	coachee.Key = datastore.NewIncompleteKey(ctx, COACHEE_ENTITY, nil)

	//create new user
	coachee.FirebaseId = fbUser.UID
	coachee.Email = fbUser.Email
	coachee.DisplayName = fbUser.Email
	coachee.AvatarURL = gravatarURL(fbUser.Email)
	coachee.StartDate = time.Now()
	coachee.PlanId = planId
	coachee.AssociatedRh = rhKey

	//calculate available sessions
	var count = getSessionsCount(planId)
	coachee.AvailableSessionsCount = count
	coachee.UpdateSessionsCountDate = time.Now()

	//log.Infof(ctx, "saving new user: %s", aeuser.String())
	log.Debugf(ctx, "saving new user, firebase id  : %s, email : %s ", fbUser.UID, fbUser.Email)

	err := coachee.Update(ctx)
	if err != nil {
		return nil, err
	}
	//convert to API object
	apiCoachee, err := coachee.GetAPICoachee(ctx)
	if err != nil {
		return nil, err
	}

	return apiCoachee, nil
}

func GetCoacheeFromFirebaseId(ctx context.Context, fbId string) (*APICoachee, error) {
	log.Debugf(ctx, "getCoacheeFromFirebaseId id : %s", fbId)

	var coachees []*Coachee
	keys, err := datastore.NewQuery(COACHEE_ENTITY).Filter("FirebaseId =", fbId).GetAll(ctx, &coachees)
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
	coachee.Key = key

	//convert to API object
	apiCoachee, err := coachee.GetAPICoachee(ctx)
	if err != nil {
		return nil, err
	}

	return apiCoachee, nil
}

func (c *Coachee)Update(ctx context.Context) (error) {
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
 Update coachee's meetings with the selected coach.
 */
func (c *Coachee) UpdateSelectedCoach(ctx context.Context, coach *Coach) (error) {
	log.Debugf(ctx, "UpdateSelectedCoach : %s", coach)

	//associate the coachee with the given coach
	c.SelectedCoach = coach.Key
	err := c.Update(ctx)
	if err != nil {
		return err
	}

	//update meetings with selected coach
	err = associateCoachWithMeetings(ctx, c.Key, coach.Key)
	if err != nil {
		return err
	}

	return nil
}

func (c *Coachee) RefreshAvailableSessionsCount(ctx context.Context) (error) {
	plan := CreatePlanFromId(c.PlanId)

	//check if we can refresh
	if (canResetAvailableSessionsCount(ctx, c)) {
		//set value
		c.AvailableSessionsCount = plan.SessionsCount
		//refresh date
		c.UpdateSessionsCountDate = time.Now()

		log.Debugf(ctx, "refreshAvailableSessionsCount, for user %s, count %s", c.Email, c.AvailableSessionsCount)

		//save
		err := c.Update(ctx)
		if err != nil {
			return err
		}
	}
	return nil
}

func canResetAvailableSessionsCount(ctx context.Context, c *Coachee) bool {
	var isDevServer = appengine.IsDevAppServer() && !utils.IsLiveEnvironment(ctx)
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
func (c *Coachee) DecreaseAvailableSessionsCount(ctx context.Context) error {

	//decrease of 1
	c.AvailableSessionsCount = c.AvailableSessionsCount - 1

	//save
	err := c.Update(ctx)
	if err != nil {
		return err
	}

	return nil
}

// increase number of available sessions and save in datastore
func (c *Coachee) IncreaseAvailableSessionsCount(ctx context.Context) error {

	//inc of 1
	c.AvailableSessionsCount = c.AvailableSessionsCount + 1

	//save
	err := c.Update(ctx)
	if err != nil {
		return err
	}

	return nil
}