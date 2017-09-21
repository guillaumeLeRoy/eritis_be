package handler

import (
	"google.golang.org/appengine/log"
	"google.golang.org/appengine"
	"net/http"
	"eritis_be/pkg/response"
	"eritis_be/pkg/utils"
	"eritis_be/pkg/model"
	"strings"
	"google.golang.org/appengine/datastore"
	"errors"
	"golang.org/x/net/context"
)

func HandlePotential(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handle login")

	switch r.Method {
	case "POST":
		if ok := strings.Contains(r.URL.Path, "coachees"); ok {
			handleCreatePotentialCoachee(w, r)
			return
		}

		if ok := strings.Contains(r.URL.Path, "rhs"); ok {
			handleCreatePotentialHR(w, r)
			return
		}

		if ok := strings.Contains(r.URL.Path, "coachs"); ok {
			handleCreatePotentialCoach(w, r)
			return
		}
		http.NotFound(w, r)
	case "GET":
		if ok := strings.Contains(r.URL.Path, "coachees"); ok {
			//get potential Coachee for this token
			params := response.PathParams(ctx, r, "/v1/potentials/coachees/:token")
			token, ok := params[":token"]
			if ok {
				handleGetPotentialCoacheeForToken(w, r, token) // GET /v1/potentials/coachees/:token
				return
			}
		}

		if ok := strings.Contains(r.URL.Path, "rhs"); ok {
			//get potential Rh for this token
			params := response.PathParams(ctx, r, "/v1/potentials/rhs/:token")
			token, ok := params[":token"]
			if ok {
				handleGetPotentialRhForToken(w, r, token) // GET /v1/potentials/rhs/:token
				return
			}
		}

		if ok := strings.Contains(r.URL.Path, "coachs"); ok {
			//get potential Rh for this token
			params := response.PathParams(ctx, r, "/v1/potentials/coachs/:token")
			token, ok := params[":token"]
			if ok {
				handleGetPotentialCoachForToken(w, r, token) // GET /v1/potentials/coachs/:token
				return
			}
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

	//get plan
	plan := model.CreatePlanFromId(potentialCoachee.PlanId)
	//convert to api
	api := potentialCoachee.ToPotentialCoacheeAPI(plan)

	response.Respond(ctx, w, r, &api, http.StatusOK)
}

func handleGetPotentialRhForToken(w http.ResponseWriter, r *http.Request, token string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleGetPotentialRhForToken, token %s", token)

	email, err := utils.GetEmailFromInviteToken(ctx, token)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	potential, err := model.GetPotentialRhForEmail(ctx, email)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	//convert to api
	api := potential.ToPotentialHRAPI()

	response.Respond(ctx, w, r, &api, http.StatusOK)
}

func handleGetPotentialCoachForToken(w http.ResponseWriter, r *http.Request, token string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleGetPotentialCoachForToken, token %s", token)

	email, err := utils.GetEmailFromInviteToken(ctx, token)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	potential, err := model.GetPotentialCoachForEmail(ctx, email)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	//convert to api
	api := potential.ToPotentialCoachAPI()

	response.Respond(ctx, w, r, &api, http.StatusOK)
}

func handleCreatePotentialCoachee(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleCreatePotentialCoachee")

	var body struct {
		RhId      string `json:"rh_id"`
		Email     string `json:"email"`
		PlanId    model.PlanInt `json:"plan_id"`
		FirstName string `json:"first_name"`
		LastName  string `json:"last_name"`
	}

	err := response.Decode(r, &body)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	log.Debugf(ctx, "handleCreatePotentialCoachee, body %s", body)

	rhKey, err := datastore.DecodeKey(body.RhId)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//check if there is already a PotentialCoachee for this email
	_, err = model.GetPotentialCoacheeForEmail(ctx, body.Email)
	if err == nil || err != model.ErrNoPotentialCoachee {
		//it means there is already a Potential
		response.RespondErr(ctx, w, r, errors.New("EMAIL_ALREADY_USED"), http.StatusInternalServerError)
		return
	}

	log.Debugf(ctx, "handleCreatePotentialCoachee, no potential with this email")

	//check this email is not used by a Coachee
	coachees, err := model.GetCoacheeForEmail(ctx, body.Email)
	if err != nil || len(coachees) > 0 {
		//it means there is already a Coachee with this email
		response.RespondErr(ctx, w, r, errors.New("EMAIL_ALREADY_USED"), http.StatusInternalServerError)
		return
	}

	log.Debugf(ctx, "handleCreatePotentialCoachee, no Coachee with this email")

	//create potential
	pot, err := model.CreatePotentialCoachee(ctx, rhKey, body.Email, body.PlanId, body.FirstName, body.LastName)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	//send email
	err = SendInviteEmailToNewCoachee(ctx, pot.Email)
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

func handleCreatePotentialCoach(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	var body struct {
		Email string `json:"email"`
	}

	log.Debugf(ctx, "handleCreatePotentialCoach, rhID %s", body)

	err := response.Decode(r, &body)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	potentialCoach, err := createPotentialCoachFromEmail(ctx, body.Email)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}
	response.Respond(ctx, w, r, potentialCoach, http.StatusCreated)
}

func createPotentialCoachFromEmail(ctx context.Context, email string) (*model.PotentialCoachAPI, error) {
	log.Debugf(ctx, "createPotentialCoachFromEmail, email %s", email)

	//check if there is already a PotentialCoach for this email
	_, err := model.GetPotentialCoachForEmail(ctx, email)
	if err == nil || err != model.ErrNoPotentialCoach {
		//it means there is already a Potential
		return nil, errors.New("There is already a Potential Coach for this email")
	}

	log.Debugf(ctx, "createPotentialCoachFromEmail, no potential with this email")

	//check this email is not used by a Coach
	coachs, err := model.GetCoachForEmail(ctx, email)
	if err != nil || len(coachs) > 0 {
		//it means there is already a Coach with this email
		return nil, errors.New("There is already a Coach for this email")
	}

	log.Debugf(ctx, "createPotentialCoachFromEmail, no coach with this email")

	//create potential
	pot, err := model.CreatePotentialCoach(ctx, email)
	if err != nil {
		return nil, err
	}

	//TODO find PossibleCoach if any and change flag
	// get PossibleCoach if any
	possibleCoach, err := model.FindPossibleCoachByEmail(ctx, email)
	if err != nil && err != model.ErrNoPossibleCoach {
		return nil, err
	}

	if err == nil {
		// add extra data
		possibleCoach.InviteSent = true
		err = possibleCoach.Update(ctx)
		if err != nil {
			return nil, err
		}
	}

	//send email
	err = SendInviteEmailToNewCoach(ctx, pot.Email)
	if err != nil {
		return nil, err
	}

	//create API response
	res := pot.ToPotentialCoachAPI()

	return res, nil
}

func handleCreatePotentialHR(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	var body struct {
		Email       string `json:"email"`
		FirstName   string `json:"first_name"`
		LastName    string `json:"last_name"`
		CompanyName string `json:"company_name"`
	}

	log.Debugf(ctx, "handleCreatePotentialHR, %s", body)

	err := response.Decode(r, &body)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//check if there is already a PotentialCoach for this email
	_, err = model.GetPotentialRhForEmail(ctx, body.Email)
	if err == nil || err != model.ErrNoPotentialRh {
		//it means there is already a Potential
		response.RespondErr(ctx, w, r, errors.New("There is already a Potential Rh for this email"), http.StatusInternalServerError)
		return
	}

	log.Debugf(ctx, "handleCreatePotentialHR, no potential with this email")

	// check this email is not used by a Rh
	HRs, err := model.GetRhForEmail(ctx, body.Email)
	if err != nil || len(HRs) > 0 {
		//it means there is already a Coach with this email
		response.RespondErr(ctx, w, r, errors.New("There is already a HR for this email"), http.StatusInternalServerError)
		return
	}

	log.Debugf(ctx, "handleCreatePotentialHR, no HR with this email")

	// create potential
	pot, err := model.CreatePotentialHR(ctx, body.Email, body.FirstName, body.LastName, body.CompanyName)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	//send email
	err = SendInviteEmailToNewRh(ctx, pot.Email)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	// create API response
	res := pot.ToPotentialHRAPI()

	response.Respond(ctx, w, r, &res, http.StatusCreated)
}
