package model

import (
	"errors"
	"golang.org/x/net/context"
	"google.golang.org/appengine/log"
	"google.golang.org/appengine/datastore"
)

type FirebaseUser struct {
	Email string `json:"email"`
	UID   string `json:"uid"` //firebaseId
}

type Login struct {
	Coach   *CoachAPI `json:"coach"`
	Coachee *CoacheeAPI `json:"coachee"`
	Rh      *RhAPI `json:"rh"`
}

func (u FirebaseUser) OK() error {
	if u.Email == "" {
		errors.New("use should have an email")
	}
	return nil
}

// ErrNoUser is the error that is returned when the
// datastore instance is unable to provide a User because it doesn't exist.
var ErrNoUser = errors.New("user : No user found")

func CreateCoach(ctx context.Context, u *FirebaseUser) (*Coach, error) {
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

func CreateCoachee(ctx context.Context, u *FirebaseUser, planId PlanInt, rhKey *datastore.Key) (*Coachee, error) {
	log.Debugf(ctx, "CreateCoachee, create, %s", u)

	coacheeAPI, err := GetCoacheeFromFirebaseId(ctx, u.UID)
	if err != nil && err != ErrNoUser {
		return nil, errors.New("Error trying to know if a user is already in the datastore")
	}

	if coacheeAPI != nil {
		return nil, errors.New("coachee already exists")
	}

	//create a new coachee
	coachee, err := createCoacheeFromFirebaseUser(ctx, u, planId, rhKey)
	if err != nil {
		return nil, err
	}

	log.Debugf(ctx, "firebaseUser, coachee created %s", coachee)

	return coachee, nil
}

func CreateRH(ctx context.Context, u *FirebaseUser, firstName string, lastName string, companyName string) (*Rh, error) {
	log.Debugf(ctx, "createRH, create, %s", u)

	rh, err := GetRhFromFirebaseId(ctx, u.UID)
	if err != nil && err != ErrNoUser {
		return nil, errors.New("Error trying to know if a user is already in the datastore")
	}

	if rh != nil {
		return nil, errors.New("Rh already exists")
	}

	//create a new user
	rh, err = CreateRhFromFirebaseUser(ctx, u, firstName, lastName)
	if err != nil {
		return nil, err
	}

	// update
	rh.CompanyName = companyName

	rh.Update(ctx)
	if err != nil {
		return nil, err
	}

	log.Debugf(ctx, "firebaseUser, Rh created %s", rh)

	return rh, nil

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
		//convert to API object
		api := coach.ToCoachAPI()
		//we have a coach
		return &Login{Coach: api}, nil
	}

	//no coach

	//get a coachee
	coachee, err := GetCoacheeFromFirebaseId(ctx, u.UID)
	if err != nil && err != ErrNoUser {
		return nil, err
	}

	//no coachee
	if err == nil {
		log.Debugf(ctx, "GetUser, found a coachee")
		//we have a coachee
		return &Login{Coachee: coachee}, nil
	}

	//no coachee

	//try to get a RH
	rh, err := GetRhFromFirebaseId(ctx, u.UID)
	if err == nil {
		log.Debugf(ctx, "GetUser, found a rh")
		//convert into API object
		api := rh.ToRhAPI()
		//we have a rh
		return &Login{Rh: api}, nil
	}
	//no rh
	log.Debugf(ctx, "GetUser, no one")

	//no one ...
	return nil, ErrNoUser
}
