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

type Coach struct {
	Key         *datastore.Key `json:"id" datastore:"-"`
	Email       string `json:"email"`
	FirebaseId  string `json:"firebase_id"`
	DisplayName string `json:"display_name"`
	AvatarURL   string`json:"avatar_url"`
	Score       string `json:"score"`
	StartDate   time.Time `json:"start_date"`
	Description string `json:"description"`
}

type CoachAPI struct {
	Id          string`json:"id"`
	Email       string `json:"email"`
	DisplayName string `json:"display_name"`
	AvatarURL   string`json:"avatar_url"`
	Score       string `json:"score"`
	StartDate   time.Time `json:"start_date"`
	Description string `json:"description"`
}

func (c *Coach) ToCoachAPI() *CoachAPI {
	var res CoachAPI
	res.Id = c.Key.Encode()
	res.Email = c.Email
	res.DisplayName = c.DisplayName
	res.AvatarURL = c.AvatarURL
	res.Score = c.Score
	res.StartDate = c.StartDate
	res.Description = c.Description

	return &res
}

func gravatarURL(email string) string {
	m := md5.New()
	io.WriteString(m, strings.ToLower(email))
	return fmt.Sprintf("//www.gravatar.com/avatar/%x", m.Sum(nil))
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
	coach.DisplayName = fbUser.Email
	coach.AvatarURL = gravatarURL(fbUser.Email)
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

func (c *Coach)Update(ctx context.Context, displayName string, description string, avatarUrl string) (error) {
	log.Debugf(ctx, "update coach displayName : %s", displayName)

	c.DisplayName = displayName
	c.Description = description
	c.AvatarURL = avatarUrl

	err := c.update(ctx)
	if err != nil {
		return err
	}

	return nil
}

func (c *Coach)update(ctx context.Context) (error) {
	log.Debugf(ctx, "update coach : %s", c)

	key, err := datastore.Put(ctx, c.Key, c)
	if err != nil {
		return err
	}
	c.Key = key

	return nil
}

