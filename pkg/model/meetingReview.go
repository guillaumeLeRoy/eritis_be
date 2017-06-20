package model

import (
	"time"
	"google.golang.org/appengine/datastore"
	"golang.org/x/net/context"
	"google.golang.org/appengine/log"
	"strings"
	"errors"
)

const MEETING_REVIEW_ENTITY string = "MeetingReview"

/*
Origin : from a Coach or a Coachee
*/
type MeetingReview struct {
	Key   *datastore.Key `json:"id" datastore:"-"`
	Type  ReviewType `json:"type"`
	Value string `json:"value"`
	Date  time.Time `json:"date"`
}

type ReviewType string

const (
	SESSION_CONTEXT ReviewType = "SESSION_CONTEXT"
	SESSION_GOAL    ReviewType = "SESSION_GOAL"
	SESSION_RESULT  ReviewType = "SESSION_RESULT"
	SESSION_UTILITY ReviewType = "SESSION_UTILITY"
	SESSION_RATE    ReviewType = "SESSION_RATE"
)

func ConvertToReviewType(reviewType string) (ReviewType, error) {
	if strings.Compare(reviewType, string(SESSION_RESULT)) == 0 {
		return SESSION_RESULT, nil
	} else if strings.Compare(reviewType, string(SESSION_UTILITY)) == 0 {
		return SESSION_UTILITY, nil
	} else if strings.Compare(reviewType, string(SESSION_CONTEXT)) == 0 {
		return SESSION_CONTEXT, nil
	} else if strings.Compare(reviewType, string(SESSION_GOAL)) == 0 {
		return SESSION_GOAL, nil
	} else if strings.Compare(reviewType, string(SESSION_RATE)) == 0 {
		return SESSION_RATE, nil
	}

	return "", errors.New("can't convert reviewType")
}

func CreateReview(ctx context.Context, meetingKey *datastore.Key, value string, reviewType ReviewType) (*MeetingReview, error) {
	log.Debugf(ctx, "Create createReview")

	var review MeetingReview
	review.Type = reviewType
	review.Value = value
	review.Date = time.Now()
	review.Key = datastore.NewIncompleteKey(ctx, MEETING_REVIEW_ENTITY, meetingKey)

	key, err := datastore.Put(ctx, review.Key, &review)
	if err != nil {
		return nil, err
	}
	review.Key = key

	return &review, nil
}

func (r *MeetingReview) UpdateReview(ctx context.Context, reviewKey *datastore.Key, value string) (*MeetingReview, error) {
	log.Debugf(ctx, "Create createReview")

	r.Value = value
	r.Date = time.Now()
	key, err := datastore.Put(ctx, r.Key, r)

	if err != nil {
		return nil, err
	}
	r.Key = key
	return r, nil
}

func GetAllReviewsForMeeting(ctx context.Context, meetingKey *datastore.Key) ([]*MeetingReview, error) {
	log.Debugf(ctx, "getReviewsForMeeting")

	var reviews []*MeetingReview
	keys, err := datastore.NewQuery(MEETING_REVIEW_ENTITY).Ancestor(meetingKey).GetAll(ctx, &reviews)

	for i, review := range reviews {
		review.Key = keys[i]
	}
	if err != nil {
		return nil, err
	}

	log.Debugf(ctx, "getReviewsForMeeting", reviews)

	return reviews, nil
}

func GetReviewsForMeetingAndForType(ctx context.Context, meetingKey *datastore.Key, reviewType string) ([]*MeetingReview, error) {
	log.Debugf(ctx, "getReviewsForMeetingAndForType, reviewType %s", reviewType)

	var reviews []*MeetingReview
	keys, err := datastore.NewQuery(MEETING_REVIEW_ENTITY).Ancestor(meetingKey).Filter("Type =", reviewType).GetAll(ctx, &reviews)

	for i, review := range reviews {
		review.Key = keys[i]
	}
	if err != nil {
		return nil, err
	}

	log.Debugf(ctx, "getReviewsForMeeting", reviews)

	return reviews, nil
}

func DeleteAllReviewsForMeeting(ctx context.Context, meetingKey *datastore.Key) error {
	log.Debugf(ctx, "deleteAllReviewsForMeeting, meeting key %s", meetingKey)

	//get times
	reviews, err := GetAllReviewsForMeeting(ctx, meetingKey)
	if err != nil {
		return err
	}

	//loop and delete them
	for _, review := range reviews {
		err = DeleteMeetingReview(ctx, review.Key)
		if err != nil {
			return err
		}
	}

	return nil
}

// delete review
func DeleteMeetingReview(ctx context.Context, reviewKey *datastore.Key) (error) {
	log.Debugf(ctx, "deleteMeetingReview, reviewKey %s", reviewKey)

	err := datastore.Delete(ctx, reviewKey)

	return err
}
