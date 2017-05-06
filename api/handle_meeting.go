package api

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
)

func HandleMeeting(w http.ResponseWriter, r *http.Request) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "handle meeting")

	switch r.Method {

	case "POST":

		//create potential meeting time
		if ok := strings.Contains(r.URL.Path, "potential"); ok {
			params := PathParams(ctx, r, "/api/meeting/:uid/potential")
			uid, ok := params[":uid"]
			if ok {
				createMeetingPotentialTime(w, r, uid)// POST /api/meeting/:uid/potential
				return
			}
		}

		/// create new meeting review
		if ok := strings.Contains(r.URL.Path, "review"); ok {
			params := PathParams(ctx, r, "/api/meeting/:uid/review")
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
			params := PathParams(ctx, r, "/api/meeting/:meetingId/coach/:coachId")
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
			params := PathParams(ctx, r, "/api/meeting/potential/:potId")
			potId, ok := params[":potId"]
			if ok {
				updateMeetingPotentialTime(w, r, potId)
				return
			}
		}

		//set meeting hour
		contains = strings.Contains(r.URL.Path, "date")
		if contains {
			params := PathParams(ctx, r, "/api/meeting/:meetingId/date/:potId")
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
			params := PathParams(ctx, r, "/api/meeting/:uid/close")
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
			params := PathParams(ctx, r, "/api/meetings/coachee/:uid")
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
			params := PathParams(ctx, r, "/api/meetings/coach/:uid")
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
			params := PathParams(ctx, r, "/api/meeting/:meetingId/potentials")
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
		//	params := PathParams(ctx, r, "/api/meeting/:meetingId/reviews/:type")
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
			params := PathParams(ctx, r, "/api/meeting/:meetingId/reviews")
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
			params := PathParams(ctx, r, "/api/meeting/potentials/:potId")
			potId, ok := params[":potId"]
			if ok {
				deletePotentialDate(w, r, potId)
				return
			}
		}

		//delete review for a meeting
		contains = strings.Contains(r.URL.Path, "reviews")
		if contains {
			params := PathParams(ctx, r, "/api/meeting/reviews/:reviewId")
			potId, ok := params[":reviewId"]
			if ok {
				handleDeleteMeetingReview(w, r, potId)
				return
			}
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
	err := Decode(r, &newMeeting)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//todo valid meeting ??

	log.Debugf(ctx, "handleCreateMeeting, coacheeId ", newMeeting.CoacheeId)

	coacheeKey, err := datastore.DecodeKey(newMeeting.CoacheeId)
	if err != nil {
		RespondErr(ctx, w, r, errors.New("invalid coachee id"),
			http.StatusBadRequest)
		return
	}
	//verify this user can create a new meeting
	coachee, err := getCoachee(ctx, coacheeKey)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}
	//check
	if coachee.AvailableSessionsCount <= 0 {
		RespondErr(ctx, w, r, errors.New("limit reached"), http.StatusBadRequest)
		return
	}

	//create new meeting
	var meeting = &Meeting{}
	meeting.CoacheeKey = coacheeKey
	err = meeting.Create(ctx)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	//decrease number of available sessions and save
	err = coachee.decreaseAvailableSessionsCount(ctx)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	Respond(ctx, w, r, meeting, http.StatusCreated)
}

func getAllMeetingsForCoach(w http.ResponseWriter, r *http.Request, uid string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "getAllMeetingsForCoach")

	key, err := datastore.DecodeKey(uid)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}
	meetings, err := GetMeetingsForCoach(ctx, key);
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	Respond(ctx, w, r, meetings, http.StatusCreated)

}

func getAllMeetingsForCoachee(w http.ResponseWriter, r *http.Request, uid string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "getAllMeetingsForCoachee")

	key, err := datastore.DecodeKey(uid)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}
	meetings, err := GetMeetingsForCoachee(ctx, key);
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	Respond(ctx, w, r, meetings, http.StatusCreated)
}

