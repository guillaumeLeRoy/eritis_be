package model

import (
	"google.golang.org/appengine/log"
	"google.golang.org/appengine/datastore"
	"errors"
	"golang.org/x/net/context"
)

const POSSIBLE_COACH_ENTITY string = "PossibleCoach"

var ErrNoPossibleCoach = errors.New("Possible coach : No Possible coach found")

type PossibleCoach struct {
	Key                       *datastore.Key `datastore:"-"`
	Email                     string
	FirstName                 string
	LastName                  string
	LinkedinUrl               string
	Description               string
	Training                  string
	Degree                    string
	ExtraActivities           string //ActivitiesOutOfCoaching
	CoachForYears             string // been a coach xx years
	CoachingExperience        string // coaching experience
	CoachingHours             string // number of coaching hours
	Supervisor                string
	FavoriteCoachingSituation string
	Status                    string
	Revenue                   string //revenues for last 3 years
}

type PossibleCoachAPI struct {
	Id                        string `json:"id"`
	Email                     string `json:"email"`
	FirstName                 string `json:"firstName"`
	LastName                  string `json:"lastName"`
	LinkedinUrl               string `json:"linkedin_url"`
	Description               string `json:"description"`
	Training                  string
	Degree                    string
	ExtraActivities           string //ActivitiesOutOfCoaching
	CoachForYears             string // been a coach xx years
	CoachingExperience        string // coaching experience
	CoachingHours             string // number of coaching hours
	Supervisor                string
	FavoriteCoachingSituation string
	Status                    string
	Revenue                   string //revenues for last 3 years
}

func (m *PossibleCoach) Create(ctx context.Context) error {
	log.Debugf(ctx, "Create possible coach", m)

	m.Key = datastore.NewIncompleteKey(ctx, POSSIBLE_COACH_ENTITY, nil)

	err := m.Update(ctx)
	if err != nil {
		return err
	}

	return nil
}

func (m *PossibleCoach) Update(ctx context.Context) error {
	key, err := datastore.Put(ctx, m.Key, m)
	if err != nil {
		return err
	}
	m.Key = key

	return nil
}

func FindPossibleCoachsByEmail(ctx context.Context, email string) (*PossibleCoach, error) {
	log.Debugf(ctx, "find possible coach, email %s", email)

	var potentials []*PossibleCoach
	keys, err := datastore.NewQuery(POSSIBLE_COACH_ENTITY).Filter("Email =", email).GetAll(ctx, &potentials)
	if err != nil {
		return nil, err
	}

	//get Keys
	for i, pot := range potentials {
		pot.Key = keys[i]
	}

	if len(potentials) > 1 {
		return nil, errors.New("Too many possible coach for email")
	}

	if len(potentials) == 0 {
		return nil, ErrNoPossibleCoach
	}

	return potentials[0], nil
}
