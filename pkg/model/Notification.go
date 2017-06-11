package model

import (
	"google.golang.org/appengine/datastore"
	"google.golang.org/appengine/log"
	"golang.org/x/net/context"
	"time"
)

const NOTIFICATION_ENTITY = "notification"

const COACH_SELECTED_FOR_SESSION = "Le coach  %s a accepté votre demande pour votre séance"
const MEETING_TIME_SELECTED_FOR_SESSION = "Votre coach a défini un horaire pour votre séance"//TODO to improve
const MEETING_CLOSED_BY_COACH = "Félicitation! N’hesitez pas à consulter le compte rendu de la séance."

const MEETING_CANCELED_BY_COACHEE = "La séance a été annulée par votre coaché"
const MEETING_TIME_REMOVED = "Votre coach a supprimer l'horaire de votre séance"

type Notification struct {
	Key     *datastore.Key `json:"id" datastore:"-"`
	IsRead  bool `json:"is_read"`
	Message string `json:"message"`
	Date    time.Time `json:"date"`
}

func CreateNotification(ctx context.Context, message string, parent *datastore.Key) (*Notification, error) {
	log.Debugf(ctx, "createNotification")

	var notification Notification
	notification.Key = datastore.NewIncompleteKey(ctx, NOTIFICATION_ENTITY, parent)
	notification.IsRead = false
	notification.Message = message
	notification.Date = time.Now()

	//save it
	err := notification.Update(ctx)
	if err != nil {
		return nil, err
	}
	return &notification, nil
}

func (m *Notification) Update(ctx context.Context) error {
	log.Debugf(ctx, "update")

	key, err := datastore.Put(ctx, m.Key, m)
	if err != nil {
		return err
	}
	m.Key = key
	return nil
}

func GetNotifications(ctx context.Context, parent *datastore.Key) ([]*Notification, error) {
	log.Debugf(ctx, "getNotifications")

	var notifications []*Notification
	keys, err := datastore.NewQuery(NOTIFICATION_ENTITY).Ancestor(parent).GetAll(ctx, &notifications)

	if err != nil {
		return nil, err
	}

	//get Keys
	for i, notif := range notifications {
		notif.Key = keys[i]
	}

	return notifications, nil
}

func GetUnreadNotifications(ctx context.Context, parent *datastore.Key) ([]*Notification, error) {
	log.Debugf(ctx, "GetUnreadNotifications")

	var notifications []*Notification
	keys, err := datastore.NewQuery(NOTIFICATION_ENTITY).Ancestor(parent).Filter("IsRead =", false).GetAll(ctx, &notifications)

	if err != nil {
		return nil, err
	}

	//get Keys
	for i, notif := range notifications {
		notif.Key = keys[i]
	}

	return notifications, nil
}

func UpdateAllNotificationsToRead(ctx context.Context, parent *datastore.Key) error {
	log.Debugf(ctx, "UpdateAllNotificationsToRead")

	notifs, err := GetNotifications(ctx, parent)
	if err != nil {
		return err
	}

	for _, notif := range notifs {
		notif.IsRead = true
		notif.Update(ctx)
	}

	return nil
}
