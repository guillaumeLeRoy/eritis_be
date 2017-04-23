package api

import (
	"net/http"
	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
)

func handleCron(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleCron")

	switch r.Method {
	case "GET":
		//TODO now we only have one cron
		handleRefreshAvailableSessionsCount(w, r)// GET /api/v1/cron/refresh_available_sessions
		return
	default:
		http.NotFound(w, r)
	}
}

//For all Coachee, refresh number of available sessions
func handleRefreshAvailableSessionsCount(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)

	log.Debugf(ctx, "handleRefreshAvailableSessionsCount")


	//get all coachees
	coachees, err := getAllCoachees(ctx)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//go through each coachee and try to refresh
	for _, coachee := range coachees {
		err = coachee.refreshAvailableSessionsCount(ctx)
		if err != nil {
			RespondErr(ctx, w, r, err, http.StatusInternalServerError)
			return
		}
	}

	//no response but status OK
	Respond(ctx, w, r, nil, http.StatusOK)
}
