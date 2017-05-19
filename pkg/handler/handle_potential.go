package handler

import (
	"google.golang.org/appengine/log"
	"google.golang.org/appengine"
	"net/http"
	"eritis_be/pkg/response"
	"eritis_be/pkg/utils"
	"eritis_be/pkg/model"
)

func HandlePotential(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handle login")

	switch r.Method {
	case "GET":
		//get potential Coachee for this token
		params := response.PathParams(ctx, r, "/api/v1/potential/:token")
		token, ok := params[":token"]
		if ok {
			handleGetPotentialCoacheeForToken(w, r, token)// GET /api/v1/potential/:token
			return
		}

		http.NotFound(w, r)
		return
	default:
		http.NotFound(w, r)
	}
}

func handleGetPotentialCoacheeForToken(w http.ResponseWriter, r *http.Request, token string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleGetPotentialCoacheeForToken, token %s", token)

	email, err := utils.GetEmailFromInviteToken(ctx, token)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	potentialCoachee, err := model.GetPotentialCoacheeForEmail(ctx, email)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	response.Respond(ctx, w, r, potentialCoachee, http.StatusOK)

}
