package handler

import (
	"net/http"
	"google.golang.org/appengine/log"
	"google.golang.org/appengine"
	"model"
	"tool"
)

func HandleCoachees(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handle coach")

	switch r.Method {
	case "GET":
		handleGetAllCoachees(w, r)// GET /api/coachees/
		return
	default:
		http.NotFound(w, r)
	}
}

func handleGetAllCoachees(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleGetAllCoachees")

	coachs, err := model.GetAllCoachees(ctx)
	if err != nil {
		tool.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
	}
	tool.Respond(ctx, w, r, coachs, http.StatusOK)
}
