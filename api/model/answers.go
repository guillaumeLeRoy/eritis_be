package model
//
//import (
//	"time"
//	"google.golang.org/appengine/datastore"
//	"errors"
//	"golang.org/x/net/context"
//)
//
//type Answer struct {
//	Key    *datastore.Key `json:"id" datastore:"-"`
//	Answer string `json:"answer" datastore:",noindex"`
//	CTime  time.Time `json:"created"`
//	User   UserCard `json:"user" datastore:",noindex"`
//	Score  int `json:"score"`
//}
//
//type AnswerCard struct {
//	Key    *datastore.Key `json:"id" datastore:",noindex"`
//	Answer string         `json:"answer" datastore:",noindex"`
//	User   UserCard       `json:"user" datastore:",noindex"`
//}
//
//func (a Answer) Card() AnswerCard {
//	return AnswerCard{
//		Key:    a.Key,
//		Answer: a.Answer,
//		User:   a.User,
//	}
//}
//
//func (a Answer) OK() error {
//	if len(a.Answer) < 10 {
//		return errors.New("answer is too short")
//	}
//	return nil
//}
//
//func GetAnswer(ctx context.Context, answerKey *datastore.Key) (*Answer, error) {
//	var answer Answer
//	err := datastore.Get(ctx, answerKey, &answer)
//	if err != nil {
//		return nil, err
//	}
//	answer.Key = answerKey
//	return &answer, nil
//}
//
//func ( a *Answer) Put(ctx context.Context) error {
//	var err error
//	a.Key, err = datastore.Put(ctx, a.Key, a)
//	if err != nil {
//		return err
//	}
//
//	return nil
//}
//
//func ( a *Answer) Create(ctx context.Context, questionKey *datastore.Key, uid string) error {
//
//	a.Key = datastore.NewIncompleteKey(ctx, "Answer", questionKey)
//	user, err := getUser(ctx, a.User.Key)
//	if err != nil {
//		return err
//	}
//
//	a.User = user.Card()
//	a.CTime = time.Now()
//
//	err = datastore.RunInTransaction(ctx, func(tc context.Context) error {
//		q, err := GetQuestion(tc, questionKey)
//		if err != nil {
//			return err
//		}
//
//		q.AnswersCount ++
//
//		err = q.Update(tc)
//		if err != nil {
//			return err
//		}
//
//		a.Put(tc)
//		if err != nil {
//			return err
//		}
//
//		return nil
//	}, &datastore.TransactionOptions{XG: true})
//
//	if err != nil {
//		return err
//	}
//	return nil
//}
//
//func GetAnswers(ctx context.Context, questionKey *datastore.Key) ([]*Answer, error) {
//	var answers []*Answer
//
//	answerKeys, err := datastore.NewQuery("Answer").Ancestor(questionKey).Order("-Score").Order("-CTime").GetAll(ctx, &answers)
//
//	for i, answer := range answers {
//		answer.Key = answerKeys[i]
//	}
//
//	if err != nil {
//		return nil, err
//	}
//
//	return answers, nil
//}