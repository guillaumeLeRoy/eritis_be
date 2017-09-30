package handler

import (
	"google.golang.org/appengine/log"
	"google.golang.org/appengine"
	"net/http"
	"strings"
	"eritis_be/pkg/response"
	"google.golang.org/appengine/datastore"
	"eritis_be/pkg/model"
	"eritis_be/pkg/utils"
	"fmt"
)

func HandlerRH(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "HandlerRH")

	switch r.Method {
	case "POST":

		/**
		 * Add a new objective for this coachee
		 */
		if ok := strings.Contains(r.URL.Path, "objective"); ok {
			// update coachee's objective set by an HR
			params := response.PathParams(ctx, r, "/v1/rhs/:uidRH/coachees/:uidCoachee/objective")
			//get uid param
			uidRH, ok := params[":uidRH"]
			uidCoachee, ok := params[":uidCoachee"]
			if ok {
				handleAddObjectiveToCoachee(w, r, uidRH, uidCoachee) // PUT /v1/rhs/:uidRH/coachees/:uidCoachee/objective
				return
			}
		}

		/**
		 * Create a new Rh account
		 */
		if ok := strings.Contains(r.URL.Path, "rh"); ok {
			handleCreateHR(w, r)
			return
		}

		http.NotFound(w, r)

	case "PUT":

		//update "read" status for all Notifications
		contains := strings.Contains(r.URL.Path, "notifications/read")
		if contains {
			params := response.PathParams(ctx, r, "/v1/rhs/:uid/notifications/read")
			uid, ok := params[":uid"]
			if ok {
				updateAllNotificationToRead(w, r, uid)
				return
			}
		}

		// upload picture
		contains = strings.Contains(r.URL.Path, "profile_picture")
		if contains {
			params := response.PathParams(ctx, r, "/v1/rhs/:uid/profile_picture")
			uid, ok := params[":uid"]
			if ok {
				uploadHrProfilePicture(w, r, uid) //PUT /v1/rhs/:uid/profile_picture
				return
			}
		}

		// update HR
		params := response.PathParams(ctx, r, "/v1/rhs/:id")
		userId, ok := params[":id"]
		if ok {
			handleUpdateHrForId(w, r, userId) //PUT /v1/rhs/:id
			return
		}

		http.NotFound(w, r)

	case "GET":

		/**
		 GET all notification for a specific rh
		 */
		contains := strings.Contains(r.URL.Path, "notifications")
		if contains {
			log.Debugf(ctx, "handle rhs, notifications")

			params := response.PathParams(ctx, r, "/v1/rhs/:uid/notifications")
			//verify url contains coach
			if _, ok := params[":uid"]; ok {
				//get uid param
				uid, ok := params[":uid"]
				if ok {
					getAllNotificationsForRhs(w, r, uid) // GET /v1/rhs/:uid/notifications
					return
				}
			}
		}

		/**
		 GET all coachee for a specific RH
		 */
		contains = strings.Contains(r.URL.Path, "coachees")
		if contains {
			params := response.PathParams(ctx, r, "/v1/rhs/:uid/coachees")
			//get uid param
			uid, ok := params[":uid"]
			if ok {
				handleGetAllCoacheesForRH(w, r, uid) // GET /v1/rhs/:uid/coachees
				return
			}
		}

		/**
		 GET all potential coachees for a specific RH
		 */
		contains = strings.Contains(r.URL.Path, "potentials")
		if contains {
			params := response.PathParams(ctx, r, "/v1/rhs/:uid/potentials")
			//get uid param
			uid, ok := params[":uid"]
			if ok {
				handleGetAllPotentialsForRH(w, r, uid) // GET /v1/rhs/:uid/potentials
				return
			}
		}

		/**
		 GET usage for a RH
		 */
		contains = strings.Contains(r.URL.Path, "usage")
		if contains {
			params := response.PathParams(ctx, r, "/v1/rhs/:uid/usage")
			//get uid param
			uid, ok := params[":uid"]
			if ok {
				handleGetHRusageRate(w, r, uid) // GET /v1/rhs/:uid/usage
				return
			}
		}

		/**
		* Get HR for uid
		 */
		params := response.PathParams(ctx, r, "/v1/rhs/:id")
		userId, ok := params[":id"]
		if ok {
			handleGetHrForId(w, r, userId) // GET /v1/rhs/ID
			return
		}

		/**
		* Get all HRs
		*/
		contains = strings.Contains(r.URL.Path, "rhs")
		if contains {
			handleGetAllRHs(w, r)
			return
		}

		http.NotFound(w, r)
	}
}

func handleGetHrForId(w http.ResponseWriter, r *http.Request, id string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleGetHrForId %s", id)

	key, err := datastore.DecodeKey(id)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	hr, err := model.GetHR(ctx, key)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	// convert to API
	res := hr.ToRhAPI()

	response.Respond(ctx, w, r, res, http.StatusOK)
}

