package model

import (
	"google.golang.org/appengine/datastore"
	"google.golang.org/appengine/log"
	"golang.org/x/net/context"
)

const NOTIFICATION_ENTITY = "notification"

type Notification struct {
	Key     *datastore.Key `json:"id" datastore:"-"`
	IsRead  bool `json:"is_read"`
	Message string `json:"message"`
}

func CreateNotification(ctx context.Context, message string, parent *datastore.Key) (*Notification, error) {
	log.Debugf(ctx, "createNotification")

	var notification Notification
	notification.Key = datastore.NewIncompleteKey(ctx, NOTIFICATION_ENTITY, parent)
	notification.IsRead = false
	notification.Message = message

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
