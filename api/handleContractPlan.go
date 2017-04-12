package api

import (
	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
	"net/http"
)

func handleContractPlan(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleContractPlan")

	switch r.Method {
	case "GET":
		handleGetAllPlans(w, r)// GET /api/plans/
		return
	default:
		http.NotFound(w, r)
	}
}

func handleGetAllPlans(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleGetAllPlans")

	plans, err := getAllPlans(ctx)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusInternalServerError)
	}
	Respond(ctx, w, r, plans, http.StatusOK)
}
