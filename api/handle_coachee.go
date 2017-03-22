package api

import (
	"net/http"
	"google.golang.org/appengine/log"
	"google.golang.org/appengine"
	"google.golang.org/appengine/datastore"
)

func HandleCoachees(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handle coach")

	switch r.Method {
	case "GET":
		params := PathParams(ctx, r, "/api/coachees/:id")
		userId, ok := params[":id"]
		if ok {
			handleGetCoacheeForId(w, r, userId)// GET /api/coachees/ID
			return
		}
		handleGetAllCoachees(w, r)// GET /api/coachees/
		return
	case "PUT":
		//update selected coach
		params := PathParams(ctx, r, "/api/coachees/:coacheeId/coach/:coachId")
		coacheeId, ok := params[":coacheeId"]
		if ok {
			//read a coach id
			coachId, ok := params[":coachId"]
			if ok {
				handleUpdateSelectedCoach(w, r, coacheeId, coachId)// PUT /api/coachees/ID/coach/coachId
				return
			}
			//just update coachee
			handleUpdateCoacheeForId(w, r, coacheeId)// PUT /api/coachees/ID
			return
		}

		http.NotFound(w, r)

	default:
		http.NotFound(w, r)
	}
}

func handleGetCoacheeForId(w http.ResponseWriter, r *http.Request, id string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleGetCoacheeForId %s", id)

	key, err := datastore.DecodeKey(id)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
	}

	coach, err := GetCoachee(ctx, key)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusInternalServerError)
	}
	Respond(ctx, w, r, coach, http.StatusOK)
}

func handleGetAllCoachees(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleGetAllCoachees")

	coachs, err := GetAllCoachees(ctx)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusInternalServerError)
	}
	Respond(ctx, w, r, coachs, http.StatusOK)
}

func handleUpdateCoacheeForId(w http.ResponseWriter, r *http.Request, id string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleUpdateCoachForId %s", id)

	key, err := datastore.DecodeKey(id)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
	}

	coachee, err := GetCoachee(ctx, key)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusInternalServerError)
	}

	var updateCoachee struct {
		DisplayName string `json:"display_name"`
		AvatarUrl   string `json:"avatar_url"`
	}
	err = Decode(r, &updateCoachee)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}
	coachee.Update(ctx, updateCoachee.DisplayName, updateCoachee.AvatarUrl)

	Respond(ctx, w, r, coachee, http.StatusOK)
}

func handleUpdateSelectedCoach(w http.ResponseWriter, r *http.Request, coacheeId string, coachId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleUpdateSelectedCoach %s", coacheeId)

	//get coachee
	coacheeKey, err := datastore.DecodeKey(coacheeId)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
	}

	coachee, err := GetCoachee(ctx, coacheeKey)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusInternalServerError)
	}

	//get coach
	coachKey, err := datastore.DecodeKey(coachId)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
	}
	coach, err := GetCoach(ctx, coachKey)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusInternalServerError)
	}

	//update Coachee selected coach
	apiCoachee, err := coachee.UpdateSelectedCoach(ctx, coach)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusInternalServerError)
	}
	Respond(ctx, w, r, apiCoachee, http.StatusOK)
}
