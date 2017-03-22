package api

import (
	"google.golang.org/appengine/log"
	"google.golang.org/appengine"
	"net/http"
	"google.golang.org/appengine/datastore"
)

func HandleCoachs(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handle coach")

	switch r.Method {
	case "GET":
		params := PathParams(ctx, r, "/api/coachs/:id")
		userId, ok := params[":id"]
		if ok {
			handleGetCoachForId(w, r, userId)// GET /api/coachs/ID
			return
		}
		handleGetAllCoachs(w, r)// GET /api/coachs/
		return

	case "PUT":
		params := PathParams(ctx, r, "/api/coachs/:id")
		userId, ok := params[":id"]
		if ok {
			handleUpdateCoachForId(w, r, userId)
		}
	default:
		http.NotFound(w, r)
	}
}

func handleGetAllCoachs(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleGetAllCoachs")

	coachs, err := GetAllCoach(ctx)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusInternalServerError)
	}
	Respond(ctx, w, r, coachs, http.StatusOK)
}

func handleGetCoachForId(w http.ResponseWriter, r *http.Request, id string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleGetCoachForId %s", id)

	key, err := datastore.DecodeKey(id)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
	}

	coach, err := GetCoach(ctx, key)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusInternalServerError)
	}
	Respond(ctx, w, r, coach, http.StatusOK)
}

func handleUpdateCoachForId(w http.ResponseWriter, r *http.Request, id string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleUpdateCoachForId %s", id)

	key, err := datastore.DecodeKey(id)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
	}

	coach, err := GetCoach(ctx, key)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusInternalServerError)
	}

	var updateCoach struct {
		DisplayName string `json:"display_name"`
		Description string `json:"description"`
		AvatarUrl   string `json:"avatar_url"`
	}
	err = Decode(r, &updateCoach)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	coach.Update(ctx, updateCoach.DisplayName, updateCoach.Description, updateCoach.AvatarUrl)

	Respond(ctx, w, r, coach, http.StatusOK)
}



