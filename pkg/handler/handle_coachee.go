package handler

import (
	"net/http"
	"google.golang.org/appengine/log"
	"google.golang.org/appengine"
	"google.golang.org/appengine/datastore"
	"eritis_be/pkg/model"
	"eritis_be/pkg/response"
	"strings"
	"fmt"
	"eritis_be/pkg/utils"
	"strconv"
)

func HandleCoachees(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handle coachees")

	switch r.Method {

	case "POST":
		//try to detect a coachee
		///coachees
		if ok := strings.Contains(r.URL.Path, "coachee"); ok {
			handleCreateCoachee(w, r)
			return
		}
		http.NotFound(w, r)

	case "GET":

		/**
		 GET all notification for a specific coachee
		 */
		contains := strings.Contains(r.URL.Path, "notifications")
		if contains {
			log.Debugf(ctx, "handle coachees, notifications")

			params := response.PathParams(ctx, r, "/v1/coachees/:uid/notifications")
			//verify url contains coachee
			if _, ok := params[":uid"]; ok {
				//get uid param
				uid, ok := params[":uid"]
				if ok {
					getAllNotificationsForCoachee(w, r, uid) // GET /v1/coachees/:uid/notifications
					return
				}
			}
		}

		contains = strings.Contains(r.URL.Path, "coachees")
		if contains {
			log.Debugf(ctx, "handle coachees, coachees")

			/**
		 	GET a specific coachee
		 	*/
			params := response.PathParams(ctx, r, "/v1/coachees/:uid")
			userId, ok := params[":uid"]
			if ok {
				handleGetCoacheeForId(w, r, userId) // GET /v1/coachees/:uid
				return
			}

			/**
			 GET all coachees
			 */
			handleGetAllCoachees(w, r) // GET /v1/coachees
			return
		}
		http.NotFound(w, r)
	case "PUT":

		//update "read" status for all Notifications
		contains := strings.Contains(r.URL.Path, "notifications/read")
		if contains {
			params := response.PathParams(ctx, r, "/v1/coachees/:uid/notifications/read")
			uid, ok := params[":uid"]
			if ok {
				updateAllNotificationToRead(w, r, uid)
				return
			}
		}

		// upload picture
		contains = strings.Contains(r.URL.Path, "profile_picture")
		if contains {
			params := response.PathParams(ctx, r, "/v1/coachees/:uid/profile_picture")
			uid, ok := params[":uid"]
			if ok {
				uploadCoacheeProfilePicture(w, r, uid)
				return
			}
		}

		// update timezone
		if contains = strings.Contains(r.URL.Path, "timezone"); contains {
			params := response.PathParams(ctx, r, "/v1/coachees/:uid/timezone")
			uid, ok := params[":uid"]
			if ok {
				handleUpdateCoacheeTimeZone(w, r, uid)
				return
			}
		}

		//update selected coachee
		params := response.PathParams(ctx, r, "/v1/coachees/:coacheeId")
		coacheeId, ok := params[":coacheeId"]
		if ok {
			handleUpdateCoacheeForId(w, r, coacheeId) // PUT /v1/coachees/ID
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
		FistName  string `json:"first_name"`
		LastName  string `json:"last_name"`
		AvatarUrl string `json:"avatar_url"`
	}
	err = response.Decode(r, &updateCoachee)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//update
	coachee.FirstName = updateCoachee.FistName
	coachee.LastName = updateCoachee.LastName
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

func handleCreateCoachee(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleCreateCoachee")

	//TODO maybe pass a plan_id
	var body struct {
		model.FirebaseUser
	}
	err := response.Decode(r, &body)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//get potential coachee : email must match
	potentialCoachee, err := model.GetPotentialCoacheeForEmail(ctx, body.Email)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	rhKey := potentialCoachee.Key.Parent()

	//we have 1 potential Coachee
	coachee, err := model.CreateCoachee(ctx, &body.FirebaseUser, potentialCoachee.PlanId, rhKey)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	//update with values from potential
	coachee.FirstName = potentialCoachee.FirstName
	coachee.LastName = potentialCoachee.LastName
	err = coachee.Update(ctx)
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

	//send welcome email
	sendWelcomeEmailToCoachee(ctx, coachee) //TODO could be on a thread

	// send notification to HR
	model.CreateNotification(ctx, fmt.Sprintf(model.TO_HR_COACHEE_INVITE_ACCEPTED, coachee.Email), rhKey)

	//construct response
	apiCoachee, err := coachee.GetAPICoachee(ctx)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	var res = &model.Login{Coachee: apiCoachee}
	response.Respond(ctx, w, r, res, http.StatusCreated)
}

func uploadCoacheeProfilePicture(w http.ResponseWriter, r *http.Request, uid string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "uploadProfilePicture")

	key, err := datastore.DecodeKey(uid)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	coachee, err := model.GetCoachee(ctx, key)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	log.Debugf(ctx, "uploadProfilePicture, coachee ok")

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
	coachee.AvatarURL = avatarUrl
	coachee.Update(ctx)

	log.Debugf(ctx, "handle file upload, DONE")

	//client.NewWriter(d.ctx, bucket, fileName)
	response.Respond(ctx, w, r, nil, http.StatusOK)
}


func handleUpdateCoacheeTimeZone(w http.ResponseWriter, r *http.Request, uid string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleUpdateCoacheeTimeZone, uid %s", uid)

	key, err := datastore.DecodeKey(uid)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	coachee, err := model.GetCoachee(ctx, key)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	log.Debugf(ctx, "handleUpdateCoacheeTimeZone, coach ok")

	// update last connection date
	var body struct {
		LastConnectionTimeZoneOffset string `json:"time_zone_offset"`
	}
	err = response.Decode(r, &body)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	log.Debugf(ctx, "handleUpdateCoacheeTimeZone, body %s", body)

	timeZoneOffset, err := strconv.Atoi(body.LastConnectionTimeZoneOffset)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	err = coachee.UpdateTimeZoneOffset(ctx, timeZoneOffset)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	response.Respond(ctx, w, r, nil, http.StatusOK)
}