package api

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
	Coachee *APICoachee `json:"coachee"`
}

func ( u FirebaseUser) OK() error {
	if u.Email == "" {
		errors.New("use should have an email")
	}
	return nil
}


// ErrNoUser is the error that is returned when the
// datastore instance is unable to provide a User because it doesn't exist.
var ErrNoUser = errors.New("user : No user found")

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

func (u *FirebaseUser) CreateCoachee(ctx context.Context) (*APICoachee, error) {
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
}
