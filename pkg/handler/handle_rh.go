package handler

import (
	"google.golang.org/appengine/log"
	"google.golang.org/appengine"
	"net/http"
	"strings"
	"eritis_be/pkg/response"
	"google.golang.org/appengine/datastore"
	"eritis_be/pkg/model"
	"errors"
)

func HandlerRH(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handle meeting")

	switch r.Method {
	case "POST":
		params := response.PathParams(ctx, r, "/api/v1/rhs/:uid/coachees")
		//get uid param
		uid, ok := params[":uid"]
		if ok {
			handleCreatePotentialCoachee(w, r, uid)
			return
		}
		http.NotFound(w, r)
	case "GET":
		/**
		 GET all coachee for a specific RH
		 */
		contains := strings.Contains(r.URL.Path, "coachees")
		if contains {
			params := response.PathParams(ctx, r, "/api/v1/rhs/:uid/coachees")
			//get uid param
			uid, ok := params[":uid"]
			if ok {
				handleGetAllCoacheesForRH(w, r, uid)// GET /api/v1/rhs/:uid/coachees
				return
			}
		}

		/**
		 GET all potential coachees for a specific RH
		 */
		contains = strings.Contains(r.URL.Path, "potentials")
		if contains {
			params := response.PathParams(ctx, r, "/api/v1/rhs/:uid/potentials")
			//get uid param
			uid, ok := params[":uid"]
			if ok {
				handleGetAllPotentialsForRH(w, r, uid)// GET /api/v1/rhs/:uid/potentials
				return
			}
		}

		http.NotFound(w, r)

	}
}

func handleGetAllCoacheesForRH(w http.ResponseWriter, r *http.Request, rhId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleGetAllCoacheesForRH, rhId %s", rhId)

	rhKey, err := datastore.DecodeKey(rhId)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	coachees, err := model.GetCoacheesForRh(ctx, rhKey)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	log.Debugf(ctx, "handleGetAllCoacheesForRH, convert to API objects")

	//convert to API objects
	var apiCoachees []*model.APICoachee
	for i, coachee := range coachees {
		apiCoachees[i], err = coachee.GetAPICoachee(ctx)
		if err != nil {
			response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
			return
		}
	}

	response.Respond(ctx, w, r, &apiCoachees, http.StatusCreated)

}

func handleGetAllPotentialsForRH(w http.ResponseWriter, r *http.Request, rhId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleGetAllPotentialsForRH, %s", rhId)

	rhKey, err := datastore.DecodeKey(rhId)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	log.Debugf(ctx, "handleGetAllPotentialsForRH, rhKey %s", rhKey)

	potCoachees, err := model.GetPotentialCoacheesForRh(ctx, rhKey)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	//convert to API objects
	var apiPotCoachees []*model.PotentialCoacheeAPI
	for i, potCoachee := range potCoachees {
		//get plan
		plan := model.CreatePlanFromId(potCoachee.PlanId)
		//convert to api
		apiPotCoachees[i] = potCoachee.ToPotentialCoacheeAPI(plan)
	}

	response.Respond(ctx, w, r, &apiPotCoachees, http.StatusCreated)

}

func handleCreatePotentialCoachee(w http.ResponseWriter, r *http.Request, rhId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleCreatePotentialCoachee, rhID %s", rhId)

	rhKey, err := datastore.DecodeKey(rhId)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	log.Debugf(ctx, "handleCreatePotentialCoachee, rhKey %s", rhKey)

	var ctxPotentialCoachee struct {
		Email  string `json:"email"`
		PlanId model.PlanInt `json:"plan_id"`
	}
	err = response.Decode(r, &ctxPotentialCoachee)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//check if there is already a PotentialCoachee for this email
	_, err = model.GetPotentialCoacheeForEmail(ctx, ctxPotentialCoachee.Email)
	if err == nil || err != model.ErrNoPotentialCoachee {
		//it means there is already a Potential
		response.RespondErr(ctx, w, r, errors.New("There is already a Potential Coachee for this email"), http.StatusInternalServerError)
		return
	}

	log.Debugf(ctx, "handleCreatePotentialCoachee")


	//create potential
	pot, err := model.CreatePotentialCoachee(ctx, rhKey, ctxPotentialCoachee.Email, ctxPotentialCoachee.PlanId)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	//send email
	err = SendEmailToNewCoachee(ctx, pot.Email)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	//get plan
	plan := model.CreatePlanFromId(pot.PlanId)

	//create API response
	res := pot.ToPotentialCoacheeAPI(plan)

	response.Respond(ctx, w, r, &res, http.StatusCreated)

}


