package handler

import (
	"net/http"
	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
	"eritis_be/pkg/model"
	"eritis_be/pkg/response"
	"strings"
)

func HandleCron(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleCron")

	switch r.Method {
	case "GET":

		// refresh count of available sessions
		if ok := strings.Contains(r.URL.Path, "refresh_available_sessions"); ok {
			handleRefreshAvailableSessionsCount(w, r)// GET /api/v1/crons/refresh_available_sessions
			return
		}

		// notify of an imminent session
		if ok := strings.Contains(r.URL.Path, "notif_imminent_sessions"); ok {
			handleNotifyImminentSessions(w, r)// GET /api/v1/crons/notif_imminent_sessions
			return
		}

		http.NotFound(w, r)
	default:
		http.NotFound(w, r)
	}
}

//For all Coachee, refresh number of available sessions
func handleRefreshAvailableSessionsCount(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	log.Debugf(ctx, "handleRefreshAvailableSessionsCount")

	//get all coachees
	coachees, err := model.GetAllCoachees(ctx)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//go through each coachee and try to refresh
	for _, coachee := range coachees {
		err = coachee.RefreshAvailableSessionsCount(ctx)
		if err != nil {
			response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
			return
		}
	}

	//no response but status OK
	response.Respond(ctx, w, r, nil, http.StatusOK)
}

// send an email and notif when a meeting is about to happen
func handleNotifyImminentSessions(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	log.Debugf(ctx, "handleNotifyImminentSessions")

	meetings, err := model.GetAllOpenMeetingsAboutToHappen(ctx)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	//send emails
	for _, meeting := range meetings {
		//load meeting
		meetingAPI, err := meeting.ConvertToAPIMeeting(ctx)
		if err != nil {
			continue
		}
		//send email to coachee
		SendImminentMeeting(ctx, meetingAPI.Coachee.Email)
		// send email to coach
		SendImminentMeeting(ctx, meetingAPI.Coach.Email)
	}

	//no response but status OK
	response.Respond(ctx, w, r, nil, http.StatusOK)
}