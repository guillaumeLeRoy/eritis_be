package handler

import (
	"net/http"
	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
	"model"
	"tool"
)

func HandleLogin(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handle login")

	switch r.Method {
	case "POST":
		handleUserCreate(w, r)
	case "GET":
		params := tool.PathParams(r, "/api/login/:firebaseId")
		uid, ok := params[":firebaseId"]
		if ok {
			handleGetUser(w, r, uid)// GET /api/login/:firebaseId
			return
		}
		http.NotFound(w, r)
		return
	default:
		http.NotFound(w, r)
	}
}

func handleUserCreate(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleUserCreate")

	var fbUser model.FirebaseUser
	err := tool.Decode(r, &fbUser)
	if err != nil {
		tool.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	user, err := fbUser.CreateBis(ctx)
	if err != nil {
		tool.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	tool.Respond(ctx, w, r, user, http.StatusCreated)
}

func handleGetUser(w http.ResponseWriter, r *http.Request, firebaseId string) {
	ctx := appengine.NewContext(r)

	var fbUser model.FirebaseUser
	fbUser.UID = firebaseId
	user, err := fbUser.GetUser(ctx)
	if err != nil {
		tool.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	tool.Respond(ctx, w, r, user, http.StatusOK)
}
