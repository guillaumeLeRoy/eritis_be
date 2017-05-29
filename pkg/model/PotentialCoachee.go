package model

import (
	"time"
	"google.golang.org/appengine/datastore"
	"golang.org/x/net/context"
	"google.golang.org/appengine/log"
	"errors"
)

const POTENTIAL_COACHEE_ENTITY string = "PotentialCoachee"

// ancestor : Rh
type PotentialCoachee struct {
	Key          *datastore.Key `json:"id" datastore:"-"`
	Email        string `json:"email"`
	CreationDate time.Time `json:"create_date"`
	PlanId       PlanInt `json:"plan_id"`
}

type PotentialCoacheeAPI struct {
	Id           string `json:"id"`
	Email        string `json:"email"`
	CreationDate time.Time `json:"create_date"`
	Plan         *Plan `json:"plan"`
}

func (pot *PotentialCoachee)ToPotentialCoacheeAPI(plan *Plan) (*PotentialCoacheeAPI) {
	var res PotentialCoacheeAPI
	res.Id = pot.Key.Encode()
	res.Email = pot.Email
	res.CreationDate = pot.CreationDate
	res.Plan = plan
	return &res
}

func CreatePotentialCoachee(ctx context.Context, rhKey *datastore.Key, coacheeEmail string, plan PlanInt) (*PotentialCoachee, error) {
	log.Debugf(ctx, "CreatePotentialCoachee, key %s", rhKey)

	var pot PotentialCoachee
	pot.Email = coacheeEmail
	pot.CreationDate = time.Now()
	pot.Key = datastore.NewIncompleteKey(ctx, POTENTIAL_COACHEE_ENTITY, rhKey)
	pot.PlanId = plan

	key, err := datastore.Put(ctx, pot.Key, &pot)
	if err != nil {
		return nil, err
	}
	pot.Key = key

	return &pot, nil
}

func DeletePotentialCoachee(ctx context.Context, key *datastore.Key) error {
	log.Debugf(ctx, "DeletePotentialCoachee")

	err := datastore.Delete(ctx, key)
	if err != nil {
		return err
	}

	return nil
}

func GetPotentialCoacheesForRh(ctx context.Context, Rhkey *datastore.Key) ([]*PotentialCoachee, error) {
	log.Debugf(ctx, "GetPotentialCoacheesForRh, Rhkey %s", Rhkey)

	var potentials []*PotentialCoachee
	keys, err := datastore.NewQuery(POTENTIAL_COACHEE_ENTITY).Ancestor(Rhkey).GetAll(ctx, &potentials)
	if err != nil {
		return nil, err
	}

	//get Keys
	for i, pot := range potentials {
		pot.Key = keys[i]
	}

	return potentials, nil
}

var ErrNoPotentialCoachee = errors.New("Potential Coachee : No Potential Coachee found")

func GetPotentialCoacheeForEmail(ctx context.Context, coacheeEmail string) (*PotentialCoachee, error) {
	log.Debugf(ctx, "GetPotentialCoacheeForEmail, email %s", coacheeEmail)

	var potentials []*PotentialCoachee
	keys, err := datastore.NewQuery(POTENTIAL_COACHEE_ENTITY).Filter("Email =", coacheeEmail).GetAll(ctx, &potentials)
	if err != nil {
		return nil, err
	}

	//get Keys
	for i, pot := range potentials {
		pot.Key = keys[i]
	}

	if len(potentials) > 1 {
		return nil, errors.New("Too many potential coachee for this email")
	}

	if len(potentials) == 0 {
		return nil, ErrNoPotentialCoachee
	}

	return potentials[0], nil
}