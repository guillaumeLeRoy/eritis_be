package model

import (
	"time"
	"google.golang.org/appengine/datastore"
	"golang.org/x/net/context"
	"google.golang.org/appengine/log"
)

type Meeting struct {
	Key        *datastore.Key `json:"id" datastore:"-"`
	StartDate  time.Time `json:"date"`
	CoachKey   *datastore.Key `json:"coach_id"`
	CoacheeKey *datastore.Key `json:"coachee_id"`
}

func (m *Meeting) Create(ctx context.Context) error {
	log.Debugf(ctx, "Create meeting", m)

	//TODO add an ancestor
	m.Key = datastore.NewIncompleteKey(ctx, "Meeting", nil)

	key, err := datastore.Put(ctx, m.Key, m)
	if err != nil {
		return err
	}
	m.Key = key

	return nil
}

func GetMeetingsForCoach(ctx context.Context, key *datastore.Key) ([]*Meeting, error) {
	var meetings []*Meeting
	keys, err := datastore.NewQuery("Meeting").Filter("CoachKey =", key).GetAll(ctx, &meetings)
	if err != nil {
		return nil, err
	}

	for i, meeting := range meetings {
		meeting.Key = keys[i]
	}

	return meetings, nil
}

func GetMeetingsForCoachee(ctx context.Context, key *datastore.Key) ([]*Meeting, error) {
	var meetings []*Meeting
	keys, err := datastore.NewQuery("Meeting").Filter("CoacheeKey =", key).GetAll(ctx, &meetings)
	if err != nil {
		return nil, err
	}

	for i, meeting := range meetings {
		meeting.Key = keys[i]
	}

	return meetings, nil
}