/* Add a review for the given meeting. Only one review can exist for a given type.
*/
func createReviewForAMeeting(w http.ResponseWriter, r *http.Request, meetingId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "createReviewForAMeeting, meetingId : ", meetingId)

	meetingKey, err := datastore.DecodeKey(meetingId)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	var review struct {
		Type    string `json:"type"`
		Comment string `json:"comment"`
	}
	err = Decode(r, &review)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//convert
	reviewType, err := convertToReviewType(review.Type)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}


	//check if a review already for this type
	reviews, err := getReviewsForMeetingAndForType(ctx, meetingKey, review.Type)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	var meetingRev *MeetingReview
	if len(reviews) == 0 {
		//create review
		meetingRev, err = createReview(ctx, meetingKey, review.Comment, reviewType)
		if err != nil {
			RespondErr(ctx, w, r, err, http.StatusInternalServerError)
			return
		}
	} else {
		//update review
		//reviews[0] should be safe to access to
		meetingRev, err = reviews[0].updateReview(ctx, reviews[0].Key, review.Comment)
		if err != nil {
			RespondErr(ctx, w, r, err, http.StatusInternalServerError)
			return
		}
	}

	Respond(ctx, w, r, meetingRev, http.StatusCreated)
}

func getAllReviewsForAMeeting(w http.ResponseWriter, r *http.Request, meetingId string, reviewType string) {

	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "getReviewsForAMeeting, meetingId : ", meetingId)

	meetingKey, err := datastore.DecodeKey(meetingId)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	var reviews []*MeetingReview
	if reviewType != "" {
		reviews, err = getReviewsForMeetingAndForType(ctx, meetingKey, reviewType)
	} else {
		reviews, err = getAllReviewsForMeeting(ctx, meetingKey)
	}
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	Respond(ctx, w, r, reviews, http.StatusCreated)
}

/* We suppose the meeting is closed by a Coach */
func closeMeeting(w http.ResponseWriter, r *http.Request, meetingId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "closeMeeting, meetingId : ", meetingId)

	key, err := datastore.DecodeKey(meetingId)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	var review struct {
		Comment string `json:"comment"`
		Type    string `json:"type"`
	}
	err = Decode(r, &review)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	log.Debugf(ctx, "closeMeeting, got review %s : ", review)

	var ApiMeeting *ApiMeeting
	err = datastore.RunInTransaction(ctx, func(ctx context.Context) error {
		var err error
		var meeting *Meeting
		meeting, err = GetMeeting(ctx, key)
		if err != nil {
			return err
		}

		log.Debugf(ctx, "closeMeeting, get meeting", meeting)

		//convert
		reviewType, err := convertToReviewType(review.Type)
		if err != nil {
			return err
		}

		//create review
		meetingRev, err := createReview(ctx, meeting.Key, review.Comment, reviewType)
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
		ApiMeeting, err = meeting.GetAPIMeeting(ctx)
		if err != nil {
			return err
		}

		return nil
	}, &datastore.TransactionOptions{XG: true})
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	Respond(ctx, w, r, ApiMeeting, http.StatusOK)
}

// create a potential time for the given meeting
func createMeetingPotentialTime(w http.ResponseWriter, r *http.Request, meetingId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "createMeetingPotentialTime, meeting id %s", meetingId)

	meetingKey, err := datastore.DecodeKey(meetingId)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}
	var potentialTime = &MeetingTime{}
	//start and end hours are 24 based
	var potential struct {
		StartDate string `json:"start_date"`
		EndDate   string `json:"end_date"`
	}
	err = Decode(r, &potential)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//convert String date to time Object
	StartDateInt, err := strconv.ParseInt(potential.StartDate, 10, 64)
	if err != nil {
		RespondErr(ctx, w, r, errors.New("invalid time"), http.StatusBadRequest)
	}
	StartDate := time.Unix(StartDateInt, 0)
	log.Debugf(ctx, "handleCreateMeeting, StartDate : ", StartDate)
	potentialTime.StartDate = StartDate

	EndDateInt, err := strconv.ParseInt(potential.EndDate, 10, 64)
	if err != nil {
		RespondErr(ctx, w, r, errors.New("invalid time"), http.StatusBadRequest)
	}
	EndDate := time.Unix(EndDateInt, 0)
	log.Debugf(ctx, "handleCreateMeeting, EndDate : ", EndDate)
	potentialTime.EndDate = EndDate

	err = potentialTime.Create(ctx, meetingKey)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	Respond(ctx, w, r, potentialTime, http.StatusOK)
}

