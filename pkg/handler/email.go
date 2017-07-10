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
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html style="color:black;">

	</head>

	<body>
		<p>Bonjour,</p>

		<p>Commencez votre inscription sur Eritis en <a href="%s">cliquant ici</a>  pour accéder à nos services. Dès lors que celle-ci sera confirmée, vous pourrez :
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
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html style="color:black;">

	</head>

	<body>
		<p>Bonjour,</p>

		<p>Nous vous remercions d'avoir rejoint la communauté Eritis. Votre inscription sur notre plateforme est confirmée.</p>

		<p>Afin de commencer à utiliser nos services connectez-vous sur <a href="%s">%s</a> avec vos identifiants.</p>

		<p>A très bientôt sur notre plateforme,</p>

		<p>L'équipe Eritis</p>
	</body>
</html>`

const INVITE_COACHEE_TITLE = `Commencez vos séances de coaching Eritis`
const INVITE_COACHEE_MSG = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html style="color:black;">

	</head>

	<body>
		<p>Bonjour,

		<p>Afin de débuter vos séances de coaching, inscrivez-vous sur notre plateforme en <a href="%s">cliquant ici</a>.
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
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html style="color:black;">

	</head>

	<body>
		<p>Bonjour,</p>

		<p>Nous vous remercions d'avoir rejoint la communauté Eritis. Votre inscription sur notre plateforme est confirmée.</p>

		<p>Afin de commencer à utiliser nos services, connectez-vous sur <a href="%s">%s</a> avec vos identifiants.</p>

		<p>A très bientôt sur notre plateforme,</p>

		<p>L'équipe Eritis</p>
	</body>
</html>`

const COACH_WELCOME_TITLE = `Bienvenue sur Eritis !`
const COACH_WELCOME_MSG = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html style="color:black;">

	</head>

	<body>
		<p>Bonjour,</p>

		<p>Nous vous remercions d'avoir rejoint la communauté Eritis. Votre inscription sur notre plateforme est confirmée.</p>

		<p>Afin de commencer à utiliser nos services, connectez-vous sur <a href="%s">%s</a> avec vos identifiants.</p>

		<p>A très bientôt sur notre plateforme,</p>

		<p>L'équipe Eritis</p>
	</body>
</html>`

const INVITE_COACH_TITLE = `Devenez Coach Eritis !`
const INVITE_COACH_MSG = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html style="color:black;">

	</head>

	<body>
		<p>Bonjour,</p>
		<p>Vous avez été retenu afin de faire partie de l'équipe de coaches Eritis.</p>
		<p>Veuillez <a href="%s">cliquer ici</a> afin de commencer votre inscription et de réaliser vos premières séances.</p>
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

const THANKS_CANDIDATE_POSSIBLE_COACH_TITLE = `Devenez Coach Eritis !`
const THANKS_CANDIDATE_POSSIBLE_COACH_MSG = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html style="color:black;">

	</head>

	<body>
		<p>Bonjour,</p>
		<p>Nous avons bien reçu votre candidature pour faire partie de l'équipe de coaches Eritis.</p>
		<p>Votre condidature est désormais en cours d'examen par nos équipes.</p>
		<p>Nous vous contacterons bientôt par email.</p>
		<p>A très bientôt sur notre plateforme,</p>
		<p>
		L'équipe Eritis
		</p>
	</body>
</html>`

const IMMINENT_MEETING_TITLE = `Vous avez bientôt une séance`
const IMMINENT_MEETING_MSG = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html style="color:black;">

	</head>

	<body>
		<p>Bonjour,</p>
		<p>Vous avez une séance dans 10min.</p>

		<p>L'équipe Eritis</p>
	</body>
</html>`

const COACH_SELECTED_FOR_SESSION_TITLE = `Votre séance de coaching est confirmée`
const COACH_SELECTED_FOR_SESSION_MSG = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html style="color:black;">

	</head>
	<body>
		<p>Bonjour,
		<p>Le coach %s a accepté votre demande. Pour y accéder, connectez-vous à votre espace personnel sur <a href="%s">%s</a></p>
		<p>A très bientôt sur notre plateforme,</p>
		<p>L’équipe Eritis</p>
	</body>
</html>
`

