package api

import (
	"time"
	"google.golang.org/appengine/datastore"
	"golang.org/x/net/context"
	"google.golang.org/appengine/log"
)

/*
Origin : from a Coach or a Coachee
*/
type MeetingReview struct {
	Key     *datastore.Key `json:"id" datastore:"-"`
	Date    time.Time `json:"date"`
	Comment string `json:"comment"`
	Score   int `json:"score"`
	Origin  *datastore.Key `json:"score"`
}

func CreateReview(ctx context.Context, parent *Meeting, originUserId *datastore.Key, comment string, score int) (*MeetingReview, error) {
	log.Debugf(ctx, "Create createReview")

	var review = MeetingReview{}

	review.Comment = comment
	review.Score = score
	review.Date = time.Now()
	review.Origin = originUserId

	review.Key = datastore.NewIncompleteKey(ctx, "MeetingReview", parent.Key)

	key, err := datastore.Put(ctx, review.Key, &review)
	if err != nil {
		return nil, err
	}
	review.Key = key

	return &review, nil
}

func GetReviewsForMeeting(ctx context.Context, parent *Meeting) ([]*MeetingReview, error) {
	log.Debugf(ctx, "getReviewsForMeeting")

	var reviews []*MeetingReview
	keys, err := datastore.NewQuery("MeetingReview").Ancestor(parent.Key).GetAll(ctx, &reviews)

	for i, review := range reviews {
		review.Key = keys[i]
	}
	if err != nil {
		return nil, err
	}

	log.Debugf(ctx, "getReviewsForMeeting", reviews)

	return reviews, nil

}