package handler

import (
	"fmt"
	"google.golang.org/appengine/log"
	"net/http"
	"google.golang.org/appengine"
	"golang.org/x/net/context"
	"eritis_be/pkg/model"
	"eritis_be/pkg/response"
	"eritis_be/pkg/utils"
)

const COACH_WELCOME_MSG = `Bienvenue dans la famille Eritis`
const COACH_SELECTED_MSG = `Vous avez été sélectionné par %s pour une séance de coaching`
const COACHEE_SELECTED_MSG = `Vous avez été sélectionné pour bénéficier de séances de coaching. Cliquez ici pour continuer %s`

func HandleContact(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handle contact")

	switch r.Method {

	case "POST":
		//log.Debugf(ctx, "handle contact, body %s", r.Body)

		//try to decode Body
		var contact struct {
			Name    string `json:"name"`
			Email   string `json:"email"`
			Message string `json:"message"`
		}
		err := response.Decode(r, &contact)
		if err != nil {
			response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
			return
		}
		log.Debugf(ctx, "handle contact, contact %s", contact)

		err = contactEritis(ctx, contact.Name, contact.Email, contact.Message)// POST /api/v1/contact
		if err != nil {
			response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
	default:
		http.NotFound(w, r)
	}
}

//send an email to contact@eritis.co.uk
func contactEritis(ctx context.Context, name string, email string, message string) error {

	subject := fmt.Sprintf("Demande de contact : %s", name)
	body := fmt.Sprintf("Contact \n name : %s \n email : %s \n content : %s", name, email, message)

	log.Debugf(ctx, "contactEritis, body %s", body)
	//send an email to ourself

	err := utils.SendEmailToGivenEmail(ctx, utils.CONTACT_ERITIS, subject, body)
	if err != nil {
		log.Errorf(ctx, "Couldn't send email: %v", err)
		return err
	}
	return nil
}

func sendWelcomeEmailToCoach(ctx context.Context, coach *model.Coach) error {
	err := utils.SendEmailToGivenEmail(ctx, coach.Email, "Vous avez été sélectionné", fmt.Sprintf(COACH_WELCOME_MSG))
	if err != nil {
		log.Errorf(ctx, "Couldn't send email: %v", err)
		return err
	}
	return nil
}

func sendEmailToSelectedCoach(ctx context.Context, coach *model.Coach, coachee *model.Coachee) error {
	err := utils.SendEmailToGivenEmail(ctx, coach.Email, "Vous avez été sélectionné", fmt.Sprintf(COACH_SELECTED_MSG, coachee.DisplayName))
	if err != nil {
		log.Errorf(ctx, "Couldn't send email: %v", err)
		return err
	}
	return nil
}

func SendEmailToNewCoachee(ctx context.Context, email string) error {
	var link = "eritis/welcome?email=" + email
	err := utils.SendEmailToGivenEmail(ctx, email, "Votre RH vous offre des séances de coaching", fmt.Sprintf(COACHEE_SELECTED_MSG, link))
	if err != nil {
		log.Errorf(ctx, "Couldn't send email: %v", err)
		return err
	}
	return nil
}