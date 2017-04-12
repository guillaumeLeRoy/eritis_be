package api

import (
	"golang.org/x/net/context"
	"google.golang.org/appengine/log"
)

type PlanInt int

const (
	NATIXIS_3_DAYS PlanInt = 1 + iota
	NATIXIS_6_DAYS
)

type Plan struct {
	PlanId        PlanInt `json:"plan_id"`
	PlanName      string `json:"plan_name"`
	SessionsCount int `json:"sessions_count"`
}

func createPlanFromId(id PlanInt) *Plan {
	var p Plan
	p.PlanId = id
	p.SessionsCount = getSessionsCount(id)
	p.PlanName = getPlanName(id)
	return &p
}

func getSessionsCount(id PlanInt) int {
	switch id {
	case NATIXIS_3_DAYS:
		return 3
	case NATIXIS_6_DAYS:
		return 6
	}
	return 0
}

func getPlanName(id PlanInt) string {
	switch id {
	case NATIXIS_3_DAYS:
		return "NATIXIS_3_DAYS"
	case NATIXIS_6_DAYS:
		return "NATIXIS_6_DAYS"
	}
	return "nop"
}

func getAllPlans(ctx context.Context) ([]*Plan, error) {
	log.Debugf(ctx, "getAllPlans")

	plans := make([]*Plan, 0)
	plans = append(plans, createPlanFromId(NATIXIS_3_DAYS))
	plans = append(plans, createPlanFromId(NATIXIS_6_DAYS))
	return plans, nil
}