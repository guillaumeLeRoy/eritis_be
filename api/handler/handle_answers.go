package handler

import (
	"net/http"
	"google.golang.org/appengine/datastore"
	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
	"model"
	"tool"
)

func HandleAnswers(w http.ResponseWriter, r *http.Request) {

	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handle answers")

	switch r.Method {
	case "GET":
		handleAnswersGet(w, r)
	case "POST":
		params := tool.PathParams(r, "/api/answers/userId/:id")
		userId, ok := params[":id"]
		if ok {
			handleAnswerCreate(w, r, userId)// POST /api/answers/user/ID
			return
		}
		http.NotFound(w, r)
		return
	default:
		http.NotFound(w, r)
	}
}

/* GET /api/answers question_id=abc123
 */
func handleAnswersGet(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	q := r.URL.Query()
	questionIDStr := q.Get("question_id")

	questionKey, err := datastore.DecodeKey(questionIDStr)

	log.Debugf(ctx, "handleAnswersGet, questionIdstr: %s, questionKey : %s", questionIDStr, questionKey)

	if err != nil {
		tool.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}
	answers, err := model.GetAnswers(ctx, questionKey)
	if err != nil {
		tool.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}
	tool.Respond(ctx, w, r, answers, http.StatusOK)
}

func handleAnswerCreate(w http.ResponseWriter, r *http.Request, uid string) {
	ctx := appengine.NewContext(r)
	var newAnswer struct {
		model.Answer
		QuestionId string `json:"question_id"`
	}

	err := tool.Decode(r, &newAnswer)
	if err != nil {
		tool.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	questionKey, err := datastore.DecodeKey(newAnswer.QuestionId)
	if err != nil {
		tool.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	err = newAnswer.OK()
	if err != nil {
		tool.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	answer := newAnswer.Answer

	//user, err := UserFromAEUser(ctx)
	//if err != nil {
	//	RespondErr(ctx, w, r, err, http.StatusBadRequest)
	//	return }
	//answer.User = user.Card()

	err = answer.Create(ctx, questionKey, uid)
	if err != nil {
		tool.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}
	tool.Respond(ctx, w, r, answer, http.StatusCreated)
}