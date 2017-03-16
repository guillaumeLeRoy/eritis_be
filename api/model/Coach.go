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

func gravatarURL(email string) string {
	m := md5.New()
	io.WriteString(m, strings.ToLower(email))
	return fmt.Sprintf("//www.gravatar.com/avatar/%x", m.Sum(nil))
}

//get User for the given user id
func GetCoach(ctx context.Context, key *datastore.Key) (*Coach, error) {
	log.Debugf(ctx, "getCoach, for key %s",key)

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
	keys, err := datastore.NewQuery("Coach").GetAll(ctx, &coachs)
	if err != nil {
		return nil, err
	}

	for i, coach := range coachs {
		coach.Key = keys[i]
	}

	return coachs, nil
}

func CreateCoachFromFirebaseUser(ctx context.Context, fbUser *FirebaseUser) (*Coach, error) {
	log.Debugf(ctx, "CoachFromFirebaseUser")

	var coach Coach
	coach.Key = datastore.NewIncompleteKey(ctx, "Coach", nil)

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
	keys, err := datastore.NewQuery("Coach").Filter("FirebaseId =", fbId).GetAll(ctx, &coachs)
	if err != nil {
		return nil, err
	}

	keysBis, err := datastore.NewQuery("Coach").GetAll(ctx, &coachs)
	for _, key := range keysBis {
		log.Debugf(ctx, "getCoachFromFirebaseId key ", key)
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

	key, err := datastore.Put(ctx, c.Key, c)
	if err != nil {
		return err
	}
	c.Key = key

	return nil
}

