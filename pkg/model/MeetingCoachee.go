package model

import (
	"google.golang.org/appengine/datastore"
	"golang.org/x/net/context"
	"google.golang.org/appengine/log"
	"time"
)

const MEETING_COACHEE_ENTITY string = "MeetingCoachee"

//read ancestor to have access to Coachee key
type MeetingCoachee struct {
	Key             *datastore.Key `datastore:"-"`
	MeetingCoachKey *datastore.Key
	AgreedTime      *datastore.Key
	IsOpen          bool
	CreatedDate     time.Time
}

/**
    Visual representation of a meeting
 */
type ApiMeetingCoachee struct {
	Key         *datastore.Key `json:"id" datastore:"-"`
	AgreedTime  *APIMeetingTime `json:"agreed_date"`
	Coach       *CoachAPI `json:"coach"`
	Coachee     *CoacheeAPI `json:"coachee"`
	IsOpen      bool `json:"isOpen"`
	CreatedDate int64 `json:"created_date"`
}

func CreateMeetingCoachee(ctx context.Context, coacheeKey *datastore.Key) (*ApiMeetingCoachee, error) {
	log.Debugf(ctx, "Create meeting")

	var meeting MeetingCoachee
	meeting.Key = datastore.NewIncompleteKey(ctx, MEETING_COACHEE_ENTITY, coacheeKey)

	//meeting is open
	meeting.IsOpen = true
	meeting.CreatedDate = time.Now()

	err := meeting.Update(ctx)
	if err != nil {
		return nil, err
	}

	apiMeeting,err := meeting.ConvertToAPIMeeting(ctx)
	if err != nil {
		return nil, err
	}

	return apiMeeting, nil
}

func (m *MeetingCoachee) Update(ctx context.Context) error {
	key, err := datastore.Put(ctx, m.Key, m)
	if err != nil {
		return err
	}
	m.Key = key

	return nil
}

func GetMeeting(ctx context.Context, meetingCoacheeKey *datastore.Key) (*MeetingCoachee, error) {
	log.Debugf(ctx, "GetMeeting for key %s", meetingCoacheeKey)

	var meeting MeetingCoachee
	err := datastore.Get(ctx, meetingCoacheeKey, &meeting)
	if err != nil {
		return nil, err
	}
	meeting.Key = meetingCoacheeKey

	return &meeting, nil
}

func (m *MeetingCoachee) Close(ctx context.Context) error {
	log.Debugf(ctx, "Close meeting", m)
	m.IsOpen = false
	return m.Update(ctx)
}

func (m *MeetingCoachee) Delete(ctx context.Context) error {
	log.Debugf(ctx, "delete meeting", m)
	err := datastore.Delete(ctx, m.Key)
	return err
}

//convert given MeetingCoachee into a APImeeting
func (m *MeetingCoachee) ConvertToAPIMeeting(ctx context.Context) (*ApiMeetingCoachee, error) {
	log.Debugf(ctx, "convertToAPIMeeting", m)

	var apiMeetingCoachee ApiMeetingCoachee
	apiMeetingCoachee.Key = m.Key
	apiMeetingCoachee.IsOpen = m.IsOpen
	apiMeetingCoachee.CreatedDate = m.CreatedDate.Unix()

	//get agreed meeting time
	if m.AgreedTime != nil {
		time, err := GetMeetingTime(ctx, m.AgreedTime)
		if err != nil {
			return nil, err
		}
		apiMeetingCoachee.AgreedTime = time.ConvertToAPI()
	}

	//get coach if any
	if m.MeetingCoachKey != nil {
		coach, err := GetCoach(ctx, m.MeetingCoachKey.Parent())
		if err != nil {
			return nil, err
		}
		apiMeetingCoachee.Coach = coach.ToCoachAPI()
	}

	//get coachee
	coachee, err := GetAPICoachee(ctx, apiMeetingCoachee.Key.Parent())
	if err != nil {
		return nil, err
	}
	apiMeetingCoachee.Coachee = coachee

	return &apiMeetingCoachee, nil
}

func (m *MeetingCoachee) SetMeetingTime(ctx context.Context, meetingTimeKey *datastore.Key) error {
	log.Debugf(ctx, "SetMeetingTime", m)

	m.AgreedTime = meetingTimeKey

	err := m.Update(ctx)
	if err != nil {
		return err
	}

	return nil
}