//get all potential times for the given meeting
func getPotentialsTimeForAMeeting(w http.ResponseWriter, r *http.Request, meetingId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "getPotentialsTimeForAMeeting, meetingId %s", meetingId)

	meetingKey, err := datastore.DecodeKey(meetingId)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	meetings, err := GetMeetingPotentialTimes(ctx, meetingKey)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	Respond(ctx, w, r, meetings, http.StatusOK)
}

func setTimeForMeeting(w http.ResponseWriter, r *http.Request, meetingId string, potentialId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "setPotentialTimeForMeeting, meetingId %s", meetingId)

	meetingKey, err := datastore.DecodeKey(meetingId)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	meetingTimeKey, err := datastore.DecodeKey(potentialId)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//set potential time to meeting
	meeting, err := GetMeeting(ctx, meetingKey)
	meeting.SetMeetingTime(ctx, meetingTimeKey)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//get API meeting
	meetingApi, err := meeting.GetAPIMeeting(ctx)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}
	Respond(ctx, w, r, meetingApi, http.StatusOK)

}

func setCoachForMeeting(w http.ResponseWriter, r *http.Request, meetingId string, coachId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "setCoachForMeeting, meetingId %s, coach id : %s", meetingId, coachId)

	meetingKey, err := datastore.DecodeKey(meetingId)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	coachKey, err := datastore.DecodeKey(coachId)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//set potential time to meeting
	meeting, err := GetMeeting(ctx, meetingKey)
	meeting.setMeetingCoach(ctx, coachKey)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//get API meeting
	meetingApi, err := meeting.GetAPIMeeting(ctx)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}
	Respond(ctx, w, r, meetingApi, http.StatusOK)
}

func deletePotentialDate(w http.ResponseWriter, r *http.Request, potentialId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "deletePotentialDate, potentialId %s", potentialId)

	potentialDateKey, err := datastore.DecodeKey(potentialId)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	deleteMeetingPotentialTime(ctx, potentialDateKey)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	Respond(ctx, w, r, nil, http.StatusOK)
}

func handleDeleteMeetingReview(w http.ResponseWriter, r *http.Request, reviewId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "deleteMeetingReview, reviewId %s", reviewId)

	potentialDateKey, err := datastore.DecodeKey(reviewId)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	deleteMeetingReview(ctx, potentialDateKey)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	Respond(ctx, w, r, nil, http.StatusOK)
}

func updateMeetingPotentialTime(w http.ResponseWriter, r *http.Request, potentialId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "updateMeetingPontentialTime, potentialId %s", potentialId)

	potentialDateKey, err := datastore.DecodeKey(potentialId)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//load potentialDate
	meetingTime, err := GetMeetingTime(ctx, potentialDateKey)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//start and end hours are 24 based
	var potential struct {
		StartDate string `json:"start_date"`
		EndDate   string `json:"end_date"`
	}
	err = Decode(r, &potential)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	//convert String date to time Object
	StartDateInt, err := strconv.ParseInt(potential.StartDate, 10, 64)
	if err != nil {
		RespondErr(ctx, w, r, errors.New("invalid time"), http.StatusBadRequest)
	}
	StartDate := time.Unix(StartDateInt, 0)
	log.Debugf(ctx, "handleCreateMeeting, StartDate : ", StartDate)
	meetingTime.StartDate = StartDate

	EndDateInt, err := strconv.ParseInt(potential.EndDate, 10, 64)
	if err != nil {
		RespondErr(ctx, w, r, errors.New("invalid time"), http.StatusBadRequest)
	}
	EndDate := time.Unix(EndDateInt, 0)
	log.Debugf(ctx, "handleCreateMeeting, EndDate : ", EndDate)
	meetingTime.EndDate = EndDate

	//update with new values
	meetingTime.updateMeetingPotentialTime(ctx)

	//return new meetingTime
	Respond(ctx, w, r, meetingTime, http.StatusOK)
}