package handler

import (
	"net/http"
	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
	"google.golang.org/appengine/datastore"
	"eritis_be/pkg/response"
	"eritis_be/pkg/model"
)

func HandleNotification(w http.ResponseWriter, r *http.Request) {

}

func getAllNotificationsForCoachee(w http.ResponseWriter, r *http.Request, uid string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "getAllNotificationsForCoachee")

	coacheeKey, err := datastore.DecodeKey(uid)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	notifs, err := model.GetNotifications(ctx, coacheeKey)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	response.Respond(ctx, w, r, &notifs, http.StatusOK)
}
