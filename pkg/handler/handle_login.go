package handler

import (
	"net/http"
	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
	"strings"
	"eritis_be/pkg/model"
	"eritis_be/pkg/response"
)

func HandleLogin(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handle login")

	switch r.Method {
	case "POST":
		//try to detect a coachee
		if ok := strings.Contains(r.URL.Path, "coachee"); ok {
			handleCreateCoachee(w, r)
			return
		}

		//try to detect a coach
		if ok := strings.Contains(r.URL.Path, "coach"); ok {
			handleCreateCoach(w, r)
			return
		}

		//try to detect a rh
		if ok := strings.Contains(r.URL.Path, "rh"); ok {
			handleCreateRh(w, r)
			return
		}

		http.NotFound(w, r)
	case "GET":
		params := response.PathParams(ctx, r, "/api/login/:firebaseId")
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

	var fbUser model.FirebaseUser
	err := response.Decode(r, &fbUser)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	coach, err := model.CreateCoach(ctx, &fbUser)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	//send welcome email
	sendWelcomeEmailToCoach(ctx, coach)//TODO could be on a thread

	//construct response
	var res = &model.Login{Coach:coach}

	response.Respond(ctx, w, r, res, http.StatusCreated)
}

func handleCreateCoachee(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleCreateCoachee")

	//TODO maybe pass a plan_id
	var newCoachee struct {
		model.FirebaseUser
	}
	err := response.Decode(r, &newCoachee)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//get potential coachee : email must mach
	potentialCoachee, err := model.GetPotentialCoacheeForEmail(ctx, newCoachee.Email)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	//we have 1 potential Coachee
	coachee, err := model.CreateCoachee(ctx, &newCoachee.FirebaseUser, potentialCoachee.PlanId, potentialCoachee.Key.Parent())
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	//remove potential
	model.DeletePotentialCoachee(ctx, potentialCoachee.Key)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	//construct response
	var res = &model.Login{Coachee:coachee}
	response.Respond(ctx, w, r, res, http.StatusCreated)
}

func handleCreateRh(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleCreateRh")

	var newRh struct {
		model.FirebaseUser
	}

	err := response.Decode(r, &newRh)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	rh, err := model.CreateRH(ctx, &newRh.FirebaseUser)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	//convert into API object
	api := rh.ToRhAPI()

	//construct response
	var res = &model.Login{Rh:api}
	response.Respond(ctx, w, r, res, http.StatusCreated)
}

func handleGetUser(w http.ResponseWriter, r *http.Request, firebaseId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleGetUser, FBid %s", firebaseId)

	var fbUser model.FirebaseUser
	fbUser.UID = firebaseId
	res, err := fbUser.GetUser(ctx)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	response.Respond(ctx, w, r, res, http.StatusOK)
}


