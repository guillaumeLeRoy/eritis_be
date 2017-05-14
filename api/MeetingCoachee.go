package api

import (
	"google.golang.org/appengine/datastore"
	"golang.org/x/net/context"
	"google.golang.org/appengine/log"
)

const MEETING_COACHEE_ENTITY string = "MeetingCoachee"

//read ancestor to have access to Coachee key
type MeetingCoachee struct {
	Key             *datastore.Key `json:"id" datastore:"-"`
	MeetingCoachKey *datastore.Key `json:"-"`
	AgreedTime      *datastore.Key `json:"agreed_date"`
	IsOpen          bool `json:"isOpen"`
}


/**
Visual representation of a meeting
 */
type ApiMeeting struct {
	Key        *datastore.Key `json:"id" datastore:"-"`
	AgreedTime *MeetingTime `json:"agreed_date"`
	Coach      *Coach `json:"coach"`
	Coachee    *APICoachee `json:"coachee"`
	IsOpen     bool `json:"isOpen"`
}

func createMeetingCoachee(ctx context.Context, coacheeKey *datastore.Key) (*MeetingCoachee, error) {
	log.Debugf(ctx, "Create meeting")

	var meeting MeetingCoachee
	meeting.Key = datastore.NewIncompleteKey(ctx, MEETING_COACHEE_ENTITY, coacheeKey)

	//meeting is open
	meeting.IsOpen = true

	err := meeting.update(ctx)
	if err != nil {
		return nil, err
	}

	return &meeting, nil
}

func (m *MeetingCoachee) update(ctx context.Context) error {
	key, err := datastore.Put(ctx, m.Key, m)
	if err != nil {
		return err
	}
	m.Key = key

	return nil
}

func getMeeting(ctx context.Context, meetingCoacheeKey *datastore.Key) (*MeetingCoachee, error) {
	log.Debugf(ctx, "GetAPIMeeting for key %s", meetingCoacheeKey)

	var meeting MeetingCoachee
	err := datastore.Get(ctx, meetingCoacheeKey, &meeting)
	if err != nil {
		return nil, err
	}
	meeting.Key = meetingCoacheeKey

	return &meeting, nil
}

func (m *MeetingCoachee) close(ctx context.Context) error {
	log.Debugf(ctx, "Close meeting", m)
	m.IsOpen = false
	return m.update(ctx)
}

func (m *MeetingCoachee) delete(ctx context.Context) error {
	log.Debugf(ctx, "delete meeting", m)
	err := datastore.Delete(ctx, m.Key)
	return err
}

//convert given MeetingCoachee into a APImeeting
func (m *MeetingCoachee)convertToAPIMeeting(ctx context.Context) (*ApiMeeting, error) {
	log.Debugf(ctx, "convertToAPIMeeting", m)

	var ApiMeeting ApiMeeting
	ApiMeeting.Key = m.Key
	ApiMeeting.IsOpen = m.IsOpen

	//get agreed meeting time
	if m.AgreedTime != nil {
		time, err := GetMeetingTime(ctx, m.AgreedTime)
		if err != nil {
			return nil, err
		}
		ApiMeeting.AgreedTime = time
	}

	//get coach if any
	if m.MeetingCoachKey != nil {
		coach, err := GetCoach(ctx, m.MeetingCoachKey.Parent())
		if err != nil {
			return nil, err
		}
		ApiMeeting.Coach = coach
	}

	//get coachee
	coachee, err := GetAPICoachee(ctx, ApiMeeting.Key.Parent())
	if err != nil {
		return nil, err
	}
	ApiMeeting.Coachee = coachee

	return &ApiMeeting, nil
}

func (m *MeetingCoachee) SetMeetingTime(ctx context.Context, meetingTimeKey *datastore.Key) error {
	log.Debugf(ctx, "SetMeetingTime", m)

	m.AgreedTime = meetingTimeKey

	err := m.update(ctx)
	if err != nil {
		return err
	}

	return nil
}

func (m *MeetingCoachee) clearMeetingTime(ctx context.Context) error {
	log.Debugf(ctx, "clearMeetingTime", m)

	m.AgreedTime = nil

	err := m.update(ctx)
	if err != nil {
		return err
	}

	return nil
}

func associate(ctx context.Context, coachKey *datastore.Key, meetingCoachee *MeetingCoachee) error {
	//create a MeetingCoach for coachKey
	meetingCoach, err := create(ctx, coachKey, meetingCoachee.Key)
	if err != nil {
		return err
	}
	//associate a meetingCoach with a meetingCoachee
	meetingCoachee.setMeetingCoach(ctx, meetingCoach)
	if err != nil {
		return err
	}

	return nil
}

func (m *MeetingCoachee) setMeetingCoach(ctx context.Context, meetingCoach *MeetingCoach) error {
	log.Debugf(ctx, "setMeetingCoach", m)

	//this meeting is now associated with a meetingCoach
	m.MeetingCoachKey = meetingCoach.Key

	err := m.update(ctx)
	if err != nil {
		return err
	}
	return nil
}

func (m *MeetingCoachee)removeMeetingCoach(ctx context.Context) error {
	log.Debugf(ctx, "removeMeetingCoach", m)

	//remove key
	m.MeetingCoachKey = nil

	err := m.update(ctx)
	if err != nil {
		return err
	}

	return nil
}

func GetMeetingsForCoachee(ctx context.Context, coacheeKey *datastore.Key) ([]*ApiMeeting, error) {
	log.Debugf(ctx, "GetMeetingsForCoachee, coacheeKey %s", coacheeKey)

	var meetings []*MeetingCoachee
	keys, err := datastore.NewQuery(MEETING_COACHEE_ENTITY).Ancestor(coacheeKey).GetAll(ctx, &meetings)
	if err != nil {
		return nil, err
	}

	log.Debugf(ctx, "GetMeetingsForCoachee, size %s", len(meetings))

	var apiMeetings []*ApiMeeting = make([]*ApiMeeting, len(meetings))
	for i, meeting := range meetings {
		meeting.Key = keys[i]
		apiMeetings[i], err = meeting.convertToAPIMeeting(ctx)
		if err != nil {
			return nil, err
		}
	}

	log.Debugf(ctx, "GetMeetingsForCoachee, res %s", apiMeetings)

	return apiMeetings, nil
}

func associateCoachWithMeetings(ctx context.Context, coacheeKey *datastore.Key, coachKey *datastore.Key) error {
	log.Debugf(ctx, "associateCoachWithMeeting, coacheeKey %s, coach %s", coacheeKey, coachKey)

	//get meetings for this coachee
	var meetings []*MeetingCoachee
	keys, err := datastore.NewQuery(MEETING_COACHEE_ENTITY).Ancestor(coacheeKey).GetAll(ctx, &meetings)
	if err != nil {
		return err
	}

	//where NO coach is associated to a meeting, set a coach
	for i, meeting := range meetings {
		meeting.Key = keys[i]

		if meeting.MeetingCoachKey == nil {
			log.Debugf(ctx, "create Meeting coach")
			err = associate(ctx, coachKey, meeting)
			if err != nil {
				return err
			}
		}
	}

	return nil
}