package api

import (
	"google.golang.org/appengine/datastore"
	"golang.org/x/net/context"
	"google.golang.org/appengine/log"
)

const MEETING_COACH_ENTITY string = "MeetingCoach"

//ancestor is a Coach
type MeetingCoach struct {
	Key               *datastore.Key `json:"id" datastore:"-"`
	MeetingCoacheeKey *datastore.Key `json:"-"`
}

func create(ctx context.Context, coachKey *datastore.Key, meetingCoacheeKey *datastore.Key) (*MeetingCoach, error) {
	log.Debugf(ctx, "Create meeting")

	var meetingCoach MeetingCoach
	meetingCoach.Key = datastore.NewIncompleteKey(ctx, MEETING_COACH_ENTITY, coachKey)

	//associate with a MeetingCoachee
	meetingCoach.MeetingCoacheeKey = meetingCoacheeKey

	err := meetingCoach.update(ctx)
	if err != nil {
		return nil, err
	}

	return &meetingCoach, nil
}

func getMeetingCoach(ctx context.Context, meetingCoachKey *datastore.Key) (*MeetingCoach, error) {
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

func (m *MeetingCoach) delete(ctx context.Context) error {
	log.Debugf(ctx, "delete meeting", m)
	err := datastore.Delete(ctx, m.Key)
	return err
}

//convert given MeetingCoach into a APImeeting
func (m *MeetingCoach)GetAPIMeeting(ctx context.Context) (*ApiMeeting, error) {
	log.Debugf(ctx, "GetAPIMeeting", m)

	meetingCoachee, err := getMeeting(ctx, m.MeetingCoacheeKey)
	if err != nil {
		return nil, err
	}

	apiMeeting, err := meetingCoachee.convertToAPIMeeting(ctx)
	if err != nil {
		return nil, err
	}

	return apiMeeting, nil
}

func GetMeetingsForCoach(ctx context.Context, coachKey *datastore.Key) ([]*ApiMeeting, error) {
	log.Debugf(ctx, "GetMeetingsForCoach, key %s", coachKey)

	var meetings []*MeetingCoach
	keys, err := datastore.NewQuery(MEETING_COACH_ENTITY).Ancestor(coachKey).GetAll(ctx, &meetings)
	if err != nil {
		return nil, err
	}

	var apiMeetings []*ApiMeeting = make([]*ApiMeeting, len(meetings))
	for i, meeting := range meetings {
		meeting.Key = keys[i]
		//convert to ApiMeeting
		apiMeetings[i], err = meeting.GetAPIMeeting(ctx)
	}

	return apiMeetings, nil
}

//func findForCoachKey(ctx context.Context, coachKey *datastore.Key) error {
//
//	var meetingsCoach []*MeetingCoach
//	keys, err := datastore.NewQuery(MEETING_COACH_ENTITY).Ancestor(coachKey).GetAll(ctx, &meetingsCoach)
//	if err != nil {
//		return err
//	}
//
//	return nil
//}
