package handler

import (
	"net/http"
	"google.golang.org/appengine"
	"google.golang.org/appengine/log"
	"google.golang.org/appengine/datastore"
	"time"
	"errors"
	"strconv"
	"strings"
	"golang.org/x/net/context"
	"eritis_be/pkg/model"
	"eritis_be/pkg/response"
)

func HandleMeeting(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handle meeting")

	switch r.Method {

	case "POST":

		//create potential meeting time
		if ok := strings.Contains(r.URL.Path, "potential"); ok {
			params := response.PathParams(ctx, r, "/api/meeting/:uid/potential")
			uid, ok := params[":uid"]
			if ok {
				createMeetingPotentialTime(w, r, uid)// POST /api/meeting/:uid/potential
				return
			}
		}

		/// create new meeting review
		if ok := strings.Contains(r.URL.Path, "review"); ok {
			params := response.PathParams(ctx, r, "/api/meeting/:uid/review")
			uid, ok := params[":uid"]
			if ok {
				createReviewForAMeeting(w, r, uid)// POST /api/meeting/:uid/review
				return
			}
		}

		/// create new meeting

		handleCreateMeeting(w, r)

	case "PUT":

		//add coach to meeting
		contains := strings.Contains(r.URL.Path, "coach")
		if contains {
			params := response.PathParams(ctx, r, "/api/meeting/:meetingId/coach/:coachId")
			meetingId, ok := params[":meetingId"]
			coachId, ok := params[":coachId"]
			if ok {
				setCoachForMeeting(w, r, meetingId, coachId)
				return
			}
		}

		//update potential date
		contains = strings.Contains(r.URL.Path, "potential")
		if contains {
			params := response.PathParams(ctx, r, "/api/meeting/potential/:potId")
			potId, ok := params[":potId"]
			if ok {
				updateMeetingPotentialTime(w, r, potId)
				return
			}
		}

		//set meeting hour
		contains = strings.Contains(r.URL.Path, "date")
		if contains {
			params := response.PathParams(ctx, r, "/api/meeting/:meetingId/date/:potId")
			meetingId, ok := params[":meetingId"]
			potId, ok := params[":potId"]
			if ok {
				setTimeForMeeting(w, r, meetingId, potId)
				return
			}
		}

		//close meeting with review
		contains = strings.Contains(r.URL.Path, "close")
		if contains {
			params := response.PathParams(ctx, r, "/api/meeting/:uid/close")
			uid, ok := params[":uid"]
			if ok {
				closeMeeting(w, r, uid)// PUT /api/meeting/:uid/close
				return
			}
		}

		http.NotFound(w, r)
	case "GET":

		/**
		 GET all meetings for a specific coachee
		 */
		contains := strings.Contains(r.URL.Path, "/api/meetings/coachee")
		if contains {
			params := response.PathParams(ctx, r, "/api/meetings/coachee/:uid")
			//verify url contains coachee
			if _, ok := params["coachee"]; ok {
				//get uid param
				uid, ok := params[":uid"]
				if ok {
					getAllMeetingsForCoachee(w, r, uid)// GET /api/meeting/coachee/:uid
					return
				}
			}
		}

		/**
		 GET all meetings for a specific coach
		 */
		contains = strings.Contains(r.URL.Path, "/api/meetings/coach")
		if contains {
			params := response.PathParams(ctx, r, "/api/meetings/coach/:uid")
			//verify url contains coach
			if _, ok := params["coach"]; ok {
				//get uid param
				uid, ok := params[":uid"]
				if ok {
					getAllMeetingsForCoach(w, r, uid)// GET /api/meeting/coach/:uid
					return
				}
			}
		}

		/**
			GET all potential dates
		*/
		contains = strings.Contains(r.URL.Path, "potentials")
		if contains {
			params := response.PathParams(ctx, r, "/api/meeting/:meetingId/potentials")
			//verify url contains meeting
			if _, ok := params["meeting"]; ok {
				//get uid param
				meetingId, ok := params[":meetingId"]
				if ok {
					getPotentialsTimeForAMeeting(w, r, meetingId)// GET /api/meeting/:meetingId/reviews
					return
				}
			}
		}

		////get all reviews for meeting and type
		//contains = strings.Contains(r.URL.Path, "/api/meeting/")
		//if contains {
		//	params := response.PathParams(ctx, r, "/api/meeting/:meetingId/reviews/:type")
		//	//verify url contains meeting
		//	if _, ok := params["meeting"]; ok {
		//		//get uid param
		//		meetingId, ok := params[":meetingId"]
		//		if ok {
		//			getAllReviewsForAMeeting(w, r, meetingId)// GET /api/meeting/:meetingId/reviews
		//			return
		//		}
		//	}
		//}

		//get all reviews for a meeting
		contains = strings.Contains(r.URL.Path, "/api/meeting/")
		if contains {
			params := response.PathParams(ctx, r, "/api/meeting/:meetingId/reviews")
			//verify url contains meeting
			if _, ok := params["meeting"]; ok {
				//get uid param
				meetingId, ok := params[":meetingId"]
				if ok {
					getAllReviewsForAMeeting(w, r, meetingId, r.URL.Query().Get("type"))// GET /api/meeting/:meetingId/reviews
					return
				}
			}
		}

		http.NotFound(w, r)
		return


	case "DELETE":
		//delete potential dates for a meeting
		contains := strings.Contains(r.URL.Path, "potentials")
		if contains {
			params := response.PathParams(ctx, r, "/api/meeting/potentials/:potId")
			potId, ok := params[":potId"]
			if ok {
				deletePotentialDate(w, r, potId)
				return
			}
		}

		//delete review for a meeting
		contains = strings.Contains(r.URL.Path, "reviews")
		if contains {
			params := response.PathParams(ctx, r, "/api/meeting/reviews/:reviewId")
			potId, ok := params[":reviewId"]
			if ok {
				handleDeleteMeetingReview(w, r, potId)
				return
			}
		}

		//when a coachee wants to delete meeting
		params := response.PathParams(ctx, r, "/api/meeting/:meetingId")
		meetingId, ok := params[":meetingId"]
		if ok {
			handleCoacheeCancelMeeting(w, r, meetingId)
			return
		}

		http.NotFound(w, r)
		return
	default:
		http.NotFound(w, r)
	}
}

