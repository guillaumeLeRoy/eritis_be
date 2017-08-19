package model

import (
	"time"
	"google.golang.org/appengine/datastore"
	"golang.org/x/net/context"
	"google.golang.org/appengine/log"
	"eritis_be/pkg/utils"
	"google.golang.org/appengine"
	"fmt"
)

const COACHEE_ENTITY string = "Coachee"

/* Internal struct */
type Coachee struct {
	Key                        *datastore.Key
	FirebaseId                 string
	CoacheeDescription
	CoacheeObjective           *datastore.Key
	AssociatedRh               *datastore.Key
	PlanId                     PlanInt
	AvailableSessionsCount     int
	UpdateSessionsCountDate    time.Time
	SessionsDoneThisMonthCount int
	SessionsDoneTotalCount     int
}

type CoacheeDescription struct {
	Email     string `json:"email"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	AvatarURL string`json:"avatar_url"`
	StartDate time.Time `json:"start_date"`
}

/* API struct */
type CoacheeAPI struct {
	Id                         string `json:"id"`
	CoacheeDescription
	AvailableSessionsCount     int `json:"available_sessions_count"`
	UpdateSessionsCountDate    time.Time `json:"update_sessions_count_date"`
	SessionsDoneThisMonthCount int `json:"sessions_done_month_count"`
	SessionsDoneTotalCount     int `json:"sessions_done_total_count"`
	AssociatedRh               *RhAPI `json:"associatedRh"`
	Plan                       *Plan `json:"plan"`
	CoacheeObjective           *CoacheeObjective `json:"last_objective"`
}

func (c *Coachee) ToCoacheeAPI(rh *Rh, plan *Plan, coacheeObjective *CoacheeObjective) *CoacheeAPI {
	var res CoacheeAPI
	res.Id = c.Key.Encode()
	res.Email = c.Email
	res.FirstName = c.FirstName
	res.LastName = c.LastName
	res.AvatarURL = c.AvatarURL
	res.StartDate = c.StartDate
	res.AvailableSessionsCount = c.AvailableSessionsCount
	res.SessionsDoneThisMonthCount = c.SessionsDoneThisMonthCount
	res.SessionsDoneTotalCount = c.SessionsDoneTotalCount
	res.UpdateSessionsCountDate = c.UpdateSessionsCountDate
	res.AssociatedRh = rh.ToRhAPI()
	res.Plan = plan
	res.CoacheeObjective = coacheeObjective
	return &res
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
func GetAPICoachee(ctx context.Context, key *datastore.Key) (*CoacheeAPI, error) {
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

func (c *Coachee) GetAPICoachee(ctx context.Context) (*CoacheeAPI, error) {

	//get the Rh
	rh, err := GetHR(ctx, c.AssociatedRh)
	if err != nil {
		return nil, err
	}

	//get the plan
	plan := CreatePlanFromId(c.PlanId)

	// get objective
	objective, err := GetObjectiveForCoachee(ctx, c.Key)

	//convert to API object
	var apiCoachee = c.ToCoacheeAPI(rh, plan, objective)

	log.Debugf(ctx, "GetAPICoachee, response %s", apiCoachee)

	return apiCoachee, nil
}

//get all coachees
func GetAllCoachees(ctx context.Context) ([]*Coachee, error) {
	log.Debugf(ctx, "GetAllCoachees")

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
func GetAllAPICoachees(ctx context.Context) ([]*CoacheeAPI, error) {
	log.Debugf(ctx, "GetAllAPICoachees")

	coachees, err := GetAllCoachees(ctx)
	if err != nil {
		return nil, err
	}

	var response []*CoacheeAPI = make([]*CoacheeAPI, len(coachees))
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

func createCoacheeFromFirebaseUser(ctx context.Context, fbUser *FirebaseUser, planId PlanInt, rhKey *datastore.Key) (*Coachee, error) {
	log.Debugf(ctx, "CoacheeFromFirebaseUser, fbUser %s, planId %s", fbUser, planId)

	var coachee Coachee
	coachee.Key = datastore.NewIncompleteKey(ctx, COACHEE_ENTITY, nil)

	//create new user
	coachee.FirebaseId = fbUser.UID
	coachee.Email = fbUser.Email
	coachee.FirstName = ""
	coachee.LastName = ""
	coachee.AvatarURL = gravatarURL(fbUser.Email)
	coachee.StartDate = time.Now()
	coachee.PlanId = planId
	coachee.AssociatedRh = rhKey

	//calculate available sessions
	var count = getSessionsCount(planId)
	coachee.AvailableSessionsCount = count
	coachee.UpdateSessionsCountDate = time.Now()
	coachee.SessionsDoneTotalCount = 0
	coachee.SessionsDoneThisMonthCount = 0

	//log.Infof(ctx, "saving new user: %s", aeuser.String())
	log.Debugf(ctx, "saving new user, firebase id  : %s, email : %s ", fbUser.UID, fbUser.Email)

	err := coachee.Update(ctx)
	if err != nil {
		return nil, err
	}

	return &coachee, nil
}

func GetCoacheeFromFirebaseId(ctx context.Context, fbId string) (*CoacheeAPI, error) {
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

func (c *Coachee) Update(ctx context.Context) (error) {
	log.Debugf(ctx, "update coachee, email : %s, key : %s ", c.Email, c.Key)

	key, err := datastore.Put(ctx, c.Key, c)
	if err != nil {
		return err
	}
	c.Key = key

	return nil
}

func (c *Coachee) RefreshAvailableSessionsCount(ctx context.Context) (error) {
	plan := CreatePlanFromId(c.PlanId)

	//check if we can refresh
	if canResetAvailableSessionsCount(ctx, c) {
		//set value
		c.AvailableSessionsCount = plan.SessionsCount
		//refresh date
		c.UpdateSessionsCountDate = time.Now()
		// reset "sessions done" count
		c.SessionsDoneThisMonthCount = 0;
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

// increase number of sessions done
func (c *Coachee) IncreaseSessionsDoneCount(ctx context.Context) error {

	//inc of 1
	c.SessionsDoneThisMonthCount++
	c.SessionsDoneTotalCount++

	//save
	err := c.Update(ctx)
	if err != nil {
		return err
	}

	return nil
}

func (c *CoacheeAPI) GetDisplayName() string {
	if c.FirstName != "" && c.LastName != "" {
		return fmt.Sprintf("%s %s", c.FirstName, c.LastName)
	} else {
		return c.Email
	}
}
