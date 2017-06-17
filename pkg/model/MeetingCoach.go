package model

import (
	"google.golang.org/appengine/datastore"
	"golang.org/x/net/context"
	"google.golang.org/appengine/log"
	"time"
)

const MEETING_COACH_ENTITY string = "MeetingCoach"

//ancestor is a Coach
type MeetingCoach struct {
	Key               *datastore.Key `json:"id" datastore:"-"`
	MeetingCoacheeKey *datastore.Key `json:"-"`
	CreatedDate       time.Time `json:"created_date"`
}

func create(ctx context.Context, coachKey *datastore.Key, meetingCoacheeKey *datastore.Key) (*MeetingCoach, error) {
	log.Debugf(ctx, "Create meeting")

	var meetingCoach MeetingCoach
	meetingCoach.CreatedDate = time.Now()
	meetingCoach.Key = datastore.NewIncompleteKey(ctx, MEETING_COACH_ENTITY, coachKey)

	//associate with a MeetingCoachee
	meetingCoach.MeetingCoacheeKey = meetingCoacheeKey

	err := meetingCoach.update(ctx)
	if err != nil {
		return nil, err
	}

	return &meetingCoach, nil
}

func GetMeetingCoach(ctx context.Context, meetingCoachKey *datastore.Key) (*MeetingCoach, error) {
	log.Debugf(ctx, "getMeetingCoach for key %s", meetingCoachKey)

	var meeting MeetingCoach
	err := datastore.Get(ctx, meetingCoachKey, &meeting)
	if err != nil {
		return nil, err
	}
	meeting.Key = meetingCoachKey

	return &meeting, nil
}

func (m *MeetingCoach) update(ctx context.Context) error {
	key, err := datastore.Put(ctx, m.Key, m)
	if err != nil {
		return err
	}
	m.Key = key

	return nil
}

func (m *MeetingCoach) Delete(ctx context.Context) error {
	log.Debugf(ctx, "delete meeting", m)
	err := datastore.Delete(ctx, m.Key)
	return err
}

//convert given MeetingCoach into a APImeeting
func (m *MeetingCoach) GetAPIMeeting(ctx context.Context) (*ApiMeetingCoachee, error) {
	log.Debugf(ctx, "GetAPIMeeting", m)

	meetingCoachee, err := GetMeeting(ctx, m.MeetingCoacheeKey)
	if err != nil {
		return nil, err
	}

	apiMeeting, err := meetingCoachee.ConvertToAPIMeeting(ctx)
	if err != nil {
		return nil, err
	}

	return apiMeeting, nil
}

func GetMeetingsForCoach(ctx context.Context, coachKey *datastore.Key) ([]*ApiMeetingCoachee, error) {
	log.Debugf(ctx, "GetMeetingsForCoach, key %s", coachKey)

	var meetings []*MeetingCoach
	keys, err := datastore.NewQuery(MEETING_COACH_ENTITY).Ancestor(coachKey).Order("-CreatedDate").GetAll(ctx, &meetings)
	if err != nil {
		return nil, err
	}

	var apiMeetings []*ApiMeetingCoachee = make([]*ApiMeetingCoachee, len(meetings))
	for i, meeting := range meetings {
		meeting.Key = keys[i]
		//convert to ApiMeeting
		apiMeetings[i], err = meeting.GetAPIMeeting(ctx)
	}

	return apiMeetings, nil
}
