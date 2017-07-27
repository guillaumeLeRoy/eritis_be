package model

import (
	"google.golang.org/appengine/datastore"
	"time"
	"golang.org/x/net/context"
	"google.golang.org/appengine/log"
	"crypto/md5"
	"io"
	"fmt"
	"strings"
)

const COACH_ENTITY string = "Coach"
const ROOM_APPEAR_IN_BASE_URL string = "https://appear.in/eritis"

type Coach struct {
	Key                       *datastore.Key `datastore:"-"`
	Email                     string
	FirebaseId                string
	FirstName                 string
	LastName                  string
	AvatarURL                 string
	ChatRoomURL               string
	Score                     int
	SessionsCount             int
	StartDate                 time.Time
	Description               string
	LinkedinUrl               string
	Training                  string
	Degree                    string
	ExtraActivities           string
	CoachForYears             string
	CoachingExperience        string
	CoachingHours             string
	Supervisor                string
	FavoriteCoachingSituation string
	Status                    string
	Revenues                  string
	InsuranceUrl              string
	InvoiceEntity             string
	InvoiceAddress            string
	InvoiceCity               string
	InvoicePostcode           string
	Languages                 string
}

type CoachAPI struct {
	Id                        string `json:"id"`
	Email                     string `json:"email"`
	FirstName                 string `json:"first_name"`
	LastName                  string `json:"last_name"`
	AvatarURL                 string `json:"avatar_url"`
	ChatRoomURL               string `json:"chat_room_url"`
	Score                     int    `json:"score"`
	StartDate                 time.Time `json:"start_date"`
	Description               string `json:"description"`
	SessionsCount             int    `json:"sessions_count"`
	LinkedinUrl               string `json:"linkedin_url"`
	Training                  string `json:"training"`
	Degree                    string `json:"degree"`
	ExtraActivities           string `json:"extraActivities"`    //ActivitiesOutOfCoaching
	CoachForYears             string `json:"coachForYears"`      // been a coach xx years
	CoachingExperience        string `json:"coachingExperience"` // coaching experience
	CoachingHours             string `json:"coachingHours"`      // number of coaching hours
	Supervisor                string `json:"supervisor"`
	FavoriteCoachingSituation string `json:"favoriteCoachingSituation"`
	Status                    string `json:"status"`
	Revenues                  string `json:"revenues"` //revenues for last 3 years
	InsuranceUrl              string `json:"insurance_url"`
	InvoiceEntity             string `json:"invoice_entity"`
	InvoiceAddress            string `json:"invoice_address"`
	InvoiceCity               string `json:"invoice_city"`
	InvoicePostcode           string `json:"invoice_postcode"`
	Languages                 string `json:"languages"`
}

func (c *Coach) ToCoachAPI() *CoachAPI {
	var res CoachAPI
	res.Id = c.Key.Encode()
	res.Email = c.Email
	res.FirstName = c.FirstName
	res.LastName = c.LastName
	res.AvatarURL = c.AvatarURL
	res.ChatRoomURL = c.ChatRoomURL
	res.Score = c.Score
	res.StartDate = c.StartDate
	res.Description = c.Description
	res.SessionsCount = c.SessionsCount

	res.LinkedinUrl = c.LinkedinUrl
	res.Training = c.Training
	res.Degree = c.Degree
	res.ExtraActivities = c.ExtraActivities
	res.CoachForYears = c.CoachForYears
	res.CoachingExperience = c.CoachingExperience
	res.CoachingHours = c.CoachingHours
	res.Supervisor = c.Supervisor
	res.FavoriteCoachingSituation = c.FavoriteCoachingSituation
	res.Status = c.Status
	res.Revenues = c.Revenues
	res.InsuranceUrl = c.InsuranceUrl
	res.InvoiceEntity = c.InvoiceEntity
	res.InvoiceAddress = c.InvoiceAddress
	res.InvoiceCity = c.InvoiceCity
	res.InvoicePostcode = c.InvoicePostcode
	res.Languages = c.Languages

	return &res
}

func gravatarURL(email string) string {
	m := md5.New()
	io.WriteString(m, strings.ToLower(email))
	return fmt.Sprintf("//www.gravatar.com/avatar/%x", m.Sum(nil))
}

func appearInUrl(email string) string {
	m := md5.New()
	io.WriteString(m, strings.ToLower(email))
	return fmt.Sprintf("%s/%x", ROOM_APPEAR_IN_BASE_URL, m.Sum(nil))
}

