package handler

import (
	"net/http"
	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
	"google.golang.org/appengine/datastore"
	"model"
	"tool"
	"time"
	"errors"
	"strconv"
)

func HandleMeeting(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handle meeting")

	switch r.Method {
	case "POST":
		handleCreateMeeting(w, r)
	case "GET":
		params := tool.PathParams(r, "/api/meetings/coachee/:uid")
		uid, ok := params[":uid"]
		if ok {
			getAllMeetingsForCoachee(w, r, uid)// GET /api/meeting/coachee/:uid
			return
		}

		params = tool.PathParams(r, "/api/meetings/coach/:uid")
		uid, ok = params[":uid"]
		if ok {
			getAllMeetingsForCoach(w, r, uid)// GET /api/meeting/coach/:uid
			return
		}

		http.NotFound(w, r)
		return
	default:
		http.NotFound(w, r)
	}
}

func handleCreateMeeting(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleCreateMeeting")

	var newMeeting struct {
		StartDate string `json:"date"`
		CoachId   string `json:"coachId"`
		CoacheeId string `json:"coacheeId"`
	}
	err := tool.Decode(r, &newMeeting)
	if err != nil {
		tool.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//todo valid meeting ??

	log.Debugf(ctx, "handleCreateMeeting, coachId ", newMeeting.CoachId)

	coachKey, err := datastore.DecodeKey(newMeeting.CoachId)
	if err != nil {
		tool.RespondErr(ctx, w, r, errors.New("invalid coach id"),
			http.StatusBadRequest)
		return
	}

	log.Debugf(ctx, "handleCreateMeeting, coacheeId ", newMeeting.CoacheeId)

	coacheeKey, err := datastore.DecodeKey(newMeeting.CoacheeId)
	if err != nil {
		tool.RespondErr(ctx, w, r, errors.New("invalid coachee id"),
			http.StatusBadRequest)
		return
	}

	i, err := strconv.ParseInt(newMeeting.StartDate, 10, 64)
	if err != nil {
		tool.RespondErr(ctx, w, r, errors.New("invalid time"), http.StatusBadRequest)
	}
	time := time.Unix(i, 0)
	log.Debugf(ctx, "handleCreateMeeting, time : ", time)

	var meeting = &model.Meeting{}
	meeting.CoacheeKey = coacheeKey
	meeting.CoachKey = coachKey
	meeting.StartDate = time

	err = meeting.Create(ctx)
	if err != nil {
		tool.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	tool.Respond(ctx, w, r, meeting, http.StatusCreated)
}

func getAllMeetingsForCoach(w http.ResponseWriter, r *http.Request, uid string) {
	ctx := appengine.NewContext(r)
	key, err := datastore.DecodeKey(uid)
	if err != nil {
		tool.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}
	meetings, err := model.GetMeetingsForCoach(ctx, key);
	if err != nil {
		tool.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	tool.Respond(ctx, w, r, meetings, http.StatusCreated)

}

func getAllMeetingsForCoachee(w http.ResponseWriter, r *http.Request, uid string) {
	ctx := appengine.NewContext(r)
	key, err := datastore.DecodeKey(uid)
	if err != nil {
		tool.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}
	meetings, err := model.GetMeetingsForCoachee(ctx, key);
	if err != nil {
		tool.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	tool.Respond(ctx, w, r, meetings, http.StatusCreated)

}


