package api
//
//import (
//	"net/http"
//	"errors"
//	"google.golang.org/appengine"
//	"google.golang.org/appengine/datastore"
//	"google.golang.org/appengine/log"
//	"
//	"
//)
//
//func HandleVotes(w http.ResponseWriter, r *http.Request) {
//
//	ctx := appengine.NewContext(r)
//	log.Debugf(ctx, "handle HandleVotes")
//
//	if r.Method != "POST" {
//		http.NotFound(w, r)
//		return
//	}
//
//	// POST /api/votes/userId/:id
//
//	params := PathParams(ctx, r, "/api/votes/userId/:id")
//	userId, ok := params[":id"]
//	if ok {
//		handleVote(w, r, userId)// POST /api/questions/user/ID
//		return
//	}
//	http.NotFound(w, r)
//	return
//}
//
//func validScore(score int) error {
//	if score != -1 && score != 1 {
//		return errors.New("invalid score")
//	}
//	return nil
//}
//
//func handleVote(w http.ResponseWriter, r *http.Request, uid string) {
//	ctx := appengine.NewContext(r)
//	var newVote struct {
//		AnswerID string `json:"answer_id"`
//		Score    int    `json:"score"`
//	}
//	err := Decode(r, &newVote)
//	if err != nil {
//		RespondErr(ctx, w, r, err, http.StatusBadRequest)
//		return
//	}
//	err = validScore(newVote.Score)
//	if err != nil {
//		RespondErr(ctx, w, r, err, http.StatusBadRequest)
//		return
//	}
//	answerKey, err := datastore.DecodeKey(newVote.AnswerID)
//	if err != nil {
//		RespondErr(ctx, w, r, errors.New("invalid answer_id"),
//			http.StatusBadRequest)
//		return
//	}
//	vote, err := CastVote(ctx, answerKey, newVote.Score, uid)
//	if err != nil {
//		RespondErr(ctx, w, r, err, http.StatusInternalServerError)
//		return
//	}
//	Respond(ctx, w, r, vote, http.StatusCreated)
//}