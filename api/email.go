package api

import (
	"fmt"
	"google.golang.org/appengine/mail"
	"google.golang.org/appengine/log"
	"golang.org/x/net/context"
)

func sendWelcomeEmailToCoach(ctx context.Context, coach *Coach) error {
	addrs := []string{coach.Email}

	msg := &mail.Message{
		Sender:  "gleroytheking@gmail.com",
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

func sendEmailToSelectedCoach(ctx context.Context, coach *Coach, coachee *Coachee) error {
	addrs := []string{coach.Email}

	//addr := "gleroy78@gmail.com"
	//msg := &mail.Message{
	//	Sender:  "gleroy78@gmail.com",
	//	To:      []string{addr},
	//	Subject: "Confirm your registration",
	//	Body:    fmt.Sprintf(confirmMessage, url),
	//}

	msg := &mail.Message{
		Sender:  "gleroy78@gmail.com",
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

const COACH_WELCOME_MSG = `Bienvenue dans la famille Eritis`
const COACH_SELECTED_MSG = `Vous avez été sélectionné par %s pour une séance de coaching`