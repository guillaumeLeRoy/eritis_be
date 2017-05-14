var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { AuthService } from "./auth.service";
import { URLSearchParams } from "@angular/http";
import { MEETING_REVIEW_TYPE_SESSION_CONTEXT, MEETING_REVIEW_TYPE_SESSION_GOAL, MEETING_REVIEW_TYPE_SESSION_NEXT_STEP, MEETING_REVIEW_TYPE_SESSION_VALUE } from "../model/MeetingReview";
var MeetingsService = (function () {
    function MeetingsService(apiService) {
        this.apiService = apiService;
    }
    MeetingsService.prototype.getAllMeetingsForCoacheeId = function (coacheeId) {
        var param = [coacheeId];
        return this.apiService.get(AuthService.GET_MEETINGS_FOR_COACHEE_ID, param).map(function (response) {
            var json = response.json();
            console.log("getAllMeetingsForCoacheeId, response json : ", json);
            return json;
        });
    };
    MeetingsService.prototype.getAllMeetingsForCoachId = function (coachId) {
        var param = [coachId];
        return this.apiService.get(AuthService.GET_MEETINGS_FOR_COACH_ID, param).map(function (response) {
            var json = response.json();
            console.log("getAllMeetingsForCoachId, response json : ", json);
            return json;
        });
    };
    /**
     * Create a meeting for the given Coachee
     * @param coacheeId
     * @returns {Observable<R>}
     */
    MeetingsService.prototype.createMeeting = function (coacheeId) {
        console.log("bookAMeeting coacheeId %s", coacheeId); //todo check if userId ok
        var body = {
            coacheeId: coacheeId
        };
        return this.apiService.post(AuthService.POST_MEETING, null, body).map(function (response) {
            var meeting = response.json();
            console.log("bookAMeeting, response json : ", meeting);
            return meeting;
        });
    };
    /**
     * Delete a meeting
     * @returns {Observable<Response>}
     */
    MeetingsService.prototype.deleteMeeting = function (meetingId) {
        var param = [meetingId];
        return this.apiService.delete(AuthService.DELETE_MEETING, param);
    };
    /**
     * Delete a potential date
     * @param potentialId
     * @returns {Observable<R>}
     */
    MeetingsService.prototype.updatePotentialTime = function (potentialId, startDate, endDate) {
        console.log("updatePotentialTime, potentialId %s", potentialId);
        var body = {
            start_date: startDate.toString(),
            end_date: endDate.toString(),
        };
        var param = [potentialId];
        return this.apiService.put(AuthService.PUT_POTENTIAL_DATE_TO_MEETING, param, body).map(function (response) {
            var json = response.json();
            console.log("updatePotentialTime, response json : ", json);
            return json;
        });
    };
    /**
     * Delete a potential date
     * @param potentialId
     * @returns {Observable<R>}
     */
    MeetingsService.prototype.removePotentialTime = function (potentialId) {
        console.log("removePotentialTime, potentialId %s", potentialId);
        var param = [potentialId];
        return this.apiService.delete(AuthService.DELETE_POTENTIAL_DATE, param).map(function (response) {
            var json = response.json();
            console.log("removePotentialTime, response json : ", json);
            return json;
        });
    };
    /**
     * Close the given meeting with a comment and a rate.
     * Only a Coach can close a meeting.
     * @param meetingId
     * @param comment
     * @param rate
     * @returns {Observable<R>}
     */
    MeetingsService.prototype.closeMeeting = function (meetingId, comment, rate) {
        //convert rating into Integer
        var rating = +rate;
        console.log("closeMeeting, meetingId %s, comment : %s", meetingId, comment);
        var body = {
            comment: comment,
            score: rating
        };
        var param = [meetingId];
        return this.apiService.put(AuthService.CLOSE_MEETING, param, body).map(function (response) {
            var json = response.json();
            console.log("closeMeeting, response json : ", json);
            return json;
        });
    };
    /**
     * Add this date as a Potential Date for the given meeting
     * @param meetingId
     * @param startDate
     * @param endDate
     * @returns {Observable<R>}
     */
    MeetingsService.prototype.addPotentialDateToMeeting = function (meetingId, startDate, endDate) {
        console.log("addPotentialDateToMeeting, meeting id : %s, startDate : %s, endDate : %s", meetingId, startDate, endDate);
        var body = {
            start_date: startDate.toString(),
            end_date: endDate.toString(),
        };
        var param = [meetingId];
        return this.apiService.post(AuthService.POST_MEETING_POTENTIAL_DATE, param, body).map(function (response) {
            var json = response.json();
            console.log("getCoachForId, response json : ", json);
            return json;
        });
    };
    /**
     * Fetch all potential dates for the given meeting
     * @param meetingId
     * @returns {Observable<R>}
     */
    MeetingsService.prototype.getMeetingPotentialTimes = function (meetingId) {
        console.log("getMeetingPotentialTimes, meetingId : ", meetingId);
        var param = [meetingId];
        return this.apiService.get(AuthService.GET_MEETING_POTENTIAL_DATES, param).map(function (response) {
            var dates = response.json();
            console.log("getMeetingPotentialTimes, response json : ", dates);
            return dates;
        });
    };
    /**
     *
     * @param meetingId
     * @param potentialDateId
     * @returns {Observable<R>}
     */
    MeetingsService.prototype.setFinalDateToMeeting = function (meetingId, potentialDateId) {
        console.log("setFinalDateToMeeting, meetingId %s, potentialId %s", meetingId, potentialDateId);
        var param = [meetingId, potentialDateId];
        return this.apiService.put(AuthService.PUT_FINAL_DATE_TO_MEETING, param, null).map(function (response) {
            var meeting = response.json();
            console.log("setFinalDateToMeeting, response json : ", meeting);
            return meeting;
        });
    };
    // getMeetingReviews(meetingId: string): Observable<MeetingReview[]> {
    //   console.log("getMeetingReviews");
    //
    //   let param = [meetingId];
    //   return this.apiService.get(AuthService.GET_MEETING_REVIEWS, param).map((response: Response) => {
    //     let json: MeetingReview[] = response.json();
    //     console.log("getMeetingReviews, response json : ", json);
    //     return json;
    //   });
    // }
    //get all MeetingReview for context == SESSION_CONTEXT
    MeetingsService.prototype.getMeetingContext = function (meetingId) {
        console.log("getMeetingContext");
        var searchParams = new URLSearchParams();
        searchParams.set('type', MEETING_REVIEW_TYPE_SESSION_CONTEXT);
        var param = [meetingId];
        return this.apiService.getWithSearchParams(AuthService.GET_MEETING_REVIEWS, param, searchParams).map(function (response) {
            var json = response.json();
            console.log("getMeetingContext, response json : ", json);
            return json;
        });
    };
    //get all MeetingReview for context == SESSION_GOAL
    MeetingsService.prototype.getMeetingGoal = function (meetingId) {
        console.log("getMeetingGoal");
        var searchParams = new URLSearchParams();
        searchParams.set('type', MEETING_REVIEW_TYPE_SESSION_GOAL);
        var param = [meetingId];
        return this.apiService.getWithSearchParams(AuthService.GET_MEETING_REVIEWS, param, searchParams).map(function (response) {
            var json = response.json();
            console.log("getMeetingGoal, response json : ", json);
            return json;
        });
    };
    //get all MeetingReview for context == SESSION_VALUE
    MeetingsService.prototype.getMeetingValue = function (meetingId) {
        console.log("getMeetingGoal");
        var searchParams = new URLSearchParams();
        searchParams.set('type', MEETING_REVIEW_TYPE_SESSION_VALUE);
        var param = [meetingId];
        return this.apiService.getWithSearchParams(AuthService.GET_MEETING_REVIEWS, param, searchParams).map(function (response) {
            var json = response.json();
            console.log("getMeetingValue, response json : ", json);
            return json;
        });
    };
    //get all MeetingReview for context == SESSION_NEXT_STEP
    MeetingsService.prototype.getMeetingNextStep = function (meetingId) {
        console.log("getMeetingGoal");
        var searchParams = new URLSearchParams();
        searchParams.set('type', MEETING_REVIEW_TYPE_SESSION_NEXT_STEP);
        var param = [meetingId];
        return this.apiService.getWithSearchParams(AuthService.GET_MEETING_REVIEWS, param, searchParams).map(function (response) {
            var json = response.json();
            console.log("getMeetingNextStep, response json : ", json);
            return json;
        });
    };
    //add review for type SESSION_CONTEXT
    MeetingsService.prototype.addAContextForMeeting = function (meetingId, context) {
        console.log("addAContextToMeeting, meetingId %s, comment : %s", meetingId, context);
        var body = {
            comment: context,
            type: MEETING_REVIEW_TYPE_SESSION_CONTEXT,
        };
        var param = [meetingId];
        return this.apiService.post(AuthService.POST_MEETING_REVIEW, param, body).map(function (response) {
            var json = response.json();
            console.log("addAMeetingReview, response json : ", json);
            return json;
        });
    };
    // updateContextForMeeting(reviewId: string, context: string): Observable<MeetingReview> {
    //   console.log("updateContextForMeeting, reviewId %s, comment : %s", reviewId, context);
    //   let body = {
    //     comment: context,
    //   };
    //   let param = [reviewId];
    //   return this.apiService.put(AuthService.PUT_MEETING_REVIEW, param, body).map((response: Response) => {
    //     let json: MeetingReview = response.json();
    //     console.log("updateContextForMeeting, response json : ", json);
    //     return json;
    //   });
    // }
    //add review for type SESSION_GOAL
    MeetingsService.prototype.addAGoalToMeeting = function (meetingId, goal) {
        console.log("addAContextToMeeting, meetingId %s, comment : %s", meetingId, goal);
        var body = {
            comment: goal,
            type: MEETING_REVIEW_TYPE_SESSION_GOAL,
        };
        var param = [meetingId];
        return this.apiService.post(AuthService.POST_MEETING_REVIEW, param, body).map(function (response) {
            var json = response.json();
            console.log("addAMeetingReview, response json : ", json);
            return json;
        });
    };
    // updateGoalForMeeting(reviewId: string, goal: string): Observable<MeetingReview> {
    //   console.log("updateGoalForMeeting, reviewId %s, comment : %s", reviewId, goal);
    //   let body = {
    //     comment: goal,
    //   };
    //   let param = [reviewId];
    //   return this.apiService.put(AuthService.PUT_MEETING_REVIEW, param, body).map((response: Response) => {
    //     let json: MeetingReview = response.json();
    //     console.log("updateGoalForMeeting, response json : ", json);
    //     return json;
    //   });
    // }
    //add review for type SESSION_VALUE
    MeetingsService.prototype.addAMeetingReviewForValue = function (meetingId, comment) {
        console.log("addAMeetingReviewForValue, meetingId %s, comment : %s", meetingId, comment);
        var body = {
            comment: comment,
            type: MEETING_REVIEW_TYPE_SESSION_VALUE,
        };
        var param = [meetingId];
        return this.apiService.post(AuthService.POST_MEETING_REVIEW, param, body).map(function (response) {
            var json = response.json();
            console.log("addAMeetingReview, response json : ", json);
            return json;
        });
    };
    //add review for type SESSION_NEXT_STEP
    MeetingsService.prototype.addAMeetingReviewForNextStep = function (meetingId, comment) {
        console.log("addAMeetingReviewForNextStep, meetingId %s, comment : %s", meetingId, comment);
        var body = {
            comment: comment,
            type: MEETING_REVIEW_TYPE_SESSION_NEXT_STEP
        };
        var param = [meetingId];
        return this.apiService.post(AuthService.POST_MEETING_REVIEW, param, body).map(function (response) {
            var json = response.json();
            console.log("addAMeetingReview, response json : ", json);
            return json;
        });
    };
    return MeetingsService;
}());
MeetingsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [AuthService])
], MeetingsService);
export { MeetingsService };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/service/meetings.service.js.map