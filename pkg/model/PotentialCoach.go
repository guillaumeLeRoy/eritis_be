package model

import (
	"golang.org/x/net/context"
	"time"
	"google.golang.org/appengine/datastore"
	"google.golang.org/appengine/log"
	"errors"
)

const POTENTIAL_COACH_ENTITY string = "PotentialCoach"

type PotentialCoach struct {
	Key          *datastore.Key `json:"id" datastore:"-"`
	Email        string `json:"email"`
	CreationDate time.Time `json:"create_date"`
}

type PotentialCoachAPI struct {
	Id           string `json:"id"`
	Email        string `json:"email"`
	CreationDate time.Time `json:"create_date"`
}

func (pot *PotentialCoach)ToPotentialCoachAPI() (*PotentialCoachAPI) {
	var res PotentialCoachAPI
	res.Id = pot.Key.Encode()
	res.Email = pot.Email
	res.CreationDate = pot.CreationDate
	return &res
}

func CreatePotentialCoach(ctx context.Context, email string) (*PotentialCoach, error) {
	log.Debugf(ctx, "CreatePotentialCoach, email %s", email)

	var pot PotentialCoach
	pot.Email = email
	pot.CreationDate = time.Now()
	pot.Key = datastore.NewIncompleteKey(ctx, POTENTIAL_COACH_ENTITY, nil)

	key, err := datastore.Put(ctx, pot.Key, &pot)
	if err != nil {
		return nil, err
	}
	pot.Key = key

	return &pot, nil
}

func DeletePotentialCoach(ctx context.Context, key *datastore.Key) error {
	log.Debugf(ctx, "DeletePotentialCoach")

	err := datastore.Delete(ctx, key)
	if err != nil {
		return err
	}

	return nil
}

var ErrNoPotentialCoach = errors.New("Potential Coach : No Potential Coach found")

func GetPotentialCoachForEmail(ctx context.Context, email string) (*PotentialCoach, error) {
	log.Debugf(ctx, "GetPotentialCoachForEmail, email %s", email)

	var potentials []*PotentialCoach
	keys, err := datastore.NewQuery(POTENTIAL_COACH_ENTITY).Filter("Email =", email).GetAll(ctx, &potentials)
	if err != nil {
		return nil, err
	}

	//get Keys
	for i, pot := range potentials {
		pot.Key = keys[i]
	}

	if len(potentials) > 1 {
		return nil, errors.New("Too many potential coach for this email")
	}

	if len(potentials) == 0 {
		return nil, ErrNoPotentialCoach
	}

	return potentials[0], nil
}

