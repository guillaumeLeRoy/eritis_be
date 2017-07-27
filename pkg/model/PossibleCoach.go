package model

import (
	"google.golang.org/appengine/log"
	"google.golang.org/appengine/datastore"
	"errors"
	"golang.org/x/net/context"
	"eritis_be/pkg/utils"
	"time"
)

const POSSIBLE_COACH_ENTITY string = "PossibleCoach"

var ErrNoPossibleCoach = errors.New("Possible coach : No Possible coach found")

type PossibleCoach struct {
	Key                       *datastore.Key `datastore:"-" json:"id"`
	InscriptionDate           time.Time `json:"inscription_date"`
	Email                     string `json:"email"`
	FirstName                 string `json:"first_name"`
	LastName                  string `json:"last_name"`
	LinkedinUrl               string `json:"linkedin_url"`
	Description               string `json:"description"`
	Training                  string `json:"training"`
	Degree                    string `json:"degree"`
	ExtraActivities           string `json:"extraActivities"`    //ActivitiesOutOfCoaching
	CoachForYears             string `json:"coachForYears"`      // been a coach xx years
	CoachingExperience        string `json:"coachingExperience"` // coaching experience
	CoachingHours             string `json:"coachingHours"`      // number of coaching hours
	Supervisor                string `json:"supervisor"`
	FavoriteCoachingSituation string `json:"favoriteCoachingSituation"`
	Status                    string `json:"status"`
	Revenue                   string `json:"revenues"` //revenues for last 3 years
	AvatarURL                 string `json:"avatar_url"`
	AssuranceUrl              string `json:"assurance_url"`
	InviteSent                bool   `json:"invite_sent"`
}

/*
this.registerForm = this.formBuilder.group({
entite: ['', Validators.required],
adresse: ['', Validators.required],
codePostal: ['', Validators.required],
ville: ['', Validators.required],
formation: ['', Validators.required],
diplomas: ['', Validators.required],
otherActivities: ['', Validators.required],
lang1: ['', Validators.required],
lang2: [''],
lang3: [''],
experienceTime: ['', Validators.required],
experienceVisio: ['', Validators.required],
experienceBref: ['', Validators.required],
specialities: ['', Validators.required],
therapyElements: ['', Validators.required],
coachingHours: ['', Validators.required],
supervision: ['', Validators.required],
preferedCoaching: ['', Validators.required],
status: ['', Validators.required],
ca1: ['', Validators.required],
ca2: ['', Validators.required],
ca3: ['', Validators.required],
insurance: ['']
});
*/

func CreatePossibleCoach(ctx context.Context, email string) (*PossibleCoach, error) {
	log.Debugf(ctx, "Create possible coach for %s", email)

	hash, err := utils.GetEmailHash(ctx, email)
	if err != nil {
		return nil, err
	}

	log.Debugf(ctx, "CreatePossibleCoach, hash %s", hash)

	possibleCoach := new(PossibleCoach)
	possibleCoach.Key = datastore.NewKey(ctx, POSSIBLE_COACH_ENTITY, hash, 0, nil)

	possibleCoach.Email = email
	possibleCoach.InscriptionDate = time.Now()
	possibleCoach.InviteSent = false

	err = possibleCoach.Update(ctx)
	if err != nil {
		return nil, err
	}

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

func (m *PossibleCoach) Delete(ctx context.Context) error {
	log.Debugf(ctx, "PossibleCoach, Delete %s", m)

	err := datastore.Delete(ctx, m.Key)
	if err != nil {
		return err
	}
	return nil
}

func GetPossibleCoach(ctx context.Context, key *datastore.Key) (*PossibleCoach, error) {
	log.Debugf(ctx, "GetPossibleCoach")

	var possibleCoach PossibleCoach
	err := datastore.Get(ctx, key, &possibleCoach)
	if err != nil {
		return nil, err
	}

	possibleCoach.Key = key

	return &possibleCoach, nil
}

func GetAllPossibleCoachs(ctx context.Context) ([]*PossibleCoach, error) {
	log.Debugf(ctx, "GetAllPossibleCoachs")

	var possibleCoachs []*PossibleCoach
	keys, err := datastore.NewQuery(POSSIBLE_COACH_ENTITY).GetAll(ctx, &possibleCoachs)
	if err != nil {
		return nil, err
	}

	for i, coach := range possibleCoachs {
		coach.Key = keys[i]
	}

	return possibleCoachs, nil
}

func FindPossibleCoachByEmail(ctx context.Context, email string) (*PossibleCoach, error) {
	log.Debugf(ctx, "FindPossibleCoachByEmail, email %s", email)

	hash, err := utils.GetEmailHash(ctx, email)
	if err != nil {
		return nil, err
	}

	key := datastore.NewKey(ctx, POSSIBLE_COACH_ENTITY, hash, 0, nil)
	log.Debugf(ctx, "FindPossibleCoachByEmail, key %s", key)

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
}
