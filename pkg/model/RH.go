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
	AvatarURL   string`json:"avatar_url"`
}

type RhAPI struct {
	Id          string `json:"id"`
	Email       string `json:"email"`
	DisplayName string `json:"display_name"`
	StartDate   time.Time `json:"start_date"`
	AvatarURL   string`json:"avatar_url"`
}

func (rh *Rh) ToRhAPI() *RhAPI {
	var res RhAPI
	res.Id = rh.Key.Encode()
	res.Email = rh.Email
	res.DisplayName = rh.DisplayName
	res.StartDate = rh.StartDate
	res.AvatarURL = rh.AvatarURL
	return &res
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
	rh.AvatarURL = gravatarURL(fbUser.Email)

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

	rh, err := GetRh(ctx, keys[0])
	if err != nil {
		return nil, err
	}

	return rh, nil
}

func GetRh(ctx context.Context, key *datastore.Key) (*Rh, error) {
	log.Debugf(ctx, "GetRh")

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

func GetRhForEmail(ctx context.Context, email string) ([]*Rh, error) {
	log.Debugf(ctx, "GetRhForEmail %s", email)

	var rhs []*Rh
	keys, err := datastore.NewQuery(RH_ENTITY).Filter("Email =", email).GetAll(ctx, &rhs)
	if err != nil {
		return nil, err
	}

	//get Keys
	for i, rh := range rhs {
		rh.Key = keys[i]
	}

	return rhs, nil
}