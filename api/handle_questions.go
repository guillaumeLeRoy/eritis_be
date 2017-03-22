package api
//
//import (
//	"net/http"
//	"google.golang.org/appengine/datastore"
//	"google.golang.org/appengine"
//	"google.golang.org/appengine/log"
//	"
//	"
//)
//
//func HandleQuestions(w http.ResponseWriter, r *http.Request) {
//	ctx := appengine.NewContext(r)
//	log.Debugf(ctx, "handle questions")
//
//	switch r.Method {
//	case "POST":
//		params := PathParams(ctx, r, "/api/questions/userId/:id")
//		userId, ok := params[":id"]
//		if ok {
//			handleQuestionCreate(w, r, userId)// POST /api/questions/user/ID
//			return
//		}
//		http.NotFound(w, r)
//		return
//	case "GET":
//		params := PathParams(ctx, r, "/api/questions/:id")
//		questionId, ok := params[":id"]
//		if ok {
//			handleQuestionGet(w, r, questionId)// GET /api/questions/ID
//			return
//		}
//		handleTopQuestions(w, r)// GET /api/questions/
//		return
//	default:
//		http.NotFound(w, r)
//	}
//}
//
//func handleQuestionCreate(w http.ResponseWriter, r *http.Request, uid string) {
//	ctx := appengine.NewContext(r)
//	var q Question
//	err := Decode(r, &q)
//	if err != nil {
//		RespondErr(ctx, w, r, err, http.StatusBadRequest)
//		return
//	}
//
//	err = q.Create(ctx, uid)
//	if err != nil {
//		RespondErr(ctx, w, r, err, http.StatusInternalServerError)
//		return
//	}
//
//	Respond(ctx, w, r, q, http.StatusCreated)
//}
//
//func handleQuestionGet(w http.ResponseWriter, r *http.Request, id string) {
//
//	ctx := appengine.NewContext(r)
//	log.Debugf(ctx, "handleQuestionGet, questionId : %s", id)
//
//	key, err := datastore.DecodeKey(id)
//	if err != nil {
//		RespondErr(ctx, w, r, err, http.StatusBadRequest)
//		return
//	}
//
//	log.Debugf(ctx, "handleQuestionGet, questionId : %s, questionKey : ", id, key)
//
//	question, err := GetQuestion(ctx, key)
//	if err != nil {
//		if err == datastore.ErrNoSuchEntity {
//			RespondErr(ctx, w, r, datastore.ErrNoSuchEntity, http.StatusNotFound)
//			return
//		}
//		RespondErr(ctx, w, r, err, http.StatusBadRequest)
//		return
//	}
//
//	Respond(ctx, w, r, question, http.StatusOK)
//}
//
//func handleTopQuestions(w http.ResponseWriter, r *http.Request) {
//	ctx := appengine.NewContext(r)
//
//	log.Debugf(ctx, "handleTopQuestions")
//
//	questions, err := TopQuestions(ctx)
//	if err != nil {
//		RespondErr(ctx, w, r, err, http.StatusInternalServerError)
//		return
//	}
//	log.Debugf(ctx, "handleTopQuestions, questions %s", questions)
//
//	Respond(ctx, w, r, questions, http.StatusOK)
//}