func handleCreateMeeting(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleCreateMeeting")

	var newMeeting struct {
		CoacheeId string `json:"coacheeId"`
	}
	err := response.Decode(r, &newMeeting)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//todo valid meeting ??

	log.Debugf(ctx, "handleCreateMeeting, coacheeId ", newMeeting.CoacheeId)

	coacheeKey, err := datastore.DecodeKey(newMeeting.CoacheeId)
	if err != nil {
		response.RespondErr(ctx, w, r, errors.New("invalid coachee id"),
			http.StatusBadRequest)
		return
	}
	//verify this user can create a new meeting
	coachee, err := model.GetCoachee(ctx, coacheeKey)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}
	//check
	if coachee.AvailableSessionsCount <= 0 {
		response.RespondErr(ctx, w, r, errors.New("limit reached"), http.StatusBadRequest)
		return
	}

	//create new meeting
	meeting, err := model.CreateMeetingCoachee(ctx, coacheeKey)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	//if this coachee already have a coach associated then auto associate this new meeting
	if coachee.SelectedCoach != nil {
		//associate a MeetingCoach with meetingCoachee
		err = model.Associate(ctx, coachee.SelectedCoach, meeting)
		if err != nil {
			response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
			return
		}
	}

	//decrease number of available sessions and save
	err = coachee.DecreaseAvailableSessionsCount(ctx)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	response.Respond(ctx, w, r, meeting, http.StatusCreated)
}

func getAllMeetingsForCoach(w http.ResponseWriter, r *http.Request, uid string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "getAllMeetingsForCoach")

	key, err := datastore.DecodeKey(uid)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	var meetings[]*model.ApiMeeting
	meetings, err = model.GetMeetingsForCoach(ctx, key);
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	response.Respond(ctx, w, r, meetings, http.StatusCreated)

}

