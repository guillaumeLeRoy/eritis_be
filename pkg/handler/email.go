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

const INVITE_RH_TITLE = `Accédez à votre espace Eritis`
const INVITE_RH_MSG = `
<html style="color:black;">
	<body>
		<p>Bonjour,</p>

		<p>Commencez votre inscription sur Eritis en cliquant ici pour accéder à nos services. Dès lors que celle-ci sera confirmée, vous pourrez :
		<ul>
			<li>Sélectionner les managers auxquels vous souhaitez faire bénéficier la plateforme.</li>
			<li>Suivre chaque manager coaché de manière détaillée grâce à des comptes rendus.</li>
			<li>Résilier à tout moment car notre service est sans engagement.</li>
		</ul>
		</p>

		<p>A très bientôt sur notre plateforme,</p>

		<p>L'équipe Eritis</p>
	</body>
</html>`

const RH_WELCOME_TITLE = `Bienvenue sur Eritis !`
const RH_WELCOME_MSG = `
<html style="color:black;">
	<body>
		<p>Bonjour,</p>

		<p>Nous vous remercions d'avoir rejoint la communauté Eritis. Votre inscription sur notre plateforme est confirmée.</p>

		<p>Afin de commencer à utiliser nos services connectez-vous sur Eritis.co.uk avec vos identifiants.</p>

		<p>A très bientôt sur notre plateforme,</p>

		<p>L'équipe Eritis</p>
	</body>
</html>`

const INVITE_COACHEE_TITLE = `Commencez vos séances de coaching Eritis`
const INVITE_COACHEE_MSG = `
<html style="color:black;">
	<body>
		<p>Bonjour,

		<p>Afin de débuter vos séances de coaching, inscrivez-vous sur notre plateforme en cliquant ici.
		<p>Dès que celle-ci sera confirmée, vous pourrez :
		<ul>
			<li>Définir vos besoins en organisant vos séances.</li>
			<li>Réserver des créneaux avec des coaches certifiés.</li>
			<li>Commencer vos séances de coaching par vidéo-conférence où que vous soyez.</li>
			<li>Suivre votre progression avec des compte rendus de fin de séance.</li>
		</ul>
		</p>
		<p>A très bientôt sur notre plateforme,</p>

		<p>L'équipe Eritis</p>

	</body>
</html>`

const COACHEE_WELCOME_TITLE = `Bienvenue sur Eritis !`
const COACHEE_WELCOME_MSG = `
<html style="color:black;">
	<body>
		<p>Bonjour,</p>

		<p>Nous vous remercions d'avoir rejoint la communauté Eritis. Votre inscription sur notre plateforme est confirmée.</p>

		<p>Afin de commencer à utiliser nos services, connectez-vous sur Eritis.co.uk avec vos identifiants.</p>

		<p>A très bientôt sur notre plateforme,</p>

		<p>L'équipe Eritis</p>
	</body>
</html>`

const COACH_WELCOME_TITLE = `Bienvenue sur Eritis !`
const COACH_WELCOME_MSG = `
<html style="color:black;">
	<body>
		<p>Bonjour,</p>

		<p>Nous vous remercions d'avoir rejoint la communauté Eritis. Votre inscription sur notre plateforme est confirmée.</p>

		<p>Afin de commencer à utiliser nos services, connectez-vous sur Eritis.co.uk avec vos identifiants.</p>

		<p>A très bientôt sur notre plateforme,</p>

		<p>L'équipe Eritis</p>
	</body>
</html>`

const INVITE_COACH_TITLE = `Devenez Coach Eritis !`
const INVITE_COACH_MSG = `
<html style="color:black;">
	<body>
		<p>Bonjour,</p>
		<p>Vous avez été retenu afin de faire partie de l'équipe de coaches Eritis.</p>
		<p>Veuillez cliquer <a href="%s">ici</a> afin de commencer votre inscription et de réaliser vos premières séances.</p>
		<p>Dès lors que celle-ci sera confirmée, vous pourrez :</p>
		<ul>
			<li>Avoir accès à de nouveaux clients et de nouvelles problématiques.</li>
			<li>Réaliser vos séances de coaching par vidéo-conférence où que vous soyez.</li>
			<li>Suivre vos clients grâce à des comptes rendus.</li>
			<li>Vous former avec la supervision mensuelle d'un coach sénior.</li>
		</ul>
		<p>A très bientôt sur notre plateforme,</p>
		<p>
		L'équipe Eritis
		</p>
	</body>
</html>`

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
	err := utils.SendEmailToGivenEmail(ctx, coach.Email, COACH_WELCOME_TITLE, fmt.Sprintf(COACH_WELCOME_MSG))
	if err != nil {
		log.Errorf(ctx, "Couldn't send email: %v", err)
		return err
	}
	return nil
}

func sendWelcomeEmailToCoachee(ctx context.Context, coachee *model.Coachee) error {
	err := utils.SendEmailToGivenEmail(ctx, coachee.Email, COACHEE_WELCOME_TITLE, fmt.Sprintf(COACHEE_WELCOME_MSG))
	if err != nil {
		log.Errorf(ctx, "Couldn't send email: %v", err)
		return err
	}
	return nil
}

func sendWelcomeEmailToRh(ctx context.Context, rh *model.Rh) error {
	err := utils.SendEmailToGivenEmail(ctx, rh.Email, RH_WELCOME_TITLE, fmt.Sprintf(RH_WELCOME_MSG))
	if err != nil {
		log.Errorf(ctx, "Couldn't send email: %v", err)
		return err
	}
	return nil
}

func SendInviteEmailToNewCoachee(ctx context.Context, email string) error {
	link, err := utils.CreateInviteLink(ctx, email, utils.INVITE_COACHEE)
	if err != nil {
		return err
	}

	err = utils.SendEmailToGivenEmail(ctx, email, INVITE_COACHEE_TITLE, fmt.Sprintf(INVITE_COACHEE_MSG, link))
	if err != nil {
		return err
	}
	return nil
}

func SendInviteEmailToNewCoach(ctx context.Context, email string) error {
	link, err := utils.CreateInviteLink(ctx, email, utils.INVITE_COACH)
	if err != nil {
		return err
	}

	err = utils.SendEmailToGivenEmail(ctx, email, INVITE_COACH_TITLE, fmt.Sprintf(INVITE_COACH_MSG, link))
	if err != nil {
		return err
	}
	return nil
}

func SendInviteEmailToNewRh(ctx context.Context, email string) error {
	link, err := utils.CreateInviteLink(ctx, email, utils.INVITE_RH)
	if err != nil {
		return err
	}

	err = utils.SendEmailToGivenEmail(ctx, email, INVITE_RH_TITLE, fmt.Sprintf(INVITE_RH_MSG, link))
	if err != nil {
		return err
	}
	return nil
}

func HandlerTestEmail(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "HandlerTestEmail")

	SendInviteEmailToNewCoachee(ctx, "gleroy78@gmail.com")
}