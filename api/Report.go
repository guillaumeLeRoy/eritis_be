package api

import (
	"time"
	"google.golang.org/appengine/datastore"
)

type Report struct {
	Key        *datastore.Key
	Date       time.Time
	CoachKey   datastore.Key
	CoacheeKey datastore.Key
	Comment    string
}