func getAllMeetingsForCoachee(w http.ResponseWriter, r *http.Request, uid string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "getAllMeetingsForCoachee")

	coacheeKey, err := datastore.DecodeKey(uid)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	var meetings[]*model.ApiMeeting
	err = datastore.RunInTransaction(ctx, func(ctx context.Context) error {
		log.Debugf(ctx, "getAllMeetingsForCoachee, transaction start")

		meetings, err = model.GetMeetingsForCoachee(ctx, coacheeKey);
		if err != nil {
			return err
		}

		log.Debugf(ctx, "getAllMeetingsForCoachee, transaction DONE")

		return nil
	}, &datastore.TransactionOptions{XG: true})
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	log.Debugf(ctx, "getAllMeetingsForCoachee, %s", meetings)

	response.Respond(ctx, w, r, &meetings, http.StatusCreated)
}

/* Add a review for the given meeting. Only one review can exist for a given type.
*/
func createReviewForAMeeting(w http.ResponseWriter, r *http.Request, meetingId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "createReviewForAMeeting, meetingId : ", meetingId)

	meetingKey, err := datastore.DecodeKey(meetingId)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	var review struct {
		Type    string `json:"type"`
		Comment string `json:"comment"`
	}
	err = response.Decode(r, &review)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//convert
	reviewType, err := model.ConvertToReviewType(review.Type)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}


	//check if a review already for this type
	reviews, err := model.GetReviewsForMeetingAndForType(ctx, meetingKey, review.Type)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	var meetingRev *model.MeetingReview
	if len(reviews) == 0 {
		//create review
		meetingRev, err = model.CreateReview(ctx, meetingKey, review.Comment, reviewType)
		if err != nil {
			response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
			return
		}
	} else {
		//update review
		//reviews[0] should be safe to access to
		meetingRev, err = reviews[0].UpdateReview(ctx, reviews[0].Key, review.Comment)
		if err != nil {
			response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
			return
		}
	}

	response.Respond(ctx, w, r, meetingRev, http.StatusCreated)
}

func getAllReviewsForAMeeting(w http.ResponseWriter, r *http.Request, meetingId string, reviewType string) {

	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "getReviewsForAMeeting, meetingId : ", meetingId)

	meetingKey, err := datastore.DecodeKey(meetingId)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	var reviews []*model.MeetingReview
	if reviewType != "" {
		reviews, err = model.GetReviewsForMeetingAndForType(ctx, meetingKey, reviewType)
	} else {
		reviews, err = model.GetAllReviewsForMeeting(ctx, meetingKey)
	}
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	response.Respond(ctx, w, r, reviews, http.StatusCreated)
}

/* We suppose the meeting is closed by a Coach */
func closeMeeting(w http.ResponseWriter, r *http.Request, meetingId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "closeMeeting, meetingId : ", meetingId)

	key, err := datastore.DecodeKey(meetingId)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	var review struct {
		Comment string `json:"comment"`
		Type    string `json:"type"`
	}
	err = response.Decode(r, &review)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	log.Debugf(ctx, "closeMeeting, got review %s : ", review)

	var ApiMeeting *model.ApiMeeting
	err = datastore.RunInTransaction(ctx, func(ctx context.Context) error {
		var err error
		var meeting *model.MeetingCoachee
		meeting, err = model.GetMeeting(ctx, key)
		if err != nil {
			return err
		}

		log.Debugf(ctx, "closeMeeting, get meeting", meeting)

		//convert
		reviewType, err := model.ConvertToReviewType(review.Type)
		if err != nil {
			return err
		}

		//create review
		meetingRev, err := model.CreateReview(ctx, meeting.Key, review.Comment, reviewType)
		if err != nil {
			return err
		}

		log.Debugf(ctx, "closeMeeting, review created : ", meetingRev)

		err = meeting.Close(ctx)
		if err != nil {
			return err
		}

		log.Debugf(ctx, "closeMeeting, closed")

		//convert to API meeting
		ApiMeeting, err = meeting.ConvertToAPIMeeting(ctx)
		if err != nil {
			return err
		}

		return nil
	}, &datastore.TransactionOptions{XG: true})
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	response.Respond(ctx, w, r, ApiMeeting, http.StatusOK)
}

