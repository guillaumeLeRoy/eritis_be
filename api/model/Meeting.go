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
	IsOpen     bool `json:"isOpen"`
}

/**
Visual representation of a meeting
 */
type MeetingCard struct {
	Key       *datastore.Key `json:"id" datastore:"-"`
	StartDate time.Time `json:"date"`
	Coach     *Coach `json:"coach"`
	Coachee   *Coachee `json:"coachee"`
	IsOpen    bool `json:"isOpen"`
}

func (m *Meeting) Create(ctx context.Context) error {
	log.Debugf(ctx, "Create meeting", m)

	//TODO add an ancestor
	m.Key = datastore.NewIncompleteKey(ctx, "Meeting", nil)
	m.IsOpen = true

	//meeting is open
	m.IsOpen = true

	key, err := datastore.Put(ctx, m.Key, m)
	if err != nil {
		return err
	}
	m.Key = key

	return nil
}

func (m *Meeting) Close(ctx context.Context) error {
	log.Debugf(ctx, "Close meeting", m)

	m.IsOpen = false

	key, err := datastore.Put(ctx, m.Key, m)
	if err != nil {
		return err
	}
	m.Key = key

	return nil
}

func GetMeeting(ctx context.Context, key *datastore.Key) (*Meeting, error) {
	var meeting Meeting
	err := datastore.Get(ctx, key, &meeting)
	if err != nil {
		return nil, err
	}
	meeting.Key = key

	return &meeting, nil
}

func GetMeetingsForCoach(ctx context.Context, coachKey *datastore.Key) ([]*MeetingCard, error) {
	log.Debugf(ctx, "GetMeetingsForCoach")

	var meetings []*Meeting
	keys, err := datastore.NewQuery("Meeting").Filter("CoachKey =", coachKey).GetAll(ctx, &meetings)
	if err != nil {
		return nil, err
	}

	//TODO synchronise call

	//get coach
	coach, err := GetCoach(ctx, coachKey)
	if err != nil {
		return nil, err
	}

	log.Debugf(ctx, "GetMeetingsForCoach, coach obtained")

	var meetingCards []*MeetingCard = make([]*MeetingCard, len(meetings))
	for i, meeting := range meetings {
		meeting.Key = keys[i]
		//convert to MeetingCard
		var meetingCard MeetingCard
		meetingCard.Key = meeting.Key
		meetingCard.IsOpen = meeting.IsOpen
		meetingCard.StartDate = meeting.StartDate
		meetingCard.Coach = coach

		//get coachee
		coachee, err := GetCoachee(ctx, meeting.CoacheeKey)
		if err != nil {
			return nil, err
		}
		meetingCard.Coachee = coachee

		log.Debugf(ctx, "GetMeetingsForCoach, meetingCard created, %s", meetingCard)

		meetingCards[i] = &meetingCard
	}

	return meetingCards, nil
}

func GetMeetingsForCoachee(ctx context.Context, coacheeKey *datastore.Key) ([]*MeetingCard, error) {
	log.Debugf(ctx, "GetMeetingsForCoachee")

	var meetings []*Meeting
	keys, err := datastore.NewQuery("Meeting").Filter("CoacheeKey =", coacheeKey).GetAll(ctx, &meetings)
	if err != nil {
		return nil, err
	}

	//TODO synchronise call

	//get coachee
	coachee, err := GetCoachee(ctx, coacheeKey)
	if err != nil {
		return nil, err
	}

	log.Debugf(ctx, "GetMeetingsForCoachee, coachee obtained", coachee)

	var meetingCards []*MeetingCard = make([]*MeetingCard, len(meetings))
	for i, meeting := range meetings {
		meeting.Key = keys[i]
		//convert to MeetingCard
		var meetingCard MeetingCard
		meetingCard.Key = meeting.Key
		meetingCard.IsOpen = meeting.IsOpen
		meetingCard.StartDate = meeting.StartDate
		meetingCard.Coachee = coachee

		//get coach
		coach, err := GetCoach(ctx, meeting.CoachKey)
		if err != nil {
			return nil, err
		}
		meetingCard.Coach = coach

		log.Debugf(ctx, "GetMeetingsForCoachee, meetingCard created, %s", meetingCard)

		meetingCards[i] = &meetingCard
	}

	return meetingCards, nil
}