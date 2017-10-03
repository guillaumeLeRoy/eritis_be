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
	Key        *datastore.Key `json:"id" datastore:"-"`
	FirebaseId string

	ChatRoomURL   string    `json:"chat_room_url"`
	Score         int       `json:"score"`
	SessionsCount int       `json:"sessions_count"`
	StartDate     time.Time `json:"start_date"`

	Email             string `json:"email"`
	FirstName         string `json:"first_name"`
	LastName          string `json:"last_name"`
	LinkedinUrl       string `json:"linkedin_url"`
	Description       string `json:"description"`
	MobilePhoneNumber string `json:"mobile_phone_number"`
	Languages         string `json:"languages"`

	Career          string `json:"career"`
	ExtraActivities string `json:"extraActivities"`
	Degree          string `json:"degree"`

	ExperienceCoaching       string `json:"experience_coaching"`
	ExperienceRemoteCoaching string `json:"experience_remote_coaching"`
	ExperienceShortSession   string `json:"experienceShortSession"`
	CoachingSpecifics        string `json:"coachingSpecifics"`
	Supervisor               string `json:"supervisor"`
	TherapyElements          string `json:"therapyElements"`

	RevenuesLastThreeYears      string `json:"revenues_last_3_years"` //revenues for last 3 years
	PercentageCoachingInRevenue string `json:"percentage_coaching_in_revenue"`
	LegalStatus                 string `json:"legal_status"`

	AvatarURL    string `json:"avatar_url"`
	InsuranceUrl string `json:"insurance_url"`

	InvoiceEntity      string `json:"invoice_entity"`
	InvoiceSiretNumber string `json:"invoice_siret_number"`
	InvoiceAddress     string `json:"invoice_address"`
	InvoiceCity        string `json:"invoice_city"`
	InvoicePostcode    string `json:"invoice_postcode"`
	InvoiceRIBurl      string `json:"invoice_rib_url"`
}

type CoachAPI struct {
	*Coach
}

func (c *Coach) ToCoachAPI() *CoachAPI {
	var res CoachAPI
	res.Coach = c
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

//type DataResponse struct {
//	Data       QueryResponse `json:"data"`
//	Total      int
//	NextCursor *datastore.Cursor
//}

type QueryResponse struct {
	Data       []*Coach          `json:"data"`
	Total      int               `json:"total"`
	NextCursor *datastore.Cursor `json:"next"`
}

func GetAllCoach(ctx context.Context) (*QueryResponse, error) {
	return GetAllCoachWithParams(ctx, nil, -1)
}

func GetAllCoachWithParams(ctx context.Context, next *datastore.Cursor, count int) (*QueryResponse, error) {
	var coachs []*Coach = make([]*Coach, 0)

	count, err := datastore.NewQuery(COACH_ENTITY).Count(ctx)

	query := datastore.NewQuery(COACH_ENTITY)

	if count > 0 {
		query.Limit(count)
	}

	if next != nil {
		query.Start(*next)
	}
	it := query.Run(ctx)
	for {
		var c Coach
		key, err := it.Next(&c)
		if err == datastore.Done {
			break // No further entities match the query.
		}
		if err != nil {
			return nil, err
		}
		c.Key = key
		coachs = append(coachs, &c)
	}

	cursor, err := it.Cursor()
	if err != nil {
		return nil, err
	}

	res := QueryResponse{Total: count, NextCursor: &cursor, Data: coachs}

	return &res, nil
}

type APIqueryResponse struct {
	Result     []*CoachAPI       `json:"data"`
	Total      int               `json:"total"`
	NextCursor *datastore.Cursor `json:"next"`
}

func GetAllAPICoachs(ctx context.Context, next *datastore.Cursor, count int) (*APIqueryResponse, error) {
	log.Debugf(ctx, "GetAllAPICoachs")

	queryRes, err := GetAllCoachWithParams(ctx, next, count)
	if err != nil {
		return nil, err
	}

	var coachsAPI []*CoachAPI = make([]*CoachAPI, len(queryRes.Data))
	for i, coach := range queryRes.Data {
		log.Debugf(ctx, "GetAllAPICoach, coach %s, index %s", coach, i)
		coachsAPI[i] = coach.ToCoachAPI()
	}

	res := APIqueryResponse{Total: queryRes.Total, NextCursor: queryRes.NextCursor, Result: coachsAPI}
	return &res, nil
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