// create a potential time for the given meeting
func createMeetingPotentialTime(w http.ResponseWriter, r *http.Request, meetingId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "createMeetingPotentialTime, meeting id %s", meetingId)

	meetingKey, err := datastore.DecodeKey(meetingId)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}
	//start and end hours are 24 based
	var potential struct {
		StartDate string `json:"start_date"`
		EndDate   string `json:"end_date"`
	}
	err = response.Decode(r, &potential)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//convert String date to time Object
	StartDateInt, err := strconv.ParseInt(potential.StartDate, 10, 64)
	if err != nil {
		response.RespondErr(ctx, w, r, errors.New("invalid time"), http.StatusBadRequest)
	}
	StartDate := time.Unix(StartDateInt, 0)
	log.Debugf(ctx, "handleCreateMeeting, StartDate : ", StartDate)

	EndDateInt, err := strconv.ParseInt(potential.EndDate, 10, 64)
	if err != nil {
		response.RespondErr(ctx, w, r, errors.New("invalid time"), http.StatusBadRequest)
	}
	EndDate := time.Unix(EndDateInt, 0)
	log.Debugf(ctx, "handleCreateMeeting, EndDate : ", EndDate)

	potentialTime := model.Constructor(StartDate, EndDate)

	err = potentialTime.Create(ctx, meetingKey)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	response.Respond(ctx, w, r, potentialTime, http.StatusOK)
}

//get all potential times for the given meeting
func getPotentialsTimeForAMeeting(w http.ResponseWriter, r *http.Request, meetingId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "getPotentialsTimeForAMeeting, meetingId %s", meetingId)

	meetingKey, err := datastore.DecodeKey(meetingId)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	meetings, err := model.GetMeetingPotentialTimes(ctx, meetingKey)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	response.Respond(ctx, w, r, meetings, http.StatusOK)
}

func setTimeForMeeting(w http.ResponseWriter, r *http.Request, meetingId string, potentialId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "setPotentialTimeForMeeting, meetingId %s", meetingId)

	meetingKey, err := datastore.DecodeKey(meetingId)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	meetingTimeKey, err := datastore.DecodeKey(potentialId)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//set potential time to meeting
	meeting, err := model.GetMeeting(ctx, meetingKey)
	meeting.SetMeetingTime(ctx, meetingTimeKey)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//get API meeting
	meetingApi, err := meeting.ConvertToAPIMeeting(ctx)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}
	response.Respond(ctx, w, r, meetingApi, http.StatusOK)

}

func setCoachForMeeting(w http.ResponseWriter, r *http.Request, meetingId string, coachId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "setCoachForMeeting, meetingId %s, coach id : %s", meetingId, coachId)

	meetingKey, err := datastore.DecodeKey(meetingId)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	coachKey, err := datastore.DecodeKey(coachId)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	// get meetingCoachee
	meetingCoachee, err := model.GetMeeting(ctx, meetingKey)
	//associate a MeetingCoach with meetingCoachee
	model.Associate(ctx, coachKey, meetingCoachee)

	//get API meeting
	meetingApi, err := meetingCoachee.ConvertToAPIMeeting(ctx)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}
	response.Respond(ctx, w, r, meetingApi, http.StatusOK)
}

func deletePotentialDate(w http.ResponseWriter, r *http.Request, meetinTimeId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "deletePotentialDate, meetinTimeId %s", meetinTimeId)

	meetingTimeKey, err := datastore.DecodeKey(meetinTimeId)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//find associated meeting
	meetingKey := meetingTimeKey.Parent()

	//remove potential from meeting
	if meetingKey != nil {
		log.Debugf(ctx, "deletePotentialDate, potential has a parent")

		meeting, err := model.GetMeeting(ctx, meetingKey)
		if err != nil {
			response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
			return
		}

		if meeting.AgreedTime.String() == meetingTimeKey.String() {
			log.Debugf(ctx, "deletePotentialDate, remove agreed time")
			meeting.AgreedTime = nil
			err = meeting.Update(ctx)
			if err != nil {
				response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
				return
			}
		}
	}

	//delete potential
	model.DeleteMeetingTime(ctx, meetingTimeKey)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	response.Respond(ctx, w, r, nil, http.StatusOK)
}

func handleDeleteMeetingReview(w http.ResponseWriter, r *http.Request, reviewId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "deleteMeetingReview, reviewId %s", reviewId)

	potentialDateKey, err := datastore.DecodeKey(reviewId)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	model.DeleteMeetingReview(ctx, potentialDateKey)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	response.Respond(ctx, w, r, nil, http.StatusOK)
}


