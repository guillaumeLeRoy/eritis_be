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
var CoachCoacheeService = (function () {
    function CoachCoacheeService(apiService) {
        this.apiService = apiService;
    }
    CoachCoacheeService.prototype.getAllCoachs = function () {
        console.log("getAllCoachs, start request");
        return this.apiService.get(AuthService.GET_COACHS, null).map(function (response) {
            var json = response.json();
            console.log("getAllCoachs, response json : ", json);
            return json;
        });
    };
    CoachCoacheeService.prototype.getCoachForId = function (id) {
        console.log("getCoachForId, id", id);
        var param = [id];
        return this.apiService.get(AuthService.GET_COACH_FOR_ID, param).map(function (response) {
            var json = response.json();
            console.log("getCoachForId, response json : ", json);
            return json;
        });
    };
    CoachCoacheeService.prototype.getCoacheeForId = function (id) {
        console.log("getCoacheeForId, id", id);
        var param = [id];
        return this.apiService.get(AuthService.GET_COACHEE_FOR_ID, param).map(function (response) {
            var json = response.json();
            console.log("getCoacheeForId, response json : ", json);
            return json;
        });
    };
    CoachCoacheeService.prototype.createMeetingWithCoach = function (coachId, coacheeId) {
        console.log("bookAMeeting, coachId %s, coacheeId %s", coachId, coacheeId); //todo check if userId ok
        var body = {
            coachId: coachId,
            coacheeId: coacheeId
        };
        return this.apiService.post(AuthService.POST_MEETING, null, body).map(function (response) {
            var json = response.json();
            console.log("getCoachForId, response json : ", json);
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
    CoachCoacheeService.prototype.addPotentialDateToMeeting = function (meetingId, startDate, endDate) {
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
    CoachCoacheeService.prototype.getMeetingPotentialTimes = function (meetingId) {
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
    CoachCoacheeService.prototype.setPotentialDateToMeeting = function (meetingId, potentialDateId) {
        console.log("setPotentialDateToMeeting, meetingId %s, potentialId %s", meetingId, potentialDateId);
        var param = [meetingId, potentialDateId];
        return this.apiService.put(AuthService.PUT_POTENTIAL_DATE_TO_MEETING, param, null).map(function (response) {
            var meeting = response.json();
            console.log("setPotentialDateToMeeting, response json : ", meeting);
            return meeting;
        });
    };
    CoachCoacheeService.prototype.getMeetingReviews = function (meetingId) {
        console.log("getMeetingReviews");
        var param = [meetingId];
        return this.apiService.get(AuthService.GET_MEETING_REVIEWS, param).map(function (response) {
            var json = response.json();
            console.log("getMeetingReviews, response json : ", json);
            return json;
        });
    };
    CoachCoacheeService.prototype.addAMeetingReview = function (meetingId, comment, rate) {
        //convert rating into Integer
        var rating = +rate;
        console.log("addAMeetingReview, meetingId %s, comment : %s, rating : %s", meetingId, comment, rating);
        var body = {
            comment: comment,
            score: rating,
        };
        var param = [meetingId];
        return this.apiService.post(AuthService.POST_MEETING_REVIEW, param, body).map(function (response) {
            var json = response.json();
            console.log("addAMeetingReview, response json : ", json);
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
    CoachCoacheeService.prototype.closeMeeting = function (meetingId, comment, rate) {
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
    return CoachCoacheeService;
}());
CoachCoacheeService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [AuthService])
], CoachCoacheeService);
export { CoachCoacheeService };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/service/CoachCoacheeService.js.map