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
import { Meeting } from "../model/Meeting";
import { AuthService } from "./auth.service";
import { URLSearchParams } from "@angular/http";
import { MeetingDate } from "../model/MeetingDate";
import { MEETING_REVIEW_TYPE_SESSION_CONTEXT, MEETING_REVIEW_TYPE_SESSION_GOAL, MEETING_REVIEW_TYPE_SESSION_RATE, MEETING_REVIEW_TYPE_SESSION_RESULT, MEETING_REVIEW_TYPE_SESSION_UTILITY } from "../model/MeetingReview";
var MeetingsService = (function () {
    function MeetingsService(apiService) {
        this.apiService = apiService;
    }
    MeetingsService.prototype.getAllMeetingsForCoacheeId = function (coacheeId, isAdmin) {
        var param = [coacheeId];
        return this.apiService.get(AuthService.GET_MEETINGS_FOR_COACHEE_ID, param, isAdmin).map(function (response) {
            var json = response.json();
            console.log("getAllMeetingsForCoacheeId, response json : ", json);
            var res = response.json();
            var meetings = new Array();
            for (var _i = 0, res_1 = res; _i < res_1.length; _i++) {
                var meeting = res_1[_i];
                meetings.push(Meeting.parseFromBE(meeting));
            }
            return meetings;
        });
    };
    MeetingsService.prototype.getAllMeetingsForCoachId = function (coachId, isAdmin) {
        var param = [coachId];
        return this.apiService.get(AuthService.GET_MEETINGS_FOR_COACH_ID, param, isAdmin)
            .map(function (response) {
            console.log("getAllMeetingsForCoachId, response : ", response);
            var res = response.json();
            var meetings = new Array();
            for (var _i = 0, res_2 = res; _i < res_2.length; _i++) {
                var meeting = res_2[_i];
                if (meeting != null) {
                    meetings.push(Meeting.parseFromBE(meeting));
                }
            }
            return meetings;
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
            var meeting = Meeting.parseFromBE(response.json());
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
            var meeting = Meeting.parseFromBE(response.json());
            console.log("closeMeeting, response meeting : ", meeting);
            return meeting;
        });
    };
    /**
     * Add this date as a Potential Date for the given meeting
     * @param meetingId
     * @returns {Observable<R>}
     */
    MeetingsService.prototype.addPotentialDateToMeeting = function (meetingId, date) {
        console.log("addPotentialDateToMeeting");
        // convert milliSec to sec ...
        var secDate = {};
        secDate.start_date = date.start_date / 1000;
        secDate.end_date = date.end_date / 1000;
        var body = JSON.stringify(secDate);
        console.log("addPotentialDateToMeeting, body %s", body);
        var param = [meetingId];
        return this.apiService.post(AuthService.POST_MEETING_POTENTIAL_DATE, param, body)
            .map(function (response) {
            var meetingDate = MeetingDate.parseFromBE(response.json());
            console.log("addPotentialDateToMeeting, response meetingDate : ", meetingDate);
            return meetingDate;
        });
    };
    /**
     * Replace any PotentialDate with those dates for the given meeting
     * @param meetingId
     * @returns {Observable<R>} todo return an array
     */
    MeetingsService.prototype.addPotentialDatesToMeeting = function (meetingId, dates) {
        console.log("addPotentialDatesToMeeting");
        // convert milliSec to sec ...
        var datesInSeconds = new Array();
        for (var _i = 0, dates_1 = dates; _i < dates_1.length; _i++) {
            var date = dates_1[_i];
            var secDate = {};
            secDate.start_date = date.start_date / 1000;
            secDate.end_date = date.end_date / 1000;
            datesInSeconds.push(secDate);
        }
        var jsonBody = {};
        jsonBody.dates = datesInSeconds;
        var body = JSON.stringify(jsonBody);
        console.log("addPotentialDatesToMeeting, body %s", body);
        var param = [meetingId];
        return this.apiService.put(AuthService.PUT_MEETING_POTENTIALS_DATE, param, body).map(function (response) {
            var meetingDate = MeetingDate.parseFromBE(response.json());
            console.log("getCoachForId, response meetingDate : ", meetingDate);
            return meetingDate;
        });
    };
    /**
     * Fetch all potential dates for the given meeting
     * Backend returns dates in Unix time in seconds but but MeetingDate deals with timestamp.
     * @param meetingId
     * @returns {Observable<R>}
     */
    MeetingsService.prototype.getMeetingPotentialTimes = function (meetingId, isAdmin) {
        console.log("getMeetingPotentialTimes, meetingId : ", meetingId);
        var param = [meetingId];
        return this.apiService.get(AuthService.GET_MEETING_POTENTIAL_DATES, param, isAdmin).map(function (response) {
            var dates = response.json();
            console.log("getMeetingPotentialTimes, response json : ", dates);
            var datesMilli = new Array();
            for (var _i = 0, dates_2 = dates; _i < dates_2.length; _i++) {
                var date = dates_2[_i];
                var dateMilli = MeetingDate.parseFromBE(date);
                datesMilli.push(dateMilli);
            }
            return datesMilli;
        });
    };
    //get all MeetingReview for context == SESSION_CONTEXT
    MeetingsService.prototype.getMeetingContext = function (meetingId, isAdmin) {
        console.log("getMeetingContext");
        var searchParams = new URLSearchParams();
        searchParams.set('type', MEETING_REVIEW_TYPE_SESSION_CONTEXT);
        var param = [meetingId];
        return this.apiService.getWithSearchParams(AuthService.GET_MEETING_REVIEWS, param, searchParams, isAdmin).map(function (response) {
            var json = response.json();
            console.log("getMeetingContext, response json : ", json);
            return json;
        });
    };
    //get all MeetingReview for context == SESSION_GOAL
    MeetingsService.prototype.getMeetingGoal = function (meetingId, isAdmin) {
        console.log("getMeetingGoal");
        var searchParams = new URLSearchParams();
        searchParams.set('type', MEETING_REVIEW_TYPE_SESSION_GOAL);
        var param = [meetingId];
        return this.apiService.getWithSearchParams(AuthService.GET_MEETING_REVIEWS, param, searchParams, isAdmin).map(function (response) {
            var json = response.json();
            console.log("getMeetingGoal, response json : ", json);
            return json;
        });
    };
    //get all MeetingReview for context == MEETING_REVIEW_TYPE_SESSION_RESULT
    MeetingsService.prototype.getSessionReviewResult = function (meetingId, isAdmin) {
        console.log("getSessionReviewResult");
        var searchParams = new URLSearchParams();
        searchParams.set('type', MEETING_REVIEW_TYPE_SESSION_RESULT);
        var param = [meetingId];
        return this.apiService.getWithSearchParams(AuthService.GET_MEETING_REVIEWS, param, searchParams, isAdmin).map(function (response) {
            var json = response.json();
            console.log("getSessionReviewResult, response json : ", json);
            return json;
        });
    };
    //get all MeetingReview for context == MEETING_REVIEW_TYPE_SESSION_UTILITY
    MeetingsService.prototype.getSessionReviewUtility = function (meetingId, isAdmin) {
        console.log("getSessionReviewUtility");
        var searchParams = new URLSearchParams();
        searchParams.set('type', MEETING_REVIEW_TYPE_SESSION_UTILITY);
        var param = [meetingId];
        return this.apiService.getWithSearchParams(AuthService.GET_MEETING_REVIEWS, param, searchParams, isAdmin).map(function (response) {
            var json = response.json();
            console.log("getSessionReviewUtility, response json : ", json);
            return json;
        });
    };
    //get all MeetingReview for context == MEETING_REVIEW_TYPE_SESSION_RATE
    MeetingsService.prototype.getSessionReviewRate = function (meetingId, isAdmin) {
        console.log("getSessionReviewRate");
        var searchParams = new URLSearchParams();
        searchParams.set('type', MEETING_REVIEW_TYPE_SESSION_RATE);
        var param = [meetingId];
        return this.apiService.getWithSearchParams(AuthService.GET_MEETING_REVIEWS, param, searchParams, isAdmin).map(function (response) {
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
    MeetingsService.prototype.setFinalDateToMeeting = function (meetingId, potentialDateId) {
        console.log("setFinalDateToMeeting, meetingId %s, potentialId %s", meetingId, potentialDateId);
        var param = [meetingId, potentialDateId];
        return this.apiService.put(AuthService.PUT_FINAL_DATE_TO_MEETING, param, null).map(function (response) {
            var meeting = response.json();
            console.log("setFinalDateToMeeting, response json : ", meeting);
            return meeting;
        });
    };
    /**
     * Fetch all meetings where no coach is associated
     * @returns {Observable<R>}
     */
    MeetingsService.prototype.getAvailableMeetings = function () {
        console.log("getAvailableMeetings");
        return this.apiService.get(AuthService.GET_AVAILABLE_MEETINGS, null).map(function (response) {
            var res = response.json();
            var meetings = new Array();
            for (var _i = 0, res_3 = res; _i < res_3.length; _i++) {
                var meeting = res_3[_i];
                meetings.push(Meeting.parseFromBE(meeting));
            }
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
            var meeting = Meeting.parseFromBE(response.json());
            return meeting;
        });
    };
    MeetingsService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [AuthService])
    ], MeetingsService);
    return MeetingsService;
}());
export { MeetingsService };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/service/meetings.service.js.map