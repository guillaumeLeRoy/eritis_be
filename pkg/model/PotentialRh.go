package model

import (
	"time"
	"google.golang.org/appengine/datastore"
	"golang.org/x/net/context"
	"google.golang.org/appengine/log"
	"errors"
)

const POTENTIAL_RH_ENTITY string = "PotentialRh"

type PotentialRh struct {
	Key          *datastore.Key `json:"id" datastore:"-"`
	Email        string `json:"email"`
	CreationDate time.Time `json:"create_date"`
}

type PotentialRhAPI struct {
	Id           string `json:"id"`
	Email        string `json:"email"`
	CreationDate time.Time `json:"create_date"`
}

func (pot *PotentialRh)ToPotentialRhAPI() (*PotentialRhAPI) {
	var res PotentialRhAPI
	res.Id = pot.Key.Encode()
	res.Email = pot.Email
	res.CreationDate = pot.CreationDate
	return &res
}

func CreatePotentialRh(ctx context.Context, email string) (*PotentialRh, error) {
	log.Debugf(ctx, "CreatePotentialRh, email %s", email)

	var pot PotentialRh
	pot.Email = email
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

func GetPotentialRhForEmail(ctx context.Context, email string) (*PotentialRh, error) {
	log.Debugf(ctx, "GetPotentialRhForEmail, email %s", email)

	var potentials []*PotentialRh
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
