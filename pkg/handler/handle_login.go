package handler

import (
	"net/http"
	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
	"eritis_be/pkg/model"
	"eritis_be/pkg/response"
)

func HandleLogin(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handle login")

	switch r.Method {
	case "GET":
		params := response.PathParams(ctx, r, "/v1/login/:firebaseId")
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


func handleGetUser(w http.ResponseWriter, r *http.Request, firebaseId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleGetUser, FBid %s", firebaseId)

	var fbUser model.FirebaseUser
	fbUser.UID = firebaseId
	res, err := fbUser.GetUser(ctx)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	response.Respond(ctx, w, r, res, http.StatusOK)
}


