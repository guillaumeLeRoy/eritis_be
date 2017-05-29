package handler

import (
	"net/http"
	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
	"google.golang.org/appengine/user"
	"eritis_be/pkg/response"
	"errors"
)

func HandleAdmin(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handle admin")

	switch r.Method {
	case "GET":
		handleGetAdmin(w, r)// GET /api/v1/admin
	default:
		http.NotFound(w, r)
	}
}

func handleGetAdmin(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleGetAdmin")

	u := user.Current(ctx)

	log.Debugf(ctx, "handleGetAdmin, %s", u)

	if u != nil && u.Admin {

		var admin struct {
			Email string
		}

		admin.Email = u.Email

		response.Respond(ctx, w, r, &admin, http.StatusOK)
	}
	response.RespondErr(ctx, w, r, errors.New("No user or not an admin"), http.StatusBadRequest)
}


