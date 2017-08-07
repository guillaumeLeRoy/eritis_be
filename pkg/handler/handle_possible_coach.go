package handler

import (
	"net/http"
	"strings"
	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
	"eritis_be/pkg/response"
	"eritis_be/pkg/model"
	"eritis_be/pkg/utils"
	"fmt"
	"errors"
	"google.golang.org/appengine/datastore"
	"golang.org/x/net/context"
)

func HandlePossibleCoach(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handle possible coach")

	switch r.Method {
	case "PUT":

		// upload picture
		if ok := strings.Contains(r.URL.Path, "profile_picture"); ok {
			uploadPossibleCoachProfilePicture(w, r)
			return
		}

		// upload assurance
		if ok := strings.Contains(r.URL.Path, "insurance"); ok {
			uploadPossibleCoachAssurance(w, r)
			return
		}

		// try to detect a possible_coachs key work
		if ok := strings.Contains(r.URL.Path, "possible_coachs"); ok {
			handleCreatePossibleCoach(w, r)
			return
		}

		http.NotFound(w, r)

	case "GET":

		// try to detect a possible_coachs key work
		if ok := strings.Contains(r.URL.Path, "possible_coachs"); ok {
			params := response.PathParams(ctx, r, "/api/v1/possible_coachs/:id")
			userId, ok := params[":id"]
			if ok {
				getPossibleCoach(w, r, userId) // GET /api/v1/possible_coachs/:id
				return
			}
			getAllPossibleCoachs(w, r)
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
		Email             string `json:"email"`
		FirstName         string `json:"first_name"`
		LastName          string `json:"last_name"`
		Description       string `json:"description"`
		MobilePhoneNumber string `json:"mobile_phone_number"`
		Languages         string `json:"languages"`
		LinkedinUrl       string `json:"linkedin_url"`

		Career                      string `json:"career"`
		ExtraActivities             string `json:"extraActivities"` // ActivitiesOutOfCoaching
		Degree                      string `json:"degree"`
		ExperienceCoaching          string `json:"experience_coaching"`
		ExperienceRemoteCoaching    string `json:"experience_remote_coaching"`
		ExperienceShortSession      string `json:"experienceShortSession"`
		CoachingSpecifics           string `json:"coachingSpecifics"`
		Supervisor                  string `json:"supervisor"`
		TherapyElements             string `json:"therapyElements"`
		LegalStatus                 string `json:"legal_status"`
		RevenuesLastThreeYears      string `json:"revenues_last_3_years"` //revenues for last 3 years
		PercentageCoachingInRevenue string `json:"percentage_coaching_in_revenue"`

		InvoiceEntity      string `json:"invoice_entity"`
		InvoiceSiretNumber string `json:"invoice_siret_number"`
		InvoiceAddress     string `json:"invoice_address"`
		InvoiceCity        string `json:"invoice_city"`
		InvoicePostcode    string `json:"invoice_postcode"`
	}

	err := response.Decode(r, &possibleCoach)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	log.Debugf(ctx, "handleCreatePossibleCoach, create possible coach")

	var possibleCoachToUpdate *model.PossibleCoach
	err = datastore.RunInTransaction(ctx, func(ctx context.Context) error {
		log.Debugf(ctx, "SearchForPossibleCoach, RunInTransaction")

		possibleCoachToUpdate, err = model.FindPossibleCoachByEmail(ctx, possibleCoach.Email)

		if err != nil && err != model.ErrNoPossibleCoach {
			return err
		}

		log.Debugf(ctx, "handleCreatePossibleCoach, RunInTransaction, no error")

		if err == model.ErrNoPossibleCoach {
			log.Debugf(ctx, "handleCreatePossibleCoach, RunInTransaction, no coach found")

			// create new possible coach
			newPossibleCoach, err := model.CreatePossibleCoach(ctx, possibleCoach.Email)
			if err != nil {
				return err
			}
			possibleCoachToUpdate = newPossibleCoach
		} else {
			log.Debugf(ctx, "handleCreatePossibleCoach, RunInTransaction, already have a coach, %s", possibleCoachToUpdate)
		}

		return nil
	}, &datastore.TransactionOptions{XG: true})
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	log.Debugf(ctx, "handleCreatePossibleCoach, update values")

	possibleCoachToUpdate.FirstName = possibleCoach.FirstName
	possibleCoachToUpdate.LastName = possibleCoach.LastName
	possibleCoachToUpdate.Description = possibleCoach.Description
	possibleCoachToUpdate.MobilePhoneNumber = possibleCoach.MobilePhoneNumber
	possibleCoachToUpdate.Languages = possibleCoach.Languages
	possibleCoachToUpdate.LinkedinUrl = possibleCoach.LinkedinUrl

	possibleCoachToUpdate.Career = possibleCoach.Career
	possibleCoachToUpdate.ExtraActivities = possibleCoach.ExtraActivities
	possibleCoachToUpdate.Degree = possibleCoach.Degree
	possibleCoachToUpdate.ExperienceCoaching = possibleCoach.ExperienceCoaching
	possibleCoachToUpdate.ExperienceRemoteCoaching = possibleCoach.ExperienceRemoteCoaching
	possibleCoachToUpdate.ExperienceShortSession = possibleCoach.ExperienceShortSession
	possibleCoachToUpdate.CoachingSpecifics = possibleCoach.CoachingSpecifics
	possibleCoachToUpdate.Supervisor = possibleCoach.Supervisor
	possibleCoachToUpdate.TherapyElements = possibleCoach.TherapyElements
	possibleCoachToUpdate.LegalStatus = possibleCoach.LegalStatus
	possibleCoachToUpdate.RevenuesLastThreeYears = possibleCoach.RevenuesLastThreeYears
	possibleCoachToUpdate.PercentageCoachingInRevenue = possibleCoach.PercentageCoachingInRevenue

	possibleCoachToUpdate.InvoiceEntity = possibleCoach.InvoiceEntity
	possibleCoachToUpdate.InvoiceSiretNumber = possibleCoach.InvoiceSiretNumber
	possibleCoachToUpdate.InvoiceAddress = possibleCoach.InvoiceAddress
	possibleCoachToUpdate.InvoiceCity = possibleCoach.InvoiceCity
	possibleCoachToUpdate.InvoicePostcode = possibleCoach.InvoicePostcode

	err = possibleCoachToUpdate.Update(ctx)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	// send email to notify coach we received his data
	err = utils.SendEmailToGivenEmail(ctx, possibleCoach.Email, THANKS_CANDIDATE_POSSIBLE_COACH_TITLE, THANKS_CANDIDATE_POSSIBLE_COACH_MSG)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	log.Debugf(ctx, "handleCreatePossibleCoach, DONE")

	response.Respond(ctx, w, r, &possibleCoachToUpdate, http.StatusCreated)
}

func uploadPossibleCoachProfilePicture(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "uploadPossibleCoachProfilePicture")

	// get email
	emailSender := r.FormValue("email")
	if emailSender == "" {
		response.RespondErr(ctx, w, r, errors.New("Empty email"), http.StatusBadRequest)
		return
	}

	var coach *model.PossibleCoach
	err := datastore.RunInTransaction(ctx, func(ctx context.Context) error {
		log.Debugf(ctx, "uploadPossibleCoachProfilePicture, RunInTransaction")

		var erro error
		coach, erro = model.FindPossibleCoachByEmail(ctx, emailSender)
		if erro != nil {
			return erro
		}

		return nil
	}, &datastore.TransactionOptions{XG: true})
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	log.Debugf(ctx, "uploadPossibleCoachProfilePicture, coach ok, %s", coach)

	hash, err := utils.GetEmailHash(ctx, coach.Email)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	log.Debugf(ctx, "uploadPossibleCoachProfilePicture, email hash %s", hash)

	fileName, err := utils.UploadPictureProfile(r, hash, "possible_profile_pict")
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

	fmt.Sprintf("%s/%s", storage, fileName)
	avatarUrl := fmt.Sprintf("%s/%s", storage, fileName)
	coach.AvatarURL = avatarUrl
	coach.Update(ctx)

	log.Debugf(ctx, "uploadPossibleCoachProfilePicture, avatar url updated")

	response.Respond(ctx, w, r, nil, http.StatusOK)
}

