package model

import (
	"google.golang.org/appengine/datastore"
	"golang.org/x/net/context"
	"time"
	"google.golang.org/appengine/log"
)

const RH_ENTITY string = "Rh"

type Rh struct {
	Key         *datastore.Key `json:"id" datastore:"-"`
	Email       string `json:"email"`
	FirebaseId  string `json:"firebase_id"`
	DisplayName string `json:"display_name"`
	StartDate   time.Time `json:"start_date"`
}

func CreateRhFromFirebaseUser(ctx context.Context, fbUser *FirebaseUser) (*Rh, error) {
	log.Debugf(ctx, "CreateRhFromFirebaseUser")

	var rh Rh
	rh.Key = datastore.NewIncompleteKey(ctx, RH_ENTITY, nil)

	//create new user
	rh.FirebaseId = fbUser.UID
	rh.Email = fbUser.Email
	rh.DisplayName = fbUser.Email
	rh.StartDate = time.Now()

	log.Debugf(ctx, "saving new rh, firebase id  : %s, email : %s ", fbUser.UID, fbUser.Email)

	err := rh.update(ctx)
	if err != nil {
		return nil, err
	}
	return &rh, nil
}

func GetRhFromFirebaseId(ctx context.Context, fbId string) (*Rh, error) {
	log.Debugf(ctx, "getFromFirebaseId, rh id : %s", fbId)

	var rhs []*Rh
	keys, err := datastore.NewQuery(RH_ENTITY).Filter("FirebaseId =", fbId).GetAll(ctx, &rhs)
	if err != nil {
		return nil, err
	}

	if len(keys) == 0 {
		log.Debugf(ctx, "GetRhFromFirebaseId no keys")
		return nil, ErrNoUser
	}

	rh, err := get(ctx, keys[0])
	if err != nil {
		return nil, err
	}

	return rh, nil
}

func get(ctx context.Context, key *datastore.Key) (*Rh, error) {
	var rh Rh
	err := datastore.Get(ctx, key, &rh)
	if err != nil {
		return nil, err
	}
	rh.Key = key
	return &rh, nil
}

func (rh *Rh) update(ctx context.Context) error {
	key, err := datastore.Put(ctx, rh.Key, rh)
	if err != nil {
		return err
	}
	rh.Key = key

	return nil
}