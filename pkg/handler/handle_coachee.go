package handler

import (
	"net/http"
	"google.golang.org/appengine/log"
	"google.golang.org/appengine"
	"google.golang.org/appengine/datastore"
	"eritis_be/pkg/model"
	"eritis_be/pkg/response"
)

func HandleCoachees(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handle coach")

	switch r.Method {
	case "GET":
		params := response.PathParams(ctx, r, "/api/coachees/:id")
		userId, ok := params[":id"]
		if ok {
			handleGetCoacheeForId(w, r, userId)// GET /api/coachees/ID
			return
		}
		handleGetAllCoachees(w, r)// GET /api/coachees/
		return
	case "PUT":
		//update selected coach
		params := response.PathParams(ctx, r, "/api/coachees/:coacheeId/coach/:coachId")
		coacheeId, ok := params[":coacheeId"]
		if ok {
			//read a coach id
			coachId, ok := params[":coachId"]
			if ok {
				handleUpdateSelectedCoach(w, r, coacheeId, coachId)// PUT /api/coachees/coacheeId/coach/coachId
				return
			}
			//just update coachee
			handleUpdateCoacheeForId(w, r, coacheeId)// PUT /api/coachees/ID
			return
		}

		http.NotFound(w, r)

	default:
		http.NotFound(w, r)
	}
}

func handleGetCoacheeForId(w http.ResponseWriter, r *http.Request, id string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleGetCoacheeForId %s", id)

	key, err := datastore.DecodeKey(id)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	apiCoachee, err := model.GetAPICoachee(ctx, key)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}
	response.Respond(ctx, w, r, apiCoachee, http.StatusOK)
}

func handleGetAllCoachees(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleGetAllCoachees")

	coachees, err := model.GetAllAPICoachees(ctx)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}
	response.Respond(ctx, w, r, coachees, http.StatusOK)
}

func handleUpdateCoacheeForId(w http.ResponseWriter, r *http.Request, id string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleUpdateCoachForId %s", id)

	key, err := datastore.DecodeKey(id)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	coachee, err := model.GetCoachee(ctx, key)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	var updateCoachee struct {
		DisplayName string `json:"display_name"`
		AvatarUrl   string `json:"avatar_url"`
	}
	err = response.Decode(r, &updateCoachee)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//update
	coachee.DisplayName = updateCoachee.DisplayName
	coachee.AvatarURL = updateCoachee.AvatarUrl
	coachee.Update(ctx)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	//return API object
	api, err := coachee.GetAPICoachee(ctx)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	response.Respond(ctx, w, r, api, http.StatusOK)
}

/*
Given coachee ( for coacheeId ) wants to select the given coach ( for coachId )
*/
func handleUpdateSelectedCoach(w http.ResponseWriter, r *http.Request, coacheeId string, coachId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleUpdateSelectedCoach %s", coacheeId)

	//get coachee
	coacheeKey, err := datastore.DecodeKey(coacheeId)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	coachee, err := model.GetCoachee(ctx, coacheeKey)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	//get coach
	coachKey, err := datastore.DecodeKey(coachId)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}
	coach, err := model.GetCoach(ctx, coachKey)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	//update Coachee selected coach
	//update coachee's meeting with the selected coach
	err = coachee.UpdateSelectedCoach(ctx, coach)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	//send an email to the Coach to notify that he was selected
	err = sendEmailToSelectedCoach(ctx, coach, coachee)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	//return API object
	api, err := coachee.GetAPICoachee(ctx)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	response.Respond(ctx, w, r, api, http.StatusOK)
}