const MEETING_TIME_SELECTED_FOR_SESSION_TITLE = `Votre coach Erits vient d'ajouter un horaire à votre séance`
const MEETING_TIME_SELECTED_FOR_SESSION_MSG = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html style="color:black;">

	</head>
	<body>
		<p>Bonjour,
		<p>Le coach %s a accepté votre demande. Votre séance de coaching se tiendra donc le %s. Pour y accéder, connectez-vous à votre espace personnel sur <a href="%s">%s</a></p>
		<p>A très bientôt sur notre plateforme,</p>
		<p>L’équipe Eritis</p>
	</body>
</html>
`

const MEETING_CREATED_TITLE = `Rendez-vous pris!`
const MEETING_CREATED_MSG = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html style="color:black;">

	</head>
	<body>
		<p>Bonjour,</p>
		<p>Nous vous informons que vous avez pris un rendez-vous. Pour y accéder, connectez-vous sur <a href="%s">%s</a>,</p>
		<p>A très bientôt sur notre plateforme,</p>
		<p>L’équipe Eritis</p>
	</body>
</html>
`

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

		err = contactEritis(ctx, contact.Name, contact.Email, contact.Message) // POST /api/v1/contact
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
	baseUrl, err := utils.GetSiteUrl(ctx)
	if err != nil {
		log.Errorf(ctx, "Couldn't send email: %v", err)
		return err
	}
	err = utils.SendEmailToGivenEmail(ctx, coach.Email, COACH_WELCOME_TITLE, fmt.Sprintf(COACH_WELCOME_MSG, baseUrl, baseUrl))
	if err != nil {
		log.Errorf(ctx, "Couldn't send email: %v", err)
		return err
	}
	return nil
}

func sendWelcomeEmailToCoachee(ctx context.Context, coachee *model.Coachee) error {
	baseUrl, err := utils.GetSiteUrl(ctx)
	if err != nil {
		log.Errorf(ctx, "Couldn't send email: %v", err)
		return err
	}
	err = utils.SendEmailToGivenEmail(ctx, coachee.Email, COACHEE_WELCOME_TITLE, fmt.Sprintf(COACHEE_WELCOME_MSG, baseUrl, baseUrl))
	if err != nil {
		log.Errorf(ctx, "Couldn't send email: %v", err)
		return err
	}
	return nil
}

func sendWelcomeEmailToRh(ctx context.Context, rh *model.Rh) error {
	baseUrl, err := utils.GetSiteUrl(ctx)
	if err != nil {
		log.Errorf(ctx, "Couldn't send email: %v", err)
		return err
	}
	err = utils.SendEmailToGivenEmail(ctx, rh.Email, RH_WELCOME_TITLE, fmt.Sprintf(RH_WELCOME_MSG, baseUrl, baseUrl))
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

func SendImminentMeeting(ctx context.Context, email string) error {
	err := utils.SendEmailToGivenEmail(ctx, email, IMMINENT_MEETING_TITLE, fmt.Sprintf(IMMINENT_MEETING_MSG))
	if err != nil {
		log.Errorf(ctx, "Couldn't send email: %v", err)
		return err
	}
	return nil
}

func sendMeetingCreatedEmailToCoachee(ctx context.Context, coachee *model.Coachee) error {
	baseUrl, err := utils.GetSiteUrl(ctx)
	if err != nil {
		log.Errorf(ctx, "Couldn't send email: %v", err)
		return err
	}
	err = utils.SendEmailToGivenEmail(ctx, coachee.Email, MEETING_CREATED_TITLE, fmt.Sprintf(MEETING_CREATED_MSG, baseUrl, baseUrl))
	if err != nil {
		log.Errorf(ctx, "Couldn't send email: %v", err)
		return err
	}
	return nil
}

func HandlerTestEmail(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "HandlerTestEmail")

	SendInviteEmailToNewCoachee(ctx, "gleroy78@gmail.com")
}
