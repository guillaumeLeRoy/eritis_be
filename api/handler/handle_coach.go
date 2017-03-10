package handler

import (
	"google.golang.org/appengine/log"
	"google.golang.org/appengine"
	"net/http"
	"google.golang.org/appengine/datastore"
	"model"
	"tool"
	"strings"
)

func HandleCoachs(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handle coach")

	switch r.Method {
	case "GET":
		params := tool.PathParams(ctx, r, "/api/coachs/:id")
		userId, ok := params[":id"]
		if ok {
			handleGetCoachForId(w, r, userId)// GET /api/coachs/ID
			return
		}
		handleGetAllCoachs(w, r)// GET /api/coachs/
		return

	case "PUT":
		contains := strings.Contains(r.URL.Path, "display_name")
		if contains {
			params := tool.PathParams(ctx, r, "/api/coachs/:id/display_name")
			userId, ok := params[":id"]
			if ok {
				handleUpdateCoachDisplayNameForId(w, r, userId)// PUT /api/coachs/ID/display_name
				return
			}
		}

		contains = strings.Contains(r.URL.Path, "avatar_url")
		if contains {
			params := tool.PathParams(ctx, r, "/api/coachs/:id/avatar_url")
			userId, ok := params[":id"]
			if ok {
				handleUpdateCoachAvatarUrlForId(w, r, userId)// PUT /api/coachs/ID/avatar_url
				return
			}
		}

		contains = strings.Contains(r.URL.Path, "description")
		if contains {
			params := tool.PathParams(ctx, r, "/api/coachs/:id/description")
			userId, ok := params[":id"]
			if ok {
				handleUpdateCoachDescriptionForId(w, r, userId)// PUT /api/coachs/ID/description
				return
			}
		}

		http.NotFound(w, r)
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

func handleUpdateCoachDisplayNameForId(w http.ResponseWriter, r *http.Request, id string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleUpdateCoachForId %s", id)

	key, err := datastore.DecodeKey(id)
	if err != nil {
		tool.RespondErr(ctx, w, r, err, http.StatusBadRequest)
	}

	coach, err := model.GetCoach(ctx, key)
	if err != nil {
		tool.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
	}

	var updateCoach struct {
		DisplayName string `json:"display_name"`
	}
	err = tool.Decode(r, &updateCoach)
	if err != nil {
		tool.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	coach.UpdateDisplayName(ctx, updateCoach.DisplayName)

	tool.Respond(ctx, w, r, coach, http.StatusOK)
}

func handleUpdateCoachAvatarUrlForId(w http.ResponseWriter, r *http.Request, id string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleUpdateCoachAvatarUrlForId %s", id)

	key, err := datastore.DecodeKey(id)
	if err != nil {
		tool.RespondErr(ctx, w, r, err, http.StatusBadRequest)
	}

	coach, err := model.GetCoach(ctx, key)
	if err != nil {
		tool.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
	}

	var updateCoach struct {
		AvatarUrl string `json:"avatar_url"`
	}
	err = tool.Decode(r, &updateCoach)
	if err != nil {
		tool.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	coach.UpdateAvatarUrl(ctx, updateCoach.AvatarUrl)

	tool.Respond(ctx, w, r, coach, http.StatusOK)
}

func handleUpdateCoachDescriptionForId(w http.ResponseWriter, r *http.Request, id string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleUpdateCoachDescriptionForId %s", id)

	key, err := datastore.DecodeKey(id)
	if err != nil {
		tool.RespondErr(ctx, w, r, err, http.StatusBadRequest)
	}

	coach, err := model.GetCoach(ctx, key)
	if err != nil {
		tool.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
	}

	var updateCoach struct {
		Description string `json:"description"`
	}
	err = tool.Decode(r, &updateCoach)
	if err != nil {
		tool.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	coach.UpdateDescription(ctx, updateCoach.Description)

	tool.Respond(ctx, w, r, coach, http.StatusOK)
}
