package model

import (
	"google.golang.org/appengine/datastore"
	"golang.org/x/net/context"
	"google.golang.org/appengine/log"
	"time"
)

type MeetingTime struct {
	Key       *datastore.Key `json:"id" datastore:"-"`
	StartDate time.Time `json:"start_date"`
	EndDate   time.Time `json:"end_date"`
}

func (m *MeetingTime) Create(ctx context.Context, meetingKey *datastore.Key) error {
	log.Debugf(ctx, "Create potential time", m)

	//Meeting is an ancestor
	m.Key = datastore.NewIncompleteKey(ctx, "MeetingTime", meetingKey)

	key, err := datastore.Put(ctx, m.Key, m)
	if err != nil {
		return err
	}
	m.Key = key

	return nil
}

func GetMeetingTime(ctx context.Context, key *datastore.Key) (*MeetingTime, error) {
	log.Debugf(ctx, "GetMeetingTime, key %s", key)

	var time MeetingTime
	err := datastore.Get(ctx, key, &time)
	if err != nil {
		return nil, err
	}
	time.Key = key

	return &time, nil
}

//get all potential times for the given meeting
func GetMeetingPotentialTimes(ctx context.Context, meetingKey *datastore.Key) ([]*MeetingTime, error) {
	log.Debugf(ctx, "GetMeetingPotentialTimes, meeting key %s", meetingKey)

	var times []*MeetingTime
	keys, err := datastore.NewQuery("MeetingTime").Ancestor(meetingKey).GetAll(ctx, &times)
	if err != nil {
		return nil, err
	}

	log.Debugf(ctx, "GetMeetingPotentialTimes, potentials count %s", len(times))


	for i, time := range times {
		time.Key = keys[i]
	}
	return times, nil
}