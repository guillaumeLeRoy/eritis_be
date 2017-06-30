var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { URLSearchParams } from "@angular/http";
import { MEETING_REVIEW_TYPE_SESSION_CONTEXT, MEETING_REVIEW_TYPE_SESSION_GOAL, MEETING_REVIEW_TYPE_SESSION_RATE, MEETING_REVIEW_TYPE_SESSION_RESULT, MEETING_REVIEW_TYPE_SESSION_UTILITY } from "../model/MeetingReview";
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
     * Close the given meeting with a comment
     * Only a Coach can close a meeting.
     * @param meetingId
     * @param comment
     * @returns {Observable<R>}
     */
    MeetingsService.prototype.closeMeeting = function (meetingId, result, utility) {
        console.log("closeMeeting, meetingId %s, result : %s, utility : %s", meetingId, result, utility);
        var body = {
            result: result,
            utility: utility,
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
    //get all MeetingReview for context == MEETING_REVIEW_TYPE_SESSION_RESULT
    MeetingsService.prototype.getSessionReviewResult = function (meetingId) {
        console.log("getSessionReviewResult");
        var searchParams = new URLSearchParams();
        searchParams.set('type', MEETING_REVIEW_TYPE_SESSION_RESULT);
        var param = [meetingId];
        return this.apiService.getWithSearchParams(AuthService.GET_MEETING_REVIEWS, param, searchParams).map(function (response) {
            var json = response.json();
            console.log("getSessionReviewResult, response json : ", json);
            return json;
        });
    };
    //get all MeetingReview for context == MEETING_REVIEW_TYPE_SESSION_UTILITY
    MeetingsService.prototype.getSessionReviewUtility = function (meetingId) {
        console.log("getSessionReviewUtility");
        var searchParams = new URLSearchParams();
        searchParams.set('type', MEETING_REVIEW_TYPE_SESSION_UTILITY);
        var param = [meetingId];
        return this.apiService.getWithSearchParams(AuthService.GET_MEETING_REVIEWS, param, searchParams).map(function (response) {
            var json = response.json();
            console.log("getSessionReviewUtility, response json : ", json);
            return json;
        });
    };
    //get all MeetingReview for context == MEETING_REVIEW_TYPE_SESSION_RATE
    MeetingsService.prototype.getSessionReviewRate = function (meetingId) {
        console.log("getSessionReviewRate");
        var searchParams = new URLSearchParams();
        searchParams.set('type', MEETING_REVIEW_TYPE_SESSION_RATE);
        var param = [meetingId];
        return this.apiService.getWithSearchParams(AuthService.GET_MEETING_REVIEWS, param, searchParams).map(function (response) {
            var json = response.json();
            console.log("getSessionReviewRate, response json : ", json);
            return json;
        });
    };
    //add review for type SESSION_CONTEXT
    MeetingsService.prototype.addAContextForMeeting = function (meetingId, context) {
        console.log("addAContextToMeeting, meetingId %s, comment : %s", meetingId, context);
        var body = {
            value: context,
            type: MEETING_REVIEW_TYPE_SESSION_CONTEXT,
        };
        var param = [meetingId];
        return this.apiService.put(AuthService.PUT_MEETING_REVIEW, param, body).map(function (response) {
            var json = response.json();
            console.log("addAMeetingReview, response json : ", json);
            return json;
        });
    };
    //add review for type MEETING_REVIEW_TYPE_SESSION_GOAL
    MeetingsService.prototype.addAGoalToMeeting = function (meetingId, goal) {
        console.log("addAContextToMeeting, meetingId %s, comment : %s", meetingId, goal);
        var body = {
            value: goal,
            type: MEETING_REVIEW_TYPE_SESSION_GOAL,
        };
        var param = [meetingId];
        return this.apiService.put(AuthService.PUT_MEETING_REVIEW, param, body).map(function (response) {
            var json = response.json();
            console.log("addAMeetingReview, response json : ", json);
            return json;
        });
    };
    /**
     * Add a rate for this meeting
     * @returns {Observable<R>}
     */
    MeetingsService.prototype.addSessionRateToMeeting = function (meetingId, rate) {
        console.log("addSessionRateToMeeting, meetingId %s, rate : %s", meetingId, rate);
        var body = {
            type: MEETING_REVIEW_TYPE_SESSION_RATE,
            value: rate,
        };
        var param = [meetingId];
        return this.apiService.put(AuthService.PUT_MEETING_REVIEW, param, body).map(function (response) {
            var json = response.json();
            console.log("addSessionRateToMeeting, response json : ", json);
            return json;
        });
    };
    /**
     * Fetch all meetings where no coach is associated
     * @returns {Observable<R>}
     */
    MeetingsService.prototype.getAvailableMeetings = function () {
        console.log("getAvailableMeetings");
        return this.apiService.get(AuthService.GET_AVAILABLE_MEETINGS, null).map(function (response) {
            var meetings = response.json();
            console.log("getAvailableMeetings");
            return meetings;
        });
    };
    /**
     * Associated this coach with this meeting
     * @returns {Observable<R>}
     */
    MeetingsService.prototype.associateCoachToMeeting = function (meetingId, coachId) {
        console.log("associateCoachToMeeting");
        var param = [meetingId, coachId];
        return this.apiService.put(AuthService.PUT_COACH_TO_MEETING, param, null).map(function (response) {
            var meeting = response.json();
            console.log("associateCoachToMeeting");
            return meeting;
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