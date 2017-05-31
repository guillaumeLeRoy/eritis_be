package handler

import (
	"net/http"
	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
	"eritis_be/pkg/response"
	"google.golang.org/appengine/user"
	"errors"
	"strings"
)

func HandleAdmin(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handle admin")

	switch r.Method {
	case "GET":

		if strings.Contains(r.URL.Path, "user") {
			handleGetConnectedAdminUser(w, r)// GET /api/v1/admins/user
		} else if strings.Contains(r.URL.Path, "coachs") {
			handleAdminGetCoachs(w, r)// GET /api/v1/admins/coachs
		} else if strings.Contains(r.URL.Path, "coachees") {
			handleAdminGetCoachees(w, r)// GET /api/v1/admins/coachees
		} else if strings.Contains(r.URL.Path, "rhs") {
			handleAdminGetRhs(w, r)// GET /api/v1/admins/rhs
		}
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

func handleAdminGetCoachs(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleAdminGetCoachs")

	handleGetAllCoachs(w, r)
}

func handleAdminGetCoachees(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleAdminGetCoachees")

	handleGetAllCoachees(w, r)
}

func handleAdminGetRhs(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleAdminGetRhs")

	handleGetAllRHs(w, r)
}


