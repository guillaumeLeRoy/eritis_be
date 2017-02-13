package model

import (
	"time"
	"google.golang.org/appengine/datastore"
	"golang.org/x/net/context"
	"google.golang.org/appengine/log"
)

type Coachee struct {
	Key         *datastore.Key `json:"id" datastore:"-"`
	FirebaseId  string `json:"firebase_id"`
	DisplayName string `json:"display_name"`
	AvatarURL   string`json:"avatar_url"`
	StartDate   time.Time `json:"start_date"`
	Status      Status `json:"status"`
}



//get Coachee for the given user id
func GetCoachee(ctx context.Context, key *datastore.Key) (*Coach, error) {
	var user Coach
	err := datastore.Get(ctx, key, &user)
	if err != nil {
		return nil, err
	}
	user.Key = key

	log.Debugf(ctx, "getCoachee")

	return &user, nil
}

//get all coachees
func GetAllCoachees(ctx context.Context) ([]*Coachee, error) {
	var coachees []*Coachee
	keys, err := datastore.NewQuery("Coachee").GetAll(ctx, &coachees)
	if err != nil {
		return nil, err
	}

	for i, coachee := range coachees {
		coachee.Key = keys[i]
	}

	return coachees, nil
}

func CreateCoacheeFromFirebaseUser(ctx context.Context, fbUser *FirebaseUser) (*Coachee, error) {
	log.Debugf(ctx, "CoacheeFromFirebaseUser")

	var coach Coachee
	coach.Key = datastore.NewIncompleteKey(ctx, "Coachee", nil)

	//create new user
	coach.FirebaseId = fbUser.UID
	coach.DisplayName = fbUser.Email
	coach.AvatarURL = gravatarURL(fbUser.Email)
	coach.Status = COACHEE
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

func getCoacheeFromFirebaseId(ctx context.Context, fbId string) (*Coachee, error) {
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

	//todo too many users ??
	var coachee Coachee
	var key = keys[0]
	err = datastore.Get(ctx, key, &coachee)//TODO pk refaire un geT ??
	if err != nil {
		return nil, err
	}
	coachee.Key = key
	return &coachee, nil
}