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
    return MeetingsService;
}());
MeetingsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [AuthService])
], MeetingsService);
export { MeetingsService };
//# sourceMappingURL=/Users/guillaume/git/eritis_fe/src/app/service/meetings.service.js.map