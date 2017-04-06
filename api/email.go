package api

import (
	"fmt"
	"google.golang.org/appengine/mail"
	"google.golang.org/appengine/log"
	"net/http"
	"google.golang.org/appengine"
	"golang.org/x/net/context"
)

const CONTACT_ERITIS = "diana@eritis.co.uk";

const COACH_WELCOME_MSG = `Bienvenue dans la famille Eritis`
const COACH_SELECTED_MSG = `Vous avez été sélectionné par %s pour une séance de coaching`

func handleContact(w http.ResponseWriter, r *http.Request) {
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
		err := Decode(r, &contact)
		if err != nil {
			RespondErr(ctx, w, r, err, http.StatusBadRequest)
			return
		}
		log.Debugf(ctx, "handle contact, contact %s", contact)

		err = contactEritis(ctx, contact.Name, contact.Email, contact.Message)// POST /api/v1/contact
		if err != nil {
			RespondErr(ctx, w, r, err, http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)
	default:
		http.NotFound(w, r)
	}
}

//send an email to contact@eritis.co.uk
func contactEritis(ctx context.Context, name string, email string, message string) error {
	//send an email to ourself
	addrs := []string{CONTACT_ERITIS}

	subject := fmt.Sprintf("Demande de contact : %s", name)
	body := fmt.Sprintf("Contact \n name : %s \n email : %s \n content : %s", name, email, message)

	log.Debugf(ctx, "contactEritis, body %s", body)

	msg := &mail.Message{
		Sender:  CONTACT_ERITIS,
		To:      addrs,
		Subject: subject,
		Body:    body,
	}

	if err := mail.Send(ctx, msg); err != nil {
		log.Errorf(ctx, "Couldn't send contact email: %v", err)
		return err
	}

	return nil
}

func sendWelcomeEmailToCoach(ctx context.Context, coach *Coach) error {
	addrs := []string{coach.Email}

	msg := &mail.Message{
		Sender:  CONTACT_ERITIS,
		To:      addrs,
		Subject: "Vous avez été sélectionné",
		Body:    fmt.Sprintf(COACH_WELCOME_MSG),
	}

	if err := mail.Send(ctx, msg); err != nil {
		log.Errorf(ctx, "Couldn't send email: %v", err)
		return err
	}

	return nil
}
func sendTestEmail(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	addrs := []string{"gleroy78@gmail.com, theo@eritis.co.uk"}

	msg := &mail.Message{
		Sender:  CONTACT_ERITIS,
		To:      addrs,
		Subject: "Vous avez été sélectionné",
		Body:    fmt.Sprintf(COACH_WELCOME_MSG),
	}

	if err := mail.Send(ctx, msg); err != nil {
		log.Errorf(ctx, "Couldn't send email: %v", err)
		RespondErr(ctx, w, r, err, http.StatusInternalServerError)
	}
	w.WriteHeader(http.StatusOK)
}

func sendEmailToSelectedCoach(ctx context.Context, coach *Coach, coachee *Coachee) error {
	addrs := []string{coach.Email}

	msg := &mail.Message{
		Sender:  CONTACT_ERITIS,
		To:      addrs,
		Subject: "Vous avez été sélectionné",
		Body:    fmt.Sprintf(COACH_SELECTED_MSG, coachee.DisplayName),
	}

	if err := mail.Send(ctx, msg); err != nil {
		log.Errorf(ctx, "Couldn't send email: %v", err)
		return err
	}

	return nil
}