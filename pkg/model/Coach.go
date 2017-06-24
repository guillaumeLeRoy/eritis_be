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
	Key           *datastore.Key `json:"id" datastore:"-"`
	Email         string `json:"email"`
	FirebaseId    string `json:"firebase_id"`
	FirstName     string `json:"firstName"`
	LastName      string `json:"lastName"`
	AvatarURL     string`json:"avatar_url"`
	ChatRoomURL   string`json:"chat_room_url"`
	Score         int `json:"score"`
	SessionsCount int
	StartDate     time.Time `json:"start_date"`
	Description   string `json:"description"`
}

type CoachAPI struct {
	Id            string`json:"id"`
	Email         string `json:"email"`
	FirstName     string `json:"firstName"`
	LastName      string `json:"lastName"`
	AvatarURL     string`json:"avatar_url"`
	ChatRoomURL   string`json:"chat_room_url"`
	Score         int `json:"score"`
	StartDate     time.Time `json:"start_date"`
	Description   string `json:"description"`
	SessionsCount int `json:"sessions_count"`
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
	c.update(ctx)
	return nil
}

func (c *Coach) AddRate(ctx context.Context, coachRate *CoachRate) error {
	if c.Score == 0 {
		c.Score = coachRate.Rate
	} else {
		c.Score = (coachRate.Rate + c.Score ) / 2
	}
	c.update(ctx)
	return nil
}
