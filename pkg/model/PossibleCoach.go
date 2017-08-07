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
	Key             *datastore.Key `datastore:"-" json:"id"`
	InscriptionDate time.Time `json:"inscription_date"`

	Email             string `json:"email"`
	FirstName         string `json:"first_name"`
	LastName          string `json:"last_name"`
	LinkedinUrl       string `json:"linkedin_url"`
	Description       string `json:"description"`
	MobilePhoneNumber string `json:"mobile_phone_number"`
	Languages         string `json:"languages"`

	Career          string `json:"career"`
	ExtraActivities string `json:"extraActivities"`
	Degree          string `json:"degree"`

	ExperienceCoaching       string `json:"experience_coaching"`
	ExperienceRemoteCoaching string `json:"experience_remote_coaching"`
	ExperienceShortSession   string `json:"experienceShortSession"`
	CoachingSpecifics        string `json:"coachingSpecifics"`
	Supervisor               string `json:"supervisor"`
	TherapyElements          string `json:"therapyElements"`

	RevenuesLastThreeYears      string `json:"revenues_last_3_years"` //revenues for last 3 years
	PercentageCoachingInRevenue string `json:"percentage_coaching_in_revenue"`
	LegalStatus                 string `json:"legal_status"`

	AvatarURL    string `json:"avatar_url"`
	InsuranceUrl string `json:"insurance_url"`

	InvoiceEntity      string `json:"invoice_entity"`
	InvoiceSiretNumber string `json:"invoice_siret_number"`
	InvoiceAddress     string `json:"invoice_address"`
	InvoiceCity        string `json:"invoice_city"`
	InvoicePostcode    string `json:"invoice_postcode"`
	InvoiceRIBurl      string `json:"invoice_rib_url"`

	InviteSent bool   `json:"invite_sent"`
}

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
