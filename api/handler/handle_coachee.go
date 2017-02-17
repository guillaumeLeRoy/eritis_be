package handler

import (
	"net/http"
	"google.golang.org/appengine/log"
	"google.golang.org/appengine"
	"model"
	"tool"
	"google.golang.org/appengine/datastore"
)

func HandleCoachees(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handle coach")

	switch r.Method {
	case "GET":
		handleGetAllCoachees(w, r)// GET /api/coachees/
	case "PUT":
		params := tool.PathParams(ctx, r, "/api/coachees/:id")
		userId, ok := params[":id"]
		if ok {
			handleUpdateCoacheeForId(w, r, userId)// PUT /api/coachees/ID
			return
		}
		http.NotFound(w, r)

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

func handleUpdateCoacheeForId(w http.ResponseWriter, r *http.Request, id string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleUpdateCoachForId %s", id)

	key, err := datastore.DecodeKey(id)
	if err != nil {
		tool.RespondErr(ctx, w, r, err, http.StatusBadRequest)
	}

	coachee, err := model.GetCoachee(ctx, key)
	if err != nil {
		tool.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
	}

	var updateCoachee struct {
		DisplayName string `json:"display_name"`
		AvatarUrl   string `json:"avatar_url"`
	}
	err = tool.Decode(r, &updateCoachee)
	if err != nil {
		tool.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	coachee.Update(ctx, updateCoachee.DisplayName, updateCoachee.AvatarUrl)

	tool.Respond(ctx, w, r, coachee, http.StatusOK)
}