func handleGetAllRHs(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleGetAllRHs")

	rhs, err := model.GetAllRhs(ctx)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}
	var rhsAPI []*model.RhAPI = make([]*model.RhAPI, len(rhs))
	for i, rh := range rhs {
		rhsAPI[i] = rh.ToRhAPI()
	}

	response.Respond(ctx, w, r, &rhsAPI, http.StatusOK)
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
	var apiCoachees []*model.CoacheeAPI = make([]*model.CoacheeAPI, len(coachees))
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
	var apiPotCoachees []*model.PotentialCoacheeAPI = make([]*model.PotentialCoacheeAPI, len(potCoachees))
	for i, potCoachee := range potCoachees {
		//get plan
		plan := model.CreatePlanFromId(potCoachee.PlanId)
		//convert to api
		apiPotCoachees[i] = potCoachee.ToPotentialCoacheeAPI(plan)
	}

	response.Respond(ctx, w, r, &apiPotCoachees, http.StatusCreated)

}

func handleGetHRusageRate(w http.ResponseWriter, r *http.Request, rhId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleGetHRusageRate, rhID %s", rhId)

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

	var totalSessionsCount = 0
	var totalSessionsMonthDone = 0
	var totalSessionsDone = 0
	for _, coachee := range coachees {
		//get the plan
		plan := model.CreatePlanFromId(coachee.PlanId)
		totalSessionsCount += plan.SessionsCount
		totalSessionsMonthDone += coachee.SessionsDoneThisMonthCount
		totalSessionsDone += coachee.SessionsDoneTotalCount
	}

	var res struct {
		SessionsDoneMonthCount int `json:"sessions_done_month_count"`
		TotalSessionsDoneCount int `json:"total_sessions_done_count"`
		AvailableSessionsCount int `json:"available_sessions_count"`
	}
	res.SessionsDoneMonthCount = totalSessionsMonthDone
	res.TotalSessionsDoneCount = totalSessionsDone
	res.AvailableSessionsCount = totalSessionsCount

	response.Respond(ctx, w, r, &res, http.StatusOK)
}

func handleCreateHR(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleCreateHR")

	var body struct {
		model.FirebaseUser
	}

	err := response.Decode(r, &body)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//get potential HR : email must mach
	potential, err := model.GetPotentialRhForEmail(ctx, body.Email)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	rh, err := model.CreateRH(ctx, &body.FirebaseUser, potential.FirstName, potential.LastName, potential.CompanyName)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	// remove potential
	model.DeletePotentialRh(ctx, potential.Key)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	// send welcome email
	sendWelcomeEmailToRh(ctx, rh) //TODO could be on a thread

	// convert into API object
	HRapi := rh.ToRhAPI()

	// construct response
	var res = &model.Login{Rh: HRapi}
	response.Respond(ctx, w, r, res, http.StatusCreated)
}

func handleAddObjectiveToCoachee(w http.ResponseWriter, r *http.Request, uidRH string, uidCoachee string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleAddObjectiveToCoachee")

	var body struct {
		Objective string `json:"objective"`
	}

	err := response.Decode(r, &body)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	log.Debugf(ctx, "handleAddObjectiveToCoachee, body %s", body)

	rhKey, err := datastore.DecodeKey(uidRH)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	coacheeKey, err := datastore.DecodeKey(uidCoachee)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	objective, err := model.CreateCoacheeObjective(ctx, coacheeKey, rhKey, body.Objective)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	response.Respond(ctx, w, r, objective, http.StatusCreated)

}

func uploadHrProfilePicture(w http.ResponseWriter, r *http.Request, uid string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "uploadHrProfilePicture")

	key, err := datastore.DecodeKey(uid)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	hr, err := model.GetHR(ctx, key)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	log.Debugf(ctx, "uploadHrProfilePicture, hr ok")

	fileName, err := utils.UploadPictureProfile(r, uid, "profile")
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	// save new picture url
	storage, err := utils.GetStorageUrl(ctx)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	avatarUrl := fmt.Sprintf("%s/%s", storage, fileName)
	hr.AvatarURL = avatarUrl
	hr.Update(ctx)

	log.Debugf(ctx, "handle file upload, DONE")

	response.Respond(ctx, w, r, nil, http.StatusOK)
}

func handleUpdateHrForId(w http.ResponseWriter, r *http.Request, id string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleUpdateHrForId %s", id)

	key, err := datastore.DecodeKey(id)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	hr, err := model.GetHR(ctx, key)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	var updateHR struct {
		FirstName   string `json:"first_name"`
		LastName    string `json:"last_name"`
		Description string `json:"description"`
		AvatarUrl   string `json:"avatar_url"`
	}
	err = response.Decode(r, &updateHR)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	hr.FirstName = updateHR.FirstName
	hr.LastName = updateHR.LastName
	hr.Description = updateHR.Description
	hr.AvatarURL = updateHR.AvatarUrl
	hr.Update(ctx)

	// to api
	api := hr.ToRhAPI()

	response.Respond(ctx, w, r, api, http.StatusOK)
}
