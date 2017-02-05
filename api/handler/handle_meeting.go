package handler

import (
	"net/http"
	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
	"google.golang.org/appengine/datastore"
	"model"
	"tool"
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

	var m model.Meeting
	err := tool.Decode(r, &m)
	if err != nil {
		tool.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	err = m.Create(ctx)
	if err != nil {
		tool.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	tool.Respond(ctx, w, r, m, http.StatusCreated)
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
