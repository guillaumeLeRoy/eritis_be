package model

import (
	"google.golang.org/appengine/datastore"
	"time"
	"golang.org/x/net/context"
	"google.golang.org/appengine/log"
)

type Coach struct {
	Key         *datastore.Key `json:"id" datastore:"-"`
	FirebaseId  string `json:"firebase_id"`
	DisplayName string `json:"display_name"`
	AvatarURL   string`json:"avatar_url"`
	Score       string `json:"score"`
	StartDate   time.Time `json:"start_date"`
	Status      Status `json:"status"`
}


//get User for the given user id
func GetCoach(ctx context.Context, key *datastore.Key) (*Coach, error) {
	var user Coach
	err := datastore.Get(ctx, key, &user)
	if err != nil {
		return nil, err
	}
	user.Key = key

	log.Debugf(ctx, "getCoach")

	return &user, nil
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
	coach.DisplayName = fbUser.Email
	coach.AvatarURL = gravatarURL(fbUser.Email)
	coach.Status = COACH
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
	var coachs []*Coach
	keys, err := datastore.NewQuery("Coach").Filter("FirebaseUID = ", fbId).GetAll(ctx, &coachs)
	if err != nil {
		return nil, err
	}

	if len(keys) == 0 {
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

