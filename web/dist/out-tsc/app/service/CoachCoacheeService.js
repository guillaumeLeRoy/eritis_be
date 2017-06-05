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
    CoachCoacheeService.prototype.getAllCoacheesForRh = function (rhId) {
        console.log("getAllCoacheesForRh, start request");
        var param = [rhId];
        return this.apiService.get(AuthService.GET_COACHEES_FOR_RH, param).map(function (response) {
            var json = response.json();
            console.log("getAllCoacheesForRh, response json : ", json);
            return json;
        });
    };
    CoachCoacheeService.prototype.getAllPotentialCoacheesForRh = function (rhId) {
        console.log("getAllPotentialCoacheesForRh, start request");
        var param = [rhId];
        return this.apiService.get(AuthService.GET_POTENTIAL_COACHEES_FOR_RH, param).map(function (response) {
            var json = response.json();
            console.log("getAllPotentialCoacheesForRh, response json : ", json);
            return json;
        });
    };
    CoachCoacheeService.prototype.getPotentialCoachee = function (token) {
        console.log("getPotentialCoachee, start request");
        var param = [token];
        return this.apiService.getPotentialCoachee(AuthService.GET_POTENTIAL_COACHEE_FOR_TOKEN, param);
    };
    CoachCoacheeService.prototype.getPotentialCoach = function (token) {
        console.log("getPotentialCoach, start request");
        var param = [token];
        return this.apiService.getPotentialCoachee(AuthService.GET_POTENTIAL_COACH_FOR_TOKEN, param);
    };
    CoachCoacheeService.prototype.getPotentialRh = function (token) {
        console.log("getPotentialRh, start request");
        var param = [token];
        return this.apiService.getPotentialCoachee(AuthService.GET_POTENTIAL_RH_FOR_TOKEN, param);
    };
    CoachCoacheeService.prototype.getUsageRate = function (rhId) {
        console.log("getUsageRate, start request");
        var param = [rhId];
        return this.apiService.get(AuthService.GET_USAGE_RATE_FOR_RH, param).map(function (response) {
            var json = response.json();
            console.log("getUsageRate, response json : ", json);
            return json;
        });
    };
    CoachCoacheeService.prototype.postPotentialCoachee = function (body) {
        console.log("postPotentialCoachee, start request");
        return this.apiService.post(AuthService.POST_POTENTIAL_COACHEE, null, body).map(function (response) {
            var json = response.json();
            console.log("postPotentialCoachee, response json : ", json);
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