func (m *MeetingCoachee) clearMeetingTime(ctx context.Context) error {
	log.Debugf(ctx, "clearMeetingTime", m)

	m.AgreedTime = nil

	err := m.Update(ctx)
	if err != nil {
		return err
	}

	return nil
}

func Associate(ctx context.Context, coachKey *datastore.Key, meetingCoachee *MeetingCoachee) error {
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

	err := m.Update(ctx)
	if err != nil {
		return err
	}
	return nil
}

func (m *MeetingCoachee) removeMeetingCoach(ctx context.Context) error {
	log.Debugf(ctx, "removeMeetingCoach", m)

	//remove key
	m.MeetingCoachKey = nil

	err := m.Update(ctx)
	if err != nil {
		return err
	}

	return nil
}

func GetMeetingsForCoachee(ctx context.Context, coacheeKey *datastore.Key) ([]*ApiMeetingCoachee, error) {
	log.Debugf(ctx, "GetMeetingsForCoachee, coacheeKey %s", coacheeKey)

	var meetings []*MeetingCoachee
	keys, err := datastore.NewQuery(MEETING_COACHEE_ENTITY).Ancestor(coacheeKey).Order("-CreatedDate").GetAll(ctx, &meetings)
	if err != nil {
		return nil, err
	}

	log.Debugf(ctx, "GetMeetingsForCoachee, size %s", len(meetings))

	var apiMeetings []*ApiMeetingCoachee = make([]*ApiMeetingCoachee, len(meetings))
	for i, meeting := range meetings {
		meeting.Key = keys[i]
		apiMeetings[i], err = meeting.ConvertToAPIMeeting(ctx)
		if err != nil {
			return nil, err
		}
	}

	log.Debugf(ctx, "GetMeetingsForCoachee, res %s", apiMeetings)

	return apiMeetings, nil
}

// get meetings with No coach associated but correctly defined ( objective, context, and a potential date )
// sort result by date
func GetAvailableMeetings(ctx context.Context) ([]*MeetingCoachee, error) {
	var meetings []*MeetingCoachee
	keys, err := datastore.NewQuery(MEETING_COACHEE_ENTITY).Filter("MeetingCoachKey = ", nil).Order("-CreatedDate").GetAll(ctx, &meetings)
	if err != nil {
		return nil, err
	}

	log.Debugf(ctx, "GetAvailableMeetings, size %s", len(meetings))
	availableMeetings := make([]*MeetingCoachee, 0)
	for i, meeting := range meetings {
		meeting.Key = keys[i]

		// only keep meetings where potential times are defined
		times, err := GetMeetingPotentialTimes(ctx, meeting.Key)
		if err != nil {
			continue
		}

		if len(times) > 0 {
			availableMeetings = append(availableMeetings, meeting)
		}
	}

	log.Debugf(ctx, "GetAvailableMeetings, res %s", meetings)

	return availableMeetings, nil
}

func GetAllOpenMeetingsAboutToHappen(ctx context.Context) ([]*MeetingCoachee, error) {
	log.Debugf(ctx, "GetAllOpenMeetingsAboutToHappen")

	var meetings []*MeetingCoachee
	keys, err := datastore.NewQuery(MEETING_COACHEE_ENTITY).Filter("IsOpen = ", true).GetAll(ctx, &meetings)
	if err != nil {
		return nil, err
	}

	log.Debugf(ctx, "GetAllOpenMeetingsAboutToHappen, size %s", len(meetings))

	now := time.Now()

	var happeningMeetings []*MeetingCoachee
	for i, meeting := range meetings {
		meeting.Key = keys[i]

		// check is they are about to happen
		t, err := GetMeetingTime(ctx, meeting.AgreedTime)
		if err != nil {
			log.Debugf(ctx, "GetAllOpenMeetingsAboutToHappen, couldn't get meeting time")
			continue
		}
		//returns startDate - now
		duration := t.StartDate.Sub(now)

		//should be > 0 if meeting is in the future
		if duration < 0 {
			log.Debugf(ctx, "GetAllOpenMeetingsAboutToHappen, meeting already passed") //TODO report this
			continue
		}

		// get minutes left
		if duration.Hours() > 0 {
			log.Debugf(ctx, "GetAllOpenMeetingsAboutToHappen, meeting in a few hours")
			continue
		}

		if duration.Minutes() <= 10 {
			//send an email
			happeningMeetings[0] = meeting
		}
	}

	return happeningMeetings, nil
}
