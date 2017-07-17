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
	Email       string
	FirebaseId  string
	FirstName   string
	LastName    string
	Description string
	StartDate   time.Time
	AvatarURL   string
}

type RhAPI struct {
	Id          string `json:"id"`
	Email       string `json:"email"`
	FirstName   string `json:"first_name"`
	LastName    string `json:"last_name"`
	StartDate   time.Time `json:"start_date"`
	AvatarURL   string`json:"avatar_url"`
	Description string  `json:"description"`
}

func (rh *Rh) ToRhAPI() *RhAPI {
	var res RhAPI
	res.Id = rh.Key.Encode()
	res.Email = rh.Email
	res.FirstName = rh.FirstName
	res.LastName = rh.LastName
	res.StartDate = rh.StartDate
	res.AvatarURL = rh.AvatarURL
	return &res
}

func CreateRhFromFirebaseUser(ctx context.Context, fbUser *FirebaseUser, firstName string, lastName string) (*Rh, error) {
	log.Debugf(ctx, "CreateRhFromFirebaseUser")

	var rh Rh
	rh.Key = datastore.NewIncompleteKey(ctx, RH_ENTITY, nil)

	//create new user
	rh.FirebaseId = fbUser.UID
	rh.Email = fbUser.Email
	rh.FirstName = firstName
	rh.LastName = lastName
	rh.StartDate = time.Now()
	rh.AvatarURL = gravatarURL(fbUser.Email)

	log.Debugf(ctx, "saving new rh, firebase id  : %s, email : %s ", fbUser.UID, fbUser.Email)

	err := rh.Update(ctx)
	if err != nil {
		return nil, err
	}
	return &rh, nil
}

func GetAllRhs(ctx context.Context) ([]*Rh, error) {
	log.Debugf(ctx, "GetAllRhs")

	var rhs []*Rh
	keys, err := datastore.NewQuery(RH_ENTITY).GetAll(ctx, &rhs)
	if err != nil {
		return nil, err
	}

	//get Keys
	for i, rh := range rhs {
		rh.Key = keys[i]
	}

	return rhs, nil
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

	rh, err := GetHR(ctx, keys[0])
	if err != nil {
		return nil, err
	}

	return rh, nil
}

func GetHR(ctx context.Context, key *datastore.Key) (*Rh, error) {
	log.Debugf(ctx, "GetHR")

	var rh Rh
	err := datastore.Get(ctx, key, &rh)
	if err != nil {
		return nil, err
	}
	rh.Key = key
	return &rh, nil
}

func (rh *Rh) Update(ctx context.Context) error {
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
