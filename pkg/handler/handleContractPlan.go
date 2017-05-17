package handler

import (
	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
	"net/http"
	"eritis_be/pkg/model"
	"eritis_be/pkg/response"
)

func HandleContractPlan(w http.ResponseWriter, r *http.Request) {
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

	plans, err := model.GetAllPlans(ctx)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}
	response.Respond(ctx, w, r, plans, http.StatusOK)
}
