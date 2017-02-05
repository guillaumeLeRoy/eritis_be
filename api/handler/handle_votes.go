package handler

import (
	"net/http"
	"errors"
	"google.golang.org/appengine"
	"google.golang.org/appengine/datastore"
	"google.golang.org/appengine/log"
	"model"
	"tool"
)

func HandleVotes(w http.ResponseWriter, r *http.Request) {

	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handle HandleVotes")

	if r.Method != "POST" {
		http.NotFound(w, r)
		return
	}

	// POST /api/votes/userId/:id

	params := tool.PathParams(r, "/api/votes/userId/:id")
	userId, ok := params[":id"]
	if ok {
		handleVote(w, r, userId)// POST /api/questions/user/ID
		return
	}
	http.NotFound(w, r)
	return
}

func validScore(score int) error {
	if score != -1 && score != 1 {
		return errors.New("invalid score")
	}
	return nil
}

func handleVote(w http.ResponseWriter, r *http.Request, uid string) {
	ctx := appengine.NewContext(r)
	var newVote struct {
		AnswerID string `json:"answer_id"`
		Score    int    `json:"score"`
	}
	err := tool.Decode(r, &newVote)
	if err != nil {
		tool.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}
	err = validScore(newVote.Score)
	if err != nil {
		tool.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}
	answerKey, err := datastore.DecodeKey(newVote.AnswerID)
	if err != nil {
		tool.RespondErr(ctx, w, r, errors.New("invalid answer_id"),
			http.StatusBadRequest)
		return
	}
	vote, err := model.CastVote(ctx, answerKey, newVote.Score, uid)
	if err != nil {
		tool.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}
	tool.Respond(ctx, w, r, vote, http.StatusCreated)
}