//func handleCoachCancelMeeting(w http.ResponseWriter, r *http.Request, meetingId string) {
//	ctx := appengine.NewContext(r)
//	log.Debugf(ctx, "handleCancelMeeting, meetingId %s", meetingId)
//
//	meetingKey, err := datastore.DecodeKey(meetingId)
//	if err != nil {
//		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
//		return
//	}
//
//	meeting, err := GetMeeting(ctx, meetingKey)
//	if err != nil {
//		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
//		return
//	}
//
//	//remove MeetingTime(s) set by coach
//	clearMeetingTimeForCoach(ctx, meetingKey, meeting.CoachKey)
//
//	//remove Coach from Coachee
//	err = meeting.removeMeetingCoach(ctx)
//	if err != nil {
//		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
//		return
//	}
//	//remove agreed MeetingTime
//	err = meeting.clearMeetingTime(ctx)
//}

func handleCoacheeCancelMeeting(w http.ResponseWriter, r *http.Request, meetingId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handleCoacheeCancelMeeting, meetingId %s", meetingId)

	meetingKey, err := datastore.DecodeKey(meetingId)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//remove all meetingTimes for this meeting
	err = model.ClearAllMeetingTimesForAMeeting(ctx, meetingKey)
	if err != nil {
		return
	}

	//remove reviews
	err = model.DeleteAllReviewsForMeeting(ctx, meetingKey)
	if err != nil {
		return
	}

	//delete meeting in a transaction to be immediately reflected
	err = datastore.RunInTransaction(ctx, func(ctx context.Context) error {
		log.Debugf(ctx, "handleCoacheeCancelMeeting, RunInTransaction")

		//load meetingCoachee
		meetingCoachee, err := model.GetMeeting(ctx, meetingKey)
		if err != nil {
			return err
		}

		//remove meetingCoachee
		meetingCoachee.Delete(ctx)
		if err != nil {
			return err
		}

		//load meetingCoach if any
		if meetingCoachee.MeetingCoachKey != nil {
			meetingCoach, err := model.GetMeetingCoach(ctx, meetingCoachee.MeetingCoachKey)
			if err != nil {
				return err
			}

			err = meetingCoach.Delete(ctx)
			if err != nil {
				return err
			}
		}

		log.Debugf(ctx, "handleCoacheeCancelMeeting, RunInTransaction DONE")

		return nil
	}, &datastore.TransactionOptions{XG: true})
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	//get coachee for this meeting
	coachee, err := model.GetCoachee(ctx, meetingKey.Parent())
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}
	//increase available sessions count
	coachee.IncreaseAvailableSessionsCount(ctx)

	response.Respond(ctx, w, r, nil, http.StatusOK)
}

func updateMeetingPotentialTime(w http.ResponseWriter, r *http.Request, potentialId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "updateMeetingPontentialTime, potentialId %s", potentialId)

	potentialDateKey, err := datastore.DecodeKey(potentialId)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//load potentialDate
	meetingTime, err := model.GetMeetingTime(ctx, potentialDateKey)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//start and end hours are 24 based
	var potential struct {
		StartDate string `json:"start_date"`
		EndDate   string `json:"end_date"`
	}
	err = response.Decode(r, &potential)
	if err != nil {
		response.RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//convert String date to time Object
	StartDateInt, err := strconv.ParseInt(potential.StartDate, 10, 64)
	if err != nil {
		response.RespondErr(ctx, w, r, errors.New("invalid time"), http.StatusBadRequest)
	}
	StartDate := time.Unix(StartDateInt, 0)
	log.Debugf(ctx, "handleCreateMeeting, StartDate : ", StartDate)
	meetingTime.StartDate = StartDate

	EndDateInt, err := strconv.ParseInt(potential.EndDate, 10, 64)
	if err != nil {
		response.RespondErr(ctx, w, r, errors.New("invalid time"), http.StatusBadRequest)
	}
	EndDate := time.Unix(EndDateInt, 0)
	log.Debugf(ctx, "handleCreateMeeting, EndDate : ", EndDate)
	meetingTime.EndDate = EndDate

	//update with new values
	meetingTime.UpdateMeetingPotentialTime(ctx)

	//return new meetingTime
	response.Respond(ctx, w, r, meetingTime, http.StatusOK)
}