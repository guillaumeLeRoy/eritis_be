package handler

import (
	"net/http"
	"strings"
	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
	"eritis_be/pkg/response"
	"eritis_be/pkg/model"
)

func HandlePossibleCoach(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handle possible coach")

	switch r.Method {
	case "PUT":

		//try to detect a coach
		if ok := strings.Contains(r.URL.Path, "possible_coachs"); ok {
			handleCreatePossibleCoach(w, r)
			return
		}
		http.NotFound(w, r)

	default:
		http.NotFound(w, r)
	}
}

func handleCreatePossibleCoach(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleCreatePossibleCoach")

	var possibleCoach struct {
		Email       string `json:"email"`
		FirstName   string `json:"firstName"`
		LastName    string `json:"lastName"`
		LinkedinUrl string `json:"linkedin_url"`
		Description string `json:"description"`
	}

	err := response.Decode(r, &possibleCoach)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	possibleCoachToUpdate, err := model.FindPossibleCoachsByEmail(ctx, possibleCoach.Email)

	if err != nil && err != model.ErrNoPossibleCoach {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
	}

	if err == model.ErrNoPossibleCoach {
		// create new possible coach

		var newPossibleCoach = new(model.PossibleCoach)

		newPossibleCoach.Create(ctx)
		if err != nil {
			response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
			return
		}

		possibleCoachToUpdate = newPossibleCoach
	}

	possibleCoachToUpdate.Email = possibleCoach.Email
	possibleCoachToUpdate.FirstName = possibleCoach.FirstName
	possibleCoachToUpdate.LastName = possibleCoach.LastName
	possibleCoachToUpdate.Description = possibleCoach.Description
	possibleCoachToUpdate.LinkedinUrl = possibleCoach.LinkedinUrl

	err = possibleCoachToUpdate.Update(ctx)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	response.Respond(ctx, w, r, &possibleCoachToUpdate, http.StatusCreated)

}
