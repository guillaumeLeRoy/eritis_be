package model

import (
	"time"
	"google.golang.org/appengine/log"
	"google.golang.org/appengine/datastore"
	"golang.org/x/net/context"
	"errors"
)

const COACHEE_OBJECTIVE_ENTITY string = "Coachee_objective"

// ErrNoCoacheeObjective is the error that is returned when the
// datastore instance is unable to provide a CoacheeObjective because it doesn't exist.
var ErrNoCoacheeObjective = errors.New("coachee objective : No objective found")

/* Internal struct : Ancestor is a Coachee */
type CoacheeObjective struct {
	Key       *datastore.Key `json:"-" datastore:"-"`
	From      *datastore.Key `json:"from"` // who set this objective
	Date      time.Time `json:"date"`
	Objective string `json:"objective"`
}

func CreateCoacheeObjective(ctx context.Context, coacheeKey *datastore.Key, hrKey *datastore.Key, objective string) (*CoacheeObjective, error) {
	log.Debugf(ctx, "Create CoacheeObjective")

	var entity CoacheeObjective
	entity.Objective = objective
	entity.From = hrKey
	entity.Date = time.Now()
	entity.Key = datastore.NewIncompleteKey(ctx, COACHEE_OBJECTIVE_ENTITY, coacheeKey)

	err := entity.Update(ctx)
	if err != nil {
		return nil, err
	}

	return &entity, nil
}

func (obj *CoacheeObjective) Update(ctx context.Context) error {
	log.Debugf(ctx, "Update, CoacheeObjective")

	key, err := datastore.Put(ctx, obj.Key, obj)
	if err != nil {
		return err
	}
	obj.Key = key

	return nil
}

// get last defined objective for this coachee
func GetObjectiveForCoachee(ctx context.Context, coacheeKey *datastore.Key) (*CoacheeObjective, error) {
	log.Debugf(ctx, "GetObjectiveForCoachee, key : %s ", coacheeKey)

	var entities []*CoacheeObjective
	keys, err := datastore.NewQuery(COACHEE_OBJECTIVE_ENTITY).Ancestor(coacheeKey).Order("Date").GetAll(ctx, &entities)
	if err != nil {
		return nil, err
	}

	//get Keys
	for i, obj := range entities {
		obj.Key = keys[i]
	}

	if len(entities) == 0 {
		log.Debugf(ctx, "GetObjectiveForCoachee, no objective")
		return nil, ErrNoCoacheeObjective
	}

	// pick first one TODO change that, use date to get the last one
	obj := entities[len(entities)-1]

	log.Debugf(ctx, "GetObjectiveForCoachee, last one %s", obj)

	return obj, nil
}
