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
		// update review ?

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

		//set meeting hour
		contains = strings.Contains(r.URL.Path, "potential")
		if contains {
			params := PathParams(ctx, r, "/api/meeting/:meetingId/potential/:potId")
			meetingId, ok := params[":meetingId"]
			potId, ok := params[":potId"]
			if ok {
				setPotentialTimeForMeeting(w, r, meetingId, potId)
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


		//get all reviews for a meeting
		contains = strings.Contains(r.URL.Path, "/api/meeting/")
		if contains {
			params := PathParams(ctx, r, "/api/meeting/:meetingId/reviews")
			//verify url contains meeting
			if _, ok := params["meeting"]; ok {
				//get uid param
				meetingId, ok := params[":meetingId"]
				if ok {
					getReviewsForAMeeting(w, r, meetingId)// GET /api/meeting/:meetingId/reviews
					return
				}
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

	var meeting = &Meeting{}
	meeting.CoacheeKey = coacheeKey
	err = meeting.Create(ctx)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	Respond(ctx, w, r, meeting, http.StatusCreated)
}

func getAllMeetingsForCoach(w http.ResponseWriter, r *http.Request, uid string) {
	ctx := appengine.NewContext(r)
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

/*
Suppose this review is created by a Coachee
*/
func createReviewForAMeeting(w http.ResponseWriter, r *http.Request, meetingId string) {
	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "createReviewForAMeeting, meetingId : ", meetingId)

	key, err := datastore.DecodeKey(meetingId)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	meeting, err := GetMeeting(ctx, key)

	log.Debugf(ctx, "createReviewForAMeeting, get meeting : ", meeting)

	var review struct {
		Comment string `json:"comment"`
		Score   int `json:"score"`
	}
	err = Decode(r, &review)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	meetingRev, err := CreateReview(ctx, meeting, meeting.CoacheeKey, review.Comment, review.Score)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusInternalServerError)
		return
	}

	Respond(ctx, w, r, meetingRev, http.StatusCreated)
}

func getReviewsForAMeeting(w http.ResponseWriter, r *http.Request, meetingId string) {

	ctx := appengine.NewContext(r)
	log.Debugf(ctx, "getReviewsForAMeeting, meetingId : ", meetingId)

	key, err := datastore.DecodeKey(meetingId)
	if err != nil {
		RespondErr(ctx, w, r, err, http.StatusBadRequest)
		return
	}

	meeting, err := GetMeeting(ctx, key)

	log.Debugf(ctx, "getReviewsForAMeeting, get meeting : ", meeting)

	reviews, err := GetReviewsForMeeting(ctx, meeting)
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
		Score   int `json:"score"`
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

		meetingRev, err := CreateReview(ctx, meeting, meeting.CoachKey, review.Comment, review.Score)
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

func setPotentialTimeForMeeting(w http.ResponseWriter, r *http.Request, meetingId string, potentialId string) {
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

