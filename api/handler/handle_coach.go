package handler

import (
	"google.golang.org/appengine/log"
	"google.golang.org/appengine"
	"net/http"
	"google.golang.org/appengine/datastore"
	"model"
	"tool"
)

func HandleCoachs(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handle coach")

	switch r.Method {
	case "GET":
		params := tool.PathParams(r, "/api/coachs/:id")
		userId, ok := params[":id"]
		if ok {
			handleGetCoachForId(w, r, userId)// POST /api/coachs/ID
			return
		}
		handleGetAllCoachs(w, r)// GET /api/coachs/
		return
	default:
		http.NotFound(w, r)
	}
}

func handleGetAllCoachs(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleGetAllCoachs")

	coachs, err := model.GetAllCoach(ctx)
	if err != nil {
		tool.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
	}
	tool.Respond(ctx, w, r, coachs, http.StatusOK)
}

func handleGetCoachForId(w http.ResponseWriter, r *http.Request, id string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleGetCoachForId %s", id)

	key, err := datastore.DecodeKey(id)
	if err != nil {
		tool.RespondErr(ctx, w, r, err, http.StatusBadRequest)
	}

	coach, err := model.GetCoach(ctx, key)
	if err != nil {
		tool.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
	}
	tool.Respond(ctx, w, r, coach, http.StatusOK)
}
