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

func getAllNotificationsForRhs(w http.ResponseWriter, r *http.Request, uid string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "getAllNotificationsForRhs")

	getAllNotificationsForUser(w, r, uid)
}

func getAllNotificationsForCoach(w http.ResponseWriter, r *http.Request, uid string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "getAllNotificationsForCoach")

	getAllNotificationsForUser(w, r, uid)
}

func getAllNotificationsForCoachee(w http.ResponseWriter, r *http.Request, uid string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "getAllNotificationsForCoachee")
	getAllNotificationsForUser(w, r, uid)
}

func getAllNotificationsForUser(w http.ResponseWriter, r *http.Request, uid string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "getAllNotificationsForUser")

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

func updateAllNotificationToRead(w http.ResponseWriter, r *http.Request, uid string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "updateAllNotificationToRead")

	key, err := datastore.DecodeKey(uid)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	err = model.UpdateAllNotificationsToRead(ctx, key)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	response.Respond(ctx, w, r, nil, http.StatusOK)
}
