package model

import (
	"google.golang.org/appengine/datastore"
	"golang.org/x/net/context"
	"google.golang.org/appengine/log"
	"time"
)

const MEETING_TIME_ENTITY string = "MeetingTime"

// ancestor : a Meeting
type MeetingTime struct {
	Key       *datastore.Key `datastore:"-"`
	StartDate time.Time
	EndDate   time.Time
}

type APIMeetingTime struct {
	Key       *datastore.Key `json:"id"`
	StartDate int64 `json:"start_date"`
	EndDate   int64 `json:"end_date"`
}

func (m *MeetingTime) convertToAPI() *APIMeetingTime {
	var api = new(APIMeetingTime)
	api.Key = m.Key
	api.StartDate = m.StartDate.Unix()
	api.EndDate = m.EndDate.Unix()
	return api
}

func Constructor(start time.Time, end time.Time) *MeetingTime {
	var potentialTime = &MeetingTime{}
	potentialTime.StartDate = start
	potentialTime.EndDate = end
	return potentialTime
}

func (m *MeetingTime) Create(ctx context.Context, meetingKey *datastore.Key) error {
	log.Debugf(ctx, "Create potential time", m)

	//Meeting is an ancestor
	m.Key = datastore.NewIncompleteKey(ctx, MEETING_TIME_ENTITY, meetingKey)

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
func GetMeetingPotentialTimes(ctx context.Context, meetingKey *datastore.Key) ([]*APIMeetingTime, error) {
	log.Debugf(ctx, "GetMeetingPotentialTimes, meeting key %s", meetingKey)

	var times []*MeetingTime
	keys, err := datastore.NewQuery(MEETING_TIME_ENTITY).Ancestor(meetingKey).GetAll(ctx, &times)
	if err != nil {
		return nil, err
	}

	log.Debugf(ctx, "GetMeetingPotentialTimes, potentials count %s", len(times))

	var apiMeetingTimes = make([]*APIMeetingTime, len(times))
	for i, time := range times {
		time.Key = keys[i]
		apiMeetingTimes[i] = time.convertToAPI()
	}
	return apiMeetingTimes, nil
}

//remove all the meetingTimes associated with this meeting
func ClearAllMeetingTimesForAMeeting(ctx context.Context, meetingKey *datastore.Key) error {
	log.Debugf(ctx, "clearAllMeetingTimesForAMeeting, meeting key %s", meetingKey)

	//get times
	meetingTimes, err := GetMeetingPotentialTimes(ctx, meetingKey)
	if err != nil {
		return err
	}

	//loop and delete them
	for _, meetingTime := range meetingTimes {
		err = DeleteMeetingTime(ctx, meetingTime.Key)
		if err != nil {
			return err
		}
	}

	return nil
}

// update potential time
func (p *MeetingTime) UpdateMeetingPotentialTime(ctx context.Context) (error) {
	log.Debugf(ctx, "updateeMeetingPotentialTime, potential key %s", p.Key)

	key, err := datastore.Put(ctx, p.Key, p)
	p.Key = key

	return err

}

// delete meetingTime
func DeleteMeetingTime(ctx context.Context, meetingTimeKey *datastore.Key) (error) {
	log.Debugf(ctx, "deleteMeetingPotentialTime, potential key %s", meetingTimeKey)

	err := datastore.Delete(ctx, meetingTimeKey)
	return err
}
