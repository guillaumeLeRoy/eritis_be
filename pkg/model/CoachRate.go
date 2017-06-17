package model

import (
	"time"
	"google.golang.org/appengine/datastore"
	"golang.org/x/net/context"
	"google.golang.org/appengine/log"
)

const COACH_RATE_ENTITY string = "CoachRate"

// ancestor is a Coach
type CoachRate struct {
	Key   *datastore.Key `json:"id" datastore:"-"`
	Rater *datastore.Key `json:"-"`
	Rate  int `json:"rate"`
	Date  time.Time `json:"date"`
}

type CoachRateAPI struct {
	Id    string`json:"id"`
	Rater CoacheeAPI `json:"rater"`
	Rate  int `json:"rate"`
	Date  time.Time `json:"date"`
}

func CreateCoachRate(ctx context.Context, coachKey *datastore.Key, rater *datastore.Key, rate int) (*CoachRate, error) {
	log.Debugf(ctx, "CreateCoachRate")

	var coachRate CoachRate
	coachRate.Rater = rater
	coachRate.Rate = rate
	coachRate.Date = time.Now()
	coachRate.Key = datastore.NewIncompleteKey(ctx, COACH_RATE_ENTITY, coachKey)

	err := coachRate.UpdateCoachRate(ctx)
	if err != nil {
		return nil, err
	}

	return &coachRate, nil
}

func (r *CoachRate) UpdateCoachRate(ctx context.Context) (error) {
	log.Debugf(ctx, "UpdateCoachRate")

	key, err := datastore.Put(ctx, r.Key, r)
	if err != nil {
		return err
	}
	r.Key = key

	return nil
}
