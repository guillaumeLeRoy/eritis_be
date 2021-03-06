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
	"fmt"
	"strconv"
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

			params := response.PathParams(ctx, r, "/v1/coachs/:uid/notifications")
			//verify url contains coach
			if _, ok := params[":uid"]; ok {
				//get uid param
				uid, ok := params[":uid"]
				if ok {
					getAllNotificationsForCoach(w, r, uid) // GET /v1/coachs/:uid/notifications
					return
				}
			}
		}

		params := response.PathParams(ctx, r, "/v1/coachs/:id")
		userId, ok := params[":id"]
		if ok {
			handleGetCoachForId(w, r, userId) // GET /v1/coachs/ID
			return
		}
		handleGetAllCoachs(w, r) // GET /v1/coachs/
		return

	case "PUT":

		//update "read" status for all Notifications
		contains := strings.Contains(r.URL.Path, "notifications/read")
		if contains {
			params := response.PathParams(ctx, r, "/v1/coachs/:uid/notifications/read")
			uid, ok := params[":uid"]
			if ok {
				updateAllNotificationToRead(w, r, uid)
				return
			}
		}

		// upload picture
		contains = strings.Contains(r.URL.Path, "profile_picture")
		if contains {
			params := response.PathParams(ctx, r, "/v1/coachs/:uid/profile_picture")
			uid, ok := params[":uid"]
			if ok {
				uploadCoachProfilePicture(w, r, uid)
				return
			}
		}

		// update timezone
		if contains = strings.Contains(r.URL.Path, "timezone"); contains {
			params := response.PathParams(ctx, r, "/v1/coachs/:uid/timezone")
			uid, ok := params[":uid"]
			if ok {
				handleUpdateCoachTimeZone(w, r, uid)
				return
			}
		}

		params := response.PathParams(ctx, r, "/v1/coachs/:id")
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

	//get potential Coach : email must mach
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

	// get PossibleCoach if any
	possibleCoach, err := model.FindPossibleCoachByEmail(ctx, body.Email)
	if err != nil && err != model.ErrNoPossibleCoach {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	if err == nil {
		// add extra data
		coach.FirstName = possibleCoach.FirstName
		coach.LastName = possibleCoach.LastName
		coach.Description = possibleCoach.Description
		coach.MobilePhoneNumber = possibleCoach.MobilePhoneNumber
		coach.Languages = possibleCoach.Languages
		coach.LinkedinUrl = possibleCoach.LinkedinUrl
		coach.AvatarURL = possibleCoach.AvatarURL
		coach.InsuranceUrl = possibleCoach.InsuranceUrl

		coach.Career = possibleCoach.Career
		coach.ExtraActivities = possibleCoach.ExtraActivities
		coach.Degree = possibleCoach.Degree
		coach.ExperienceCoaching = possibleCoach.ExperienceCoaching
		coach.ExperienceRemoteCoaching = possibleCoach.ExperienceRemoteCoaching
		coach.ExperienceShortSession = possibleCoach.ExperienceShortSession
		coach.CoachingSpecifics = possibleCoach.CoachingSpecifics
		coach.Supervisor = possibleCoach.Supervisor
		coach.TherapyElements = possibleCoach.TherapyElements
		coach.LegalStatus = possibleCoach.LegalStatus
		coach.RevenuesLastThreeYears = possibleCoach.RevenuesLastThreeYears
		coach.PercentageCoachingInRevenue = possibleCoach.PercentageCoachingInRevenue

		coach.InvoiceEntity = possibleCoach.InvoiceEntity
		coach.InvoiceSiretNumber = possibleCoach.InvoiceSiretNumber
		coach.InvoiceAddress = possibleCoach.InvoiceAddress
		coach.InvoiceCity = possibleCoach.InvoiceCity
		coach.InvoicePostcode = possibleCoach.InvoicePostcode
		coach.InvoiceRIBurl = possibleCoach.InvoiceRIBurl

		err = coach.Update(ctx)
		if err != nil {
			response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
			return
		}

		// delete possible coach
		possibleCoach.Delete(ctx)
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
	coach.AvatarURL = avatarUrl
	coach.Update(ctx)

	log.Debugf(ctx, "handle file upload, DONE")

	response.Respond(ctx, w, r, nil, http.StatusOK)
}

func handleUpdateCoachTimeZone(w http.ResponseWriter, r *http.Request, uid string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleUpdateCoachTimeZone, uid %s", uid)

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

	log.Debugf(ctx, "handleUpdateCoachTimeZone, coach ok")

	// update last connection date
	var body struct {
		LastConnectionTimeZoneOffset string `json:"time_zone_offset"`
	}
	err = response.Decode(r, &body)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	log.Debugf(ctx, "handleUpdateCoachTimeZone, body %s", body)

	timeZoneOffset, err := strconv.Atoi(body.LastConnectionTimeZoneOffset)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	err = coach.UpdateTimeZoneOffset(ctx, timeZoneOffset)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	response.Respond(ctx, w, r, nil, http.StatusOK)
}