func uploadPossibleCoachAssurance(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "uploadPossibleCoachAssurance")

	// get email
	emailSender := r.FormValue("email")
	if emailSender == "" {
		response.RespondErr(ctx, w, r, errors.New("Empty email"), http.StatusBadRequest)
		return
	}

	var coach *model.PossibleCoach
	err := datastore.RunInTransaction(ctx, func(ctx context.Context) error {
		log.Debugf(ctx, "uploadPossibleCoachAssurance, RunInTransaction")

		var erro error
		coach, erro = model.FindPossibleCoachByEmail(ctx, emailSender)
		if erro != nil {
			//response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
			return erro
		}

		return nil
	}, &datastore.TransactionOptions{XG: true})
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	log.Debugf(ctx, "uploadPossibleCoachAssurance, coach ok")

	hash, err := utils.GetEmailHash(ctx, coach.Email)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	log.Debugf(ctx, "uploadPossibleCoachAssurance, hash %s", hash)

	fileName, err := utils.UploadPossibleCoachAssurance(r, hash, "possible_assurance")
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	// save new assurance url
	storage, err := utils.GetStorageUrl(ctx)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	insuranceUrl := fmt.Sprintf("%s/%s", storage, fileName)
	coach.InsuranceUrl = insuranceUrl
	coach.Update(ctx)

	log.Debugf(ctx, "uploadPossibleCoachAssurance, url updated")

	response.Respond(ctx, w, r, nil, http.StatusOK)
}

func getPossibleCoach(w http.ResponseWriter, r *http.Request, uid string) {
	ctx := appengine.NewContext(r)

	log.Debugf(ctx, "getPossibleCoach")

	key, err := datastore.DecodeKey(uid)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	possibleCoach, err := model.GetPossibleCoach(ctx, key)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	response.Respond(ctx, w, r, possibleCoach, http.StatusOK)
}

func getAllPossibleCoachs(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	log.Debugf(ctx, "getAllPossibleCoachs")

	coachs, err := model.GetAllPossibleCoachs(ctx)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	response.Respond(ctx, w, r, coachs, http.StatusOK)
}
