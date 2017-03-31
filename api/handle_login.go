package api

import (
	"net/http"
	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
	"strings"
)

func HandleLogin(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handle login")

	switch r.Method {
	case "POST":
		if ok := strings.Contains(r.URL.Path, "coachee"); ok {
			handleCreateCoachee(w, r)
			return
		}

		if ok := strings.Contains(r.URL.Path, "coach"); ok {
			handleCreateCoach(w, r)
			return
		}

		http.NotFound(w, r)
	case "GET":
		params := PathParams(ctx, r, "/api/login/:firebaseId")
		uid, ok := params[":firebaseId"]
		if ok {
			handleGetUser(w, r, uid)// GET /api/login/:firebaseId
			return
		}
		http.NotFound(w, r)
		return
	default:
		http.NotFound(w, r)
	}
}

func handleCreateCoach(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleCreateCoach")

	var fbUser FirebaseUser
	err := Decode(r, &fbUser)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	coach, err := fbUser.CreateCoach(ctx)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	//send welcome email
	sendWelcomeEmailToCoach(ctx, coach)//TODO could be on a thread

	//construct response
	var res = &Login{Coach:coach}

	Respond(ctx, w, r, res, http.StatusCreated)
}

func handleCreateCoachee(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleCreateCoachee")

	var fbUser FirebaseUser
	err := Decode(r, &fbUser)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	coachee, err := fbUser.CreateCoachee(ctx)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}
	//construct response
	var res = &Login{Coachee:coachee}
	Respond(ctx, w, r, res, http.StatusCreated)
}

func handleGetUser(w http.ResponseWriter, r *http.Request, firebaseId string) {
	ctx := appengine.NewContext(r)

	var fbUser FirebaseUser
	fbUser.UID = firebaseId
	response, err := fbUser.GetUser(ctx)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	Respond(ctx, w, r, response, http.StatusOK)
}
