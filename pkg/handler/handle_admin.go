package handler

import (
	"net/http"
	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
	"google.golang.org/appengine/user"
	"errors"
	"strings"
	"eritis_be/pkg/response"
)

func HandleAdmin(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handle admin")

	switch r.Method {
	case "GET":
		if strings.Contains(r.URL.Path, "user") {
			handleGetConnectedAdminUser(w, r) // GET /api/admins/v1/user
		}
		http.NotFound(w, r)
	default:
		http.NotFound(w, r)
	}
}

func handleGetConnectedAdminUser(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleGetConnectedAdminUser")

	u := user.Current(ctx)

	log.Debugf(ctx, "handleGetConnectedAdminUser, %s", u)

	if u != nil && u.Admin {

		var admin struct {
			Email string `json:"email"`
		}

		admin.Email = u.Email

		response.Respond(ctx, w, r, &admin, http.StatusOK)
		return
	}
	response.RespondErr(ctx, w, r, errors.New("No user or not an admin"), http.StatusBadRequest)
}
