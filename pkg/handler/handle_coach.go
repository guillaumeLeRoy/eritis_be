package handler

import (
	"google.golang.org/appengine/log"
	"google.golang.org/appengine"
	"net/http"
	"google.golang.org/appengine/datastore"
	"eritis_be/pkg/model"
	"eritis_be/pkg/response"
	"strings"
	"eritis_be/pkg/utils"
)

func HandleCoachs(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handle coach")

	switch r.Method {
	case "POST":

		//try to detect a coach
		if ok := strings.Contains(r.URL.Path, "coach"); ok {
			handleCreateCoach(w, r)
			return
		}
		http.NotFound(w, r)

	case "GET":

		/**
		 GET all notification for a specific coach
		 */
		contains := strings.Contains(r.URL.Path, "notifications")
		if contains {
			log.Debugf(ctx, "handle coachs, notifications")

			params := response.PathParams(ctx, r, "/api/v1/coachs/:uid/notifications")
			//verify url contains coach
			if _, ok := params[":uid"]; ok {
				//get uid param
				uid, ok := params[":uid"]
				if ok {
					getAllNotificationsForCoach(w, r, uid) // GET /api/v1/coachs/:uid/notifications
					return
				}
			}
		}

		params := response.PathParams(ctx, r, "/api/v1/coachs/:id")
		userId, ok := params[":id"]
		if ok {
			handleGetCoachForId(w, r, userId) // GET /api/v1/coachs/ID
			return
		}
		handleGetAllCoachs(w, r) // GET /api/v1/coachs/
		return

	case "PUT":

		//update "read" status for all Notifications
		contains := strings.Contains(r.URL.Path, "notifications/read")
		if contains {
			params := response.PathParams(ctx, r, "/api/v1/coachs/:uid/notifications/read")
			uid, ok := params[":uid"]
			if ok {
				updateAllNotificationToRead(w, r, uid)
				return
			}
		}

		// upload picture
		contains = strings.Contains(r.URL.Path, "profile_picture")
		if contains {
			params := response.PathParams(ctx, r, "/api/v1/coachs/:uid/profile_picture")
			uid, ok := params[":uid"]
			if ok {
				uploadCoachProfilePicture(w, r, uid)
				return
			}
		}

		params := response.PathParams(ctx, r, "/api/v1/coachs/:id")
		userId, ok := params[":id"]
		if ok {
			handleUpdateCoachForId(w, r, userId)
		}
	default:
		http.NotFound(w, r)
	}
}

func handleGetAllCoachs(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleGetAllCoachs")

	coachs, err := model.GetAllAPICoachs(ctx)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}
	response.Respond(ctx, w, r, coachs, http.StatusOK)
}

func handleGetCoachForId(w http.ResponseWriter, r *http.Request, id string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleGetCoachForId %s", id)

	key, err := datastore.DecodeKey(id)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	coach, err := model.GetCoach(ctx, key)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	//to api
	api := coach.ToCoachAPI()

	response.Respond(ctx, w, r, api, http.StatusOK)
}

func handleUpdateCoachForId(w http.ResponseWriter, r *http.Request, id string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleUpdateCoachForId %s", id)

	key, err := datastore.DecodeKey(id)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	coach, err := model.GetCoach(ctx, key)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	var updateCoach struct {
		FirstName   string `json:"first_name"`
		LastName    string `json:"last_name"`
		Description string `json:"description"`
		AvatarUrl   string `json:"avatar_url"`
	}
	err = response.Decode(r, &updateCoach)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	coach.FirstName = updateCoach.FirstName
	coach.LastName = updateCoach.LastName
	coach.Description = updateCoach.Description
	coach.AvatarURL = updateCoach.AvatarUrl
	coach.Update(ctx)

	//to api
	api := coach.ToCoachAPI()

	response.Respond(ctx, w, r, api, http.StatusOK)
}

func handleCreateCoach(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleCreateCoach")

	var body model.FirebaseUser
	err := response.Decode(r, &body)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//get potential Rh : email must mach
	potential, err := model.GetPotentialCoachForEmail(ctx, body.Email)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	coach, err := model.CreateCoach(ctx, &body)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	//remove potential
	model.DeletePotentialCoach(ctx, potential.Key)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	//send welcome email
	sendWelcomeEmailToCoach(ctx, coach) //TODO could be on a thread

	//construct response
	//convert to API obj
	api := coach.ToCoachAPI()
	var res = &model.Login{Coach: api}

	response.Respond(ctx, w, r, res, http.StatusCreated)
}

func uploadCoachProfilePicture(w http.ResponseWriter, r *http.Request, uid string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "uploadProfilePicture")

	key, err := datastore.DecodeKey(uid)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	coach, err := model.GetCoach(ctx, key)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	log.Debugf(ctx, "uploadProfilePicture, coach ok")

	fileName, err := utils.ReadPictureProfile(r)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	// save new picture url
	coach.AvatarURL = "https://storage.googleapis.com/eritis-be-glr.appspot.com/" + fileName
	coach.Update(ctx)

	log.Debugf(ctx, "handle file upload, DONE")

	response.Respond(ctx, w, r, nil, http.StatusOK)
}
