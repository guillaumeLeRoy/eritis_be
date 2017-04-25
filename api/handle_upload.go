package api

import (
	"net/http"
	"google.golang.org/appengine/log"
	"google.golang.org/appengine"
)

func handleUpload(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handle file upload")
}
