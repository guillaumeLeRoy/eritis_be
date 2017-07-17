package model

import (
	"time"
	"google.golang.org/appengine/datastore"
	"golang.org/x/net/context"
	"google.golang.org/appengine/log"
	"errors"
)

const POTENTIAL_RH_ENTITY string = "PotentialRh"

type PotentialHR struct {
	Key          *datastore.Key `json:"id" datastore:"-"`
	Email        string `json:"email"`
	FirstName    string `json:"first_name"`
	LastName     string `json:"last_name"`
	CreationDate time.Time `json:"create_date"`
}

type PotentialHRAPI struct {
	Id           string `json:"id"`
	Email        string `json:"email"`
	FirstName    string `json:"first_name"`
	LastName     string `json:"last_name"`
	CreationDate time.Time `json:"create_date"`
}

func (pot *PotentialHR) ToPotentialHRAPI() (*PotentialHRAPI) {
	var res PotentialHRAPI
	res.Id = pot.Key.Encode()
	res.Email = pot.Email
	res.CreationDate = pot.CreationDate
	res.FirstName = pot.FirstName
	res.LastName = pot.LastName
	return &res
}

func CreatePotentialHR(ctx context.Context, email string, firstName string, lastName string) (*PotentialHR, error) {
	log.Debugf(ctx, "CreatePotentialHR, email %s", email)

	var pot PotentialHR
	pot.Email = email
	pot.FirstName = firstName
	pot.LastName = lastName
	pot.CreationDate = time.Now()
	pot.Key = datastore.NewIncompleteKey(ctx, POTENTIAL_RH_ENTITY, nil)

	key, err := datastore.Put(ctx, pot.Key, &pot)
	if err != nil {
		return nil, err
	}
	pot.Key = key

	return &pot, nil
}

func DeletePotentialRh(ctx context.Context, key *datastore.Key) error {
	log.Debugf(ctx, "DeletePotentialRh")

	err := datastore.Delete(ctx, key)
	if err != nil {
		return err
	}

	return nil
}

var ErrNoPotentialRh = errors.New("Potential Rh : No Potential Rh found")

func GetPotentialRhForEmail(ctx context.Context, email string) (*PotentialHR, error) {
	log.Debugf(ctx, "GetPotentialRhForEmail, email %s", email)

	var potentials []*PotentialHR
	keys, err := datastore.NewQuery(POTENTIAL_RH_ENTITY).Filter("Email =", email).GetAll(ctx, &potentials)
	if err != nil {
		return nil, err
	}

	//get Keys
	for i, pot := range potentials {
		pot.Key = keys[i]
	}

	if len(potentials) > 1 {
		return nil, errors.New("Too many potential rh for this email")
	}

	if len(potentials) == 0 {
		return nil, ErrNoPotentialRh
	}

	return potentials[0], nil
}
