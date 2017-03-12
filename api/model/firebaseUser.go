package model

import (
	"errors"
	"golang.org/x/net/context"
	"google.golang.org/appengine/log"
)

type FirebaseUser struct {
	Email string `json:"email"`
	UID   string `json:"uid"` //firebaseId
}

type Login struct {
	Coach   *Coach `json:"coach"`
	Coachee *Coachee `json:"coachee"`
}

func ( u FirebaseUser) OK() error {
	if u.Email == "" {
		errors.New("use should have an email")
	}
	return nil
}


//User status
//type Status int
//
//const (
//	COACH Status = 1 + iota
//	COACHEE
//)

// ErrNoUser is the error that is returned when the
// datastore instance is unable to provide a User because it doesn't exist.
var ErrNoUser = errors.New("user : No user found")

//
//func (u *FirebaseUser) create(ctx context.Context) (interface{}, error) {
//	log.Debugf(ctx, "firebaseUser, create, %s", u)
//
//	//make sure a user doesn't already exists for the given Firebase User
//	user, err := u.GetUser(ctx)
//	if err != nil && err != ErrNoUser {
//		return nil, errors.New("Error trying to know if a user is already in the datastore")
//	}
//
//	if user != nil {
//		return nil, errors.New("User already exists")
//	}
//
//	//create a new user
//	user, err = UserFromFirebaseUser(ctx, u)
//	if err != nil {
//		return nil, err
//	}
//
//	log.Debugf(ctx, "firebaseUser, user created %s", user)
//
//	return user, nil
//}

func (u *FirebaseUser) CreateCoach(ctx context.Context) (*Coach, error) {
	log.Debugf(ctx, "CreateCoach, create, %s", u)

	coach, err := getCoachFromFirebaseId(ctx, u.UID)
	if err != nil && err != ErrNoUser {
		return nil, errors.New("Error trying to know if a user is already in the datastore")
	}

	if coach != nil {
		return nil, errors.New("Coach already exists")
	}

	//create a new user
	coach, err = CreateCoachFromFirebaseUser(ctx, u)
	if err != nil {
		return nil, err
	}

	log.Debugf(ctx, "firebaseUser, coach created %s", coach)

	return coach, nil

}

func (u *FirebaseUser) CreateCoachee(ctx context.Context) (*Coachee, error) {
	log.Debugf(ctx, "CreateCoachee, create, %s", u)

	coachee, err := getCoacheeFromFirebaseId(ctx, u.UID)
	if err != nil && err != ErrNoUser {
		return nil, errors.New("Error trying to know if a user is already in the datastore")
	}

	if coachee != nil {
		return nil, errors.New("coachee already exists")
	}

	//create a new coachee
	coachee, err = CreateCoacheeFromFirebaseUser(ctx, u)
	if err != nil {
		return nil, err
	}

	log.Debugf(ctx, "firebaseUser, coachee created %s", coachee)

	return coachee, nil
}

//get User for the given user Firebase id
func (u *FirebaseUser) GetUser(ctx context.Context) (*Login, error) {
	log.Debugf(ctx, "firebaseUser, GetUser with FB id : %s", u.UID)

	coach, err := getCoachFromFirebaseId(ctx, u.UID)
	if err != nil && err != ErrNoUser {
		return nil, err
	}

	if err == nil {
		log.Debugf(ctx, "GetUser, found a coach")
		//we have a coach
		return &Login{Coach:coach}, nil
	}

	//no coach
	coachee, err := getCoacheeFromFirebaseId(ctx, u.UID)
	if err != nil && err != ErrNoUser {
		return nil, err
	}

	//no coachee
	if err == nil {
		log.Debugf(ctx, "GetUser, found a coachee")

		//we have a coachee
		return &Login{Coachee:coachee}, nil
	}

	log.Debugf(ctx, "GetUser, no one")

	//no one ...
	return nil, ErrNoUser


	//var users []*User
	//
	//log.Debugf(ctx, "firebaseUser, GetUser for fbId : %s", u.UID)
	//
	////search in Coach table
	//keys, err := datastore.NewQuery("Coach").Filter("FirebaseUID = ", u.UID).GetAll(ctx, &users)
	//if err != nil {
	//	return nil, err
	//}
	//
	//if len(keys) == 0 {
	//	//search in Coachee table
	//	keys, err = datastore.NewQuery("Coachee").Filter("FirebaseUID = ", u.UID).GetAll(ctx, &users)
	//	if err != nil {
	//		return nil, err
	//	}
	//	if len(keys) == 0 {
	//		return nil, ErrNoUser
	//	}
	//	log.Debugf(ctx, "firebaseUser, getUser, found a Coachee")
	//
	//} else {
	//	log.Debugf(ctx, "firebaseUser, getUser, found a Coach")
	//}
	//
	////we have a user
	//var user User
	//var key = keys[0]
	//err = datastore.Get(ctx, key, &user)
	//if err != nil {
	//	return nil, err
	//}
	//user.Key = key
	//return &user, nil
}
