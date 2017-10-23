var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
///<reference path="auth.service.ts"/>
import { Injectable } from "@angular/core";
import { Coach } from "../model/Coach";
import { Headers } from "@angular/http";
import { AuthService } from "./auth.service";
import { Coachee } from "../model/Coachee";
import { HR } from "../model/HR";
var CoachCoacheeService = (function () {
    function CoachCoacheeService(apiService) {
        this.apiService = apiService;
    }
    /* Coach endpoints */
    CoachCoacheeService.prototype.getAllCoachs = function (isAdmin) {
        console.log("getAllCoachs, start request");
        return this.apiService.get(AuthService.GET_COACHS, null, isAdmin).map(function (res) {
            var resArray = res.json();
            var coachs = new Array();
            for (var _i = 0, resArray_1 = resArray; _i < resArray_1.length; _i++) {
                var c = resArray_1[_i];
                coachs.push(Coach.parseCoach(c));
            }
            return coachs;
        });
    };
    CoachCoacheeService.prototype.getCoachForId = function (coachId, isAdmin) {
        console.log("getCoachForId, start request");
        var params = [coachId];
        return this.apiService.get(AuthService.GET_COACH_FOR_ID, params, isAdmin).map(function (response) {
            console.log("getCoachForId, got coach", response);
            return Coach.parseCoach(response.json());
        }, function (error) {
            console.log("getCoachForId, error", error);
        });
    };
    CoachCoacheeService.prototype.updateCoachProfilePicture = function (coachId, avatarFile) {
        var params = [coachId];
        var formData = new FormData();
        formData.append('uploadFile', avatarFile, avatarFile.name);
        var headers = new Headers();
        headers.append('Accept', 'application/json');
        return this.apiService.put(AuthService.PUT_COACH_PROFILE_PICT, params, formData, { headers: headers }, true)
            .map(function (res) { return res.json(); });
    };
    /* Coachee endpoints */
    CoachCoacheeService.prototype.getCoachees = function (isAdmin) {
        return this.apiService.get(AuthService.GET_COACHEES, null, isAdmin).map(function (res) {
            var resArray = res.json();
            var coachees = new Array();
            for (var _i = 0, resArray_2 = resArray; _i < resArray_2.length; _i++) {
                var c = resArray_2[_i];
                coachees.push(Coachee.parseCoachee(c));
            }
            return coachees;
        });
    };
    CoachCoacheeService.prototype.getCoacheeForId = function (coacheeId, isAdmin) {
        console.log("getCoacheeForId, start request");
        var params = [coacheeId];
        return this.apiService.get(AuthService.GET_COACHEE_FOR_ID, params, isAdmin).map(function (response) {
            console.log("getCoacheeForId, got coachee", response);
            return Coachee.parseCoachee(response.json());
        }, function (error) {
            console.log("getCoacheeForId, error", error);
        });
    };
    /* HR endpoints */
    CoachCoacheeService.prototype.getRhs = function (isAdmin) {
        return this.apiService.get(AuthService.GET_RHS, null, isAdmin).map(function (res) {
            var resArray = res.json();
            var hrs = new Array();
            for (var _i = 0, resArray_3 = resArray; _i < resArray_3.length; _i++) {
                var c = resArray_3[_i];
                hrs.push(HR.parseRh(c));
            }
            return hrs;
        });
    };
    CoachCoacheeService.prototype.getRhForId = function (rhId, isAdmin) {
        console.log("getRhForId, start request");
        var params = [rhId];
        return this.apiService.get(AuthService.GET_RH_FOR_ID, params, isAdmin).map(function (response) {
            console.log("getRhForId, got rh", response);
            var rh = HR.parseRh(response.json());
            return rh;
        }, function (error) {
            console.log("getRhForId, error", error);
        });
    };
    CoachCoacheeService.prototype.getAllCoacheesForRh = function (rhId, isAdmin) {
        console.log("getAllCoacheesForRh, start request");
        var params = [rhId];
        return this.apiService.get(AuthService.GET_COACHEES_FOR_RH, params, isAdmin).map(function (response) {
            var json = response.json();
            var coachees = new Array;
            for (var _i = 0, json_1 = json; _i < json_1.length; _i++) {
                var jsonCoachee = json_1[_i];
                coachees.push(Coachee.parseCoachee(jsonCoachee));
            }
            console.log("getAllCoacheesForRh, coachees : ", coachees);
            return coachees;
        });
    };
    CoachCoacheeService.prototype.getAllPotentialCoacheesForRh = function (rhId, isAdmin) {
        console.log("getAllPotentialCoacheesForRh, start request");
        var params = [rhId];
        return this.apiService.get(AuthService.GET_POTENTIAL_COACHEES_FOR_RH, params, isAdmin).map(function (response) {
            var json = response.json();
            console.log("getAllPotentialCoacheesForRh, response json : ", json);
            return json;
        });
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
    /**
     * Add a new objective to this coachee.
     * @param coacheeId
     * @param rhId
     * @param objective
     */
    CoachCoacheeService.prototype.addObjectiveToCoachee = function (rhId, coacheeId, objective) {
        var param = [rhId, coacheeId];
        var body = {
            "objective": objective
        };
        return this.apiService.post(AuthService.POST_COACHEE_OBJECTIVE, param, body).map(function (response) {
            var json = response.json();
            console.log("POST coachee new objective, response json : ", json);
            return json;
        });
    };
    /* Potentials endpoints */
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
        return this.apiService.getPotentialRh(AuthService.GET_POTENTIAL_RH_FOR_TOKEN, param);
    };
    CoachCoacheeService.prototype.postPotentialCoachee = function (body) {
        console.log("postPotentialCoachee, start request");
        return this.apiService.post(AuthService.POST_POTENTIAL_COACHEE, null, body).map(function (response) {
            var json = response.json();
            console.log("postPotentialCoachee, response json : ", json);
            return json;
        });
    };
    CoachCoacheeService.prototype.getAllNotificationsForUser = function (user) {
        console.log("getAllNotifications, start request");
        var param = [user.id];
        var path = AuthService.GET_COACHEE_NOTIFICATIONS;
        if (user instanceof Coach) {
            path = AuthService.GET_COACH_NOTIFICATIONS;
        }
        else if (user instanceof HR) {
            path = AuthService.GET_RH_NOTIFICATIONS;
        }
        return this.apiService.get(path, param).map(function (response) {
            var json = response.json();
            console.log("getAllNotifications, response json : ", json);
            return json;
        });
    };
    CoachCoacheeService.prototype.readAllNotificationsForUser = function (user) {
        console.log("readAllNotifications, start request");
        var param = [user.id];
        var path = AuthService.PUT_COACHEE_NOTIFICATIONS_READ;
        if (user instanceof Coach) {
            path = AuthService.PUT_COACH_NOTIFICATIONS_READ;
        }
        else if (user instanceof HR) {
            path = AuthService.PUT_RH_NOTIFICATIONS_READ;
        }
        return this.apiService.put(path, param, null).map(function (response) {
            console.log("readAllNotifications done");
        }, function (error) {
            console.log('readAllNotifications error', error);
        });
    };
    CoachCoacheeService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [AuthService])
    ], CoachCoacheeService);
    return CoachCoacheeService;
}());
export { CoachCoacheeService };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/service/coach_coachee.service.js.map