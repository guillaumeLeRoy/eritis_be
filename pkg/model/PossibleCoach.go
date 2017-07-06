package model

import (
	"google.golang.org/appengine/log"
	"google.golang.org/appengine/datastore"
	"errors"
	"golang.org/x/net/context"
	"eritis_be/pkg/utils"
)

const POSSIBLE_COACH_ENTITY string = "PossibleCoach"
const POSSIBLE_COACH_SEARCH_ENTITY string = "PossibleCoachSearch"

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
	AvatarURL                 string
	AssuranceUrl              string
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
	AvatarURL                 string
	AssuranceUrl              string
}

/*
func CreateCoachSearch(ctx context.Context, email string) (*PossibleCoachSearch, error) {
	log.Debugf(ctx, "Create possible coach search for email %s", email)

	possibleCoachSearch := new(PossibleCoachSearch)
	possibleCoachSearch.Email = email
	//err := datastore.RunInTransaction(ctx, func(ctx context.Context) error {
	log.Debugf(ctx, "Create possible coach search, RunInTransaction")
	key := datastore.NewKey(ctx, POSSIBLE_COACH_SEARCH_ENTITY, email, 0, nil)
	key, err := datastore.Put(ctx, key, possibleCoachSearch) //TODO
	if err != nil {
		log.Debugf(ctx, "Create possible coach search, fail")
		return nil, err
	}
	possibleCoachSearch.Key = key
	//return nil
	//}, &datastore.TransactionOptions{XG: true})

	return possibleCoachSearch, err
}*/

/*
func SearchForPossibleCoach(ctx context.Context, email string) (*PossibleCoachSearch, error) {

	var possibleCoachSearch PossibleCoachSearch

	err := datastore.RunInTransaction(ctx, func(ctx context.Context) error {
		log.Debugf(ctx, "SearchForPossibleCoach, RunInTransaction")

		key, err := datastore.DecodeKey(email)
		if err != nil {
			return err
		}

		err = datastore.Get(ctx, key, &possibleCoachSearch)
		if err != nil {
			return err
		}

		return nil
	}, &datastore.TransactionOptions{XG: true})

	if err != nil {
		return nil, err
	}

	return &possibleCoachSearch, nil

}*/

func CreatePossibleCoach(ctx context.Context, email string) (*PossibleCoach, error) {
	log.Debugf(ctx, "Create possible coach for %s", email)

	// transaction
	//CreateCoachSearch(ctx, email)

	hash, err := utils.GetEmailHash(ctx, email)
	if err != nil {
		return nil, err
	}

	log.Debugf(ctx, "CreatePossibleCoach, hash %s", hash)

	possibleCoach := new(PossibleCoach)
	possibleCoach.Key = datastore.NewKey(ctx, POSSIBLE_COACH_ENTITY, hash, 0, nil)
	err = possibleCoach.Update(ctx)
	if err != nil {
		return nil, err
	}
	possibleCoach.Email = email

	return possibleCoach, nil
}

func (m *PossibleCoach) Update(ctx context.Context) error {
	log.Debugf(ctx, "PossibleCoach, Update %s", m)

	key, err := datastore.Put(ctx, m.Key, m)
	if err != nil {
		return err
	}
	m.Key = key

	return nil
}

func FindPossibleCoachByEmail(ctx context.Context, email string) (*PossibleCoach, error) {
	log.Debugf(ctx, "FindPossibleCoachByEmail, email %s", email)

	// transaction
	//possibleCoachSearch, err := SearchForPossibleCoach(ctx, email)
	//if err != nil {
	//	return nil, ErrNoPossibleCoach
	//}

	//log.Debugf(ctx, "FindPossibleCoachByEmail, got coach search %s", possibleCoachSearch)

	hash, err := utils.GetEmailHash(ctx, email)
	if err != nil {
		return nil, err
	}

	log.Debugf(ctx, "FindPossibleCoachByEmail, hash %s", hash)

	/**
	key, err := datastore.DecodeKey(hash)
	if err != nil {
		return nil, err
	}*/
	key := datastore.NewKey(ctx, POSSIBLE_COACH_ENTITY, hash, 0, nil)
	log.Debugf(ctx, "FindPossibleCoachByEmail, key 1 %s", key)
	key2 := datastore.NewKey(ctx, POSSIBLE_COACH_ENTITY, hash, 0, nil)
	log.Debugf(ctx, "FindPossibleCoachByEmail, key 2 %s", key2)

	var possibleCoach PossibleCoach
	err = datastore.Get(ctx, key, &possibleCoach)
	if err != nil && err != datastore.ErrNoSuchEntity {
		return nil, err
	}

	if err != nil {
		return nil, ErrNoPossibleCoach
	}
	possibleCoach.Key = key

	return &possibleCoach, nil
	/*
var potentials []*PossibleCoach
// keys, err := datastore.NewQuery(POSSIBLE_COACH_ENTITY).Filter("Email =", email).GetAll(ctx, &potentials)



keys, err := datastore.NewQuery(POSSIBLE_COACH_ENTITY).GetAll(ctx, &potentials)
if err != nil {
	return nil, err
}

log.Debugf(ctx, "FindPossibleCoachByEmail, query done")

if len(potentials) == 0 {
	return nil, ErrNoPossibleCoach
}

//get Keys
for i, pot := range potentials {
	pot.Key = keys[i]
	if pot.Email == email {
		log.Debugf(ctx, "FindPossibleCoachByEmail, found one")
		return pot, nil
	}
}

return nil, ErrNoPossibleCoach

*/
}