//get User for the given user id
func GetCoach(ctx context.Context, key *datastore.Key) (*Coach, error) {
	log.Debugf(ctx, "getCoach, for key %s", key)

	var coach Coach
	err := datastore.Get(ctx, key, &coach)
	if err != nil {
		return nil, err
	}
	coach.Key = key

	return &coach, nil
}

func GetAllCoach(ctx context.Context) ([]*Coach, error) {
	var coachs []*Coach
	keys, err := datastore.NewQuery(COACH_ENTITY).GetAll(ctx, &coachs)
	if err != nil {
		return nil, err
	}

	for i, coach := range coachs {
		coach.Key = keys[i]
	}

	return coachs, nil
}

func GetAllAPICoachs(ctx context.Context) ([]*CoachAPI, error) {
	log.Debugf(ctx, "GetAllAPICoachs")

	coachs, err := GetAllCoach(ctx)
	if err != nil {
		return nil, err
	}

	var response []*CoachAPI = make([]*CoachAPI, len(coachs))
	for i, coach := range coachs {
		log.Debugf(ctx, "GetAllAPICoach, coach %s, index %s", coach, i)
		response[i] = coach.ToCoachAPI()
	}

	return response, nil
}

func CreateCoachFromFirebaseUser(ctx context.Context, fbUser *FirebaseUser) (*Coach, error) {
	log.Debugf(ctx, "CoachFromFirebaseUser")

	var coach Coach
	coach.Key = datastore.NewIncompleteKey(ctx, COACH_ENTITY, nil)

	//create new user
	coach.FirebaseId = fbUser.UID
	coach.Email = fbUser.Email
	coach.FirstName = ""
	coach.LastName = ""
	coach.AvatarURL = gravatarURL(fbUser.Email)
	coach.ChatRoomURL = appearInUrl(fbUser.Email)
	coach.StartDate = time.Now()

	//log.Infof(ctx, "saving new user: %s", aeuser.String())
	log.Debugf(ctx, "saving new user, firebase id  : %s, email : %s ", fbUser.UID, fbUser.Email)

	key, err := datastore.Put(ctx, coach.Key, &coach)
	if err != nil {
		return nil, err
	}
	coach.Key = key

	return &coach, nil
}

func getCoachFromFirebaseId(ctx context.Context, fbId string) (*Coach, error) {
	log.Debugf(ctx, "getCoachFromFirebaseId id : %s", fbId)

	var coachs []*Coach
	keys, err := datastore.NewQuery(COACH_ENTITY).Filter("FirebaseId =", fbId).GetAll(ctx, &coachs)
	if err != nil {
		return nil, err
	}

	if len(keys) == 0 {
		log.Debugf(ctx, "getCoachFromFirebaseId no keys")
		return nil, ErrNoUser
	}

	//todo too many users ??
	var coach Coach
	var key = keys[0]
	err = datastore.Get(ctx, key, &coach)
	if err != nil {
		return nil, err
	}
	coach.Key = key
	return &coach, nil
}

func (c *Coach) Update(ctx context.Context) (error) {
	log.Debugf(ctx, "update coach : %s", c)

	key, err := datastore.Put(ctx, c.Key, c)
	if err != nil {
		return err
	}
	c.Key = key

	return nil
}

func GetCoachForEmail(ctx context.Context, email string) ([]*Coach, error) {
	log.Debugf(ctx, "GetCoachForEmail %s", email)

	var coachs []*Coach
	keys, err := datastore.NewQuery(COACH_ENTITY).Filter("Email =", email).GetAll(ctx, &coachs)
	if err != nil {
		return nil, err
	}

	//get Keys
	for i, coach := range coachs {
		coach.Key = keys[i]
	}

	return coachs, nil
}

func (c *CoachAPI) GetDisplayName() string {
	if c.FirstName != "" && c.LastName != "" {
		return fmt.Sprintf("%s %s", c.FirstName, c.LastName)
	} else {
		return c.Email
	}
}

func (c *Coach) IncreaseSessionsCount(ctx context.Context) error {
	c.SessionsCount += c.SessionsCount + 1
	c.Update(ctx)
	return nil
}

func (c *Coach) AddRate(ctx context.Context, coachRate *CoachRate) error {
	if c.Score == 0 {
		c.Score = coachRate.Rate
	} else {
		c.Score = (coachRate.Rate + c.Score ) / 2
	}
	c.Update(ctx)
	return nil
}
