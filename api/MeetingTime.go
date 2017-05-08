package api

import (
	"google.golang.org/appengine/datastore"
	"golang.org/x/net/context"
	"google.golang.org/appengine/log"
	"time"
)

//Origin represent the user who created this MeetingTime
type MeetingTime struct {
	Key       *datastore.Key `json:"id" datastore:"-"`
	StartDate time.Time `json:"start_date"`
	EndDate   time.Time `json:"end_date"`
	Origin    *datastore.Key `json:"origin"`
}

func constructor(start time.Time, end time.Time, origin  *datastore.Key) MeetingTime {
	var potentialTime = &MeetingTime{}
	potentialTime.StartDate = start
	potentialTime.EndDate = end
	potentialTime.Origin = origin
	return potentialTime
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

//get all potential times for the given meeting and coach
func getMeetingPotentialTimesForCoach(ctx context.Context, meetingKey *datastore.Key, coachKey *datastore.Key) ([]*MeetingTime, error) {
	log.Debugf(ctx, "getMeetingPotentialTimesForCoach, meeting key %s, %s", meetingKey, coachKey)

	var times []*MeetingTime
	keys, err := datastore.NewQuery("MeetingTime").Ancestor(meetingKey).Filter("Origin =", coachKey).GetAll(ctx, &times)
	if err != nil {
		return nil, err
	}

	log.Debugf(ctx, "GetMeetingPotentialTimes, potentials count %s", len(times))

	for i, time := range times {
		time.Key = keys[i]
	}
	return times, nil
}

func clearAllMeetingTimesForAMeeting(ctx context.Context, meetingKey *datastore.Key) error {
	log.Debugf(ctx, "clearAllMeetingTimesForAMeeting, meeting key %s", meetingKey)

	times, err := GetMeetingPotentialTimes(ctx, meetingKey)
	if err != nil {
		return nil, err
	}
	for _, time := range times {
		err = deleteMeetingPotentialTime(ctx, time)
		if err != nil {
			return nil, err
		}
	}

	return nil
}

// update potential time
func (p *MeetingTime)updateMeetingPotentialTime(ctx context.Context) (error) {
	log.Debugf(ctx, "updateeMeetingPotentialTime, potential key %s", p.Key)

	key, err := datastore.Put(ctx, p.Key, p)
	p.Key = key

	return err

}

// delete potential time
func deleteMeetingPotentialTime(ctx context.Context, potentialTimeKey *datastore.Key) (error) {
	log.Debugf(ctx, "deleteMeetingPotentialTime, potential key %s", potentialTimeKey)

	err := datastore.Delete(ctx, potentialTimeKey)

	return err
}

//remove all Meeting time for the given coach & meeting
func clearMeetingTimeForCoach(ctx context.Context, meetingKey *datastore.Key, coachKey *datastore.Key) error {
	log.Debugf(ctx, "clearMeetingTimeForCoach")

	times, err := getMeetingPotentialTimesForCoach(ctx, meetingKey, coachKey)
	if err != nil {
		return err
	}

	if times != nil {
		for _, t := range times {
			deleteMeetingPotentialTime(ctx, t.Key)
		}
	}

	return nil
}