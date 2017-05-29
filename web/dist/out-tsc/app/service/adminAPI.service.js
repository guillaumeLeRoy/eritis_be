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
import { Http } from "@angular/http";
import { environment } from "../../environments/environment";
import { Coach } from "../model/Coach";
import { Coachee } from "../model/coachee";
import { AuthService } from "./auth.service";
var AdminAPIService = (function () {
    function AdminAPIService(httpService) {
        this.httpService = httpService;
        console.log("ctr done");
    }
    AdminAPIService.prototype.getCoachs = function () {
        return this.get(AuthService.GET_COACHS, null).map(function (res) {
            var coachs = res.json();
            return coachs;
        });
    };
    AdminAPIService.prototype.getCoachees = function () {
        return this.get(AuthService.GET_COACHEES, null).map(function (res) {
            var Coachees = res.json();
            return Coachees;
        });
    };
    /**
     *
     * @param coacheeId
     * @param coachId
     * @returns {Observable<Coachee>}
     */
    AdminAPIService.prototype.updateCoacheeSelectedCoach = function (coacheeId, coachId) {
        var _this = this;
        console.log("updateCoacheeSelectedCoach, coacheeId", coacheeId);
        console.log("updateCoacheeSelectedCoach, coachId", coachId);
        var params = [coacheeId, coachId];
        return this.put(AuthService.UPDATE_COACHEE_SELECTED_COACH, params, null).map(function (response) {
            //convert to coachee
            return _this.parseCoachee(response.json());
        });
    };
    AdminAPIService.prototype.post = function (path, params, body) {
        return this.httpService.post(this.generatePath(path, params), body);
    };
    AdminAPIService.prototype.put = function (path, params, body) {
        return this.httpService.put(this.generatePath(path, params), body);
    };
    AdminAPIService.prototype.get = function (path, params) {
        return this.getWithSearchParams(path, params, null);
    };
    AdminAPIService.prototype.getWithSearchParams = function (path, params, searchParams) {
        return this.httpService.get(this.generatePath(path, params), { search: searchParams });
    };
    AdminAPIService.prototype.generatePath = function (path, params) {
        // console.log("generatePath, path : ", path);
        // console.log("generatePath, params : ", params);
        var completedPath = "";
        var segs = path.split("/");
        var paramIndex = 0;
        for (var _i = 0, segs_1 = segs; _i < segs_1.length; _i++) {
            var seg = segs_1[_i];
            if (seg == "" || seg == null) {
                continue;
            }
            // console.log("generatePath, seg : ", seg);
            // console.log("generatePath, paramIndex : ", paramIndex);
            completedPath += "/";
            if (seg.charAt(0) == ":") {
                completedPath += params[paramIndex];
                paramIndex++;
            }
            else {
                completedPath += seg;
            }
        }
        //always add a "/" at the end
        completedPath += "/";
        // console.log("generatePath, completedPath : ", completedPath);
        // console.log("generatePath, BACKEND_BASE_URL : ", environment.BACKEND_BASE_URL);
        var finalUrl = environment.BACKEND_BASE_URL + completedPath;
        console.log("generatePath, finalUrl : ", finalUrl);
        return finalUrl;
    };
    /* ----------- PARSER ------------- */
    AdminAPIService.prototype.parseCoach = function (json) {
        var coach = new Coach(json.id);
        coach.email = json.email;
        coach.display_name = json.display_name;
        coach.avatar_url = json.avatar_url;
        coach.start_date = json.start_date;
        coach.description = json.description;
        return coach;
    };
    AdminAPIService.prototype.parseCoachee = function (json) {
        var coachee = new Coachee(json.id);
        coachee.id = json.id;
        coachee.email = json.email;
        coachee.display_name = json.display_name;
        coachee.avatar_url = json.avatar_url;
        coachee.start_date = json.start_date;
        coachee.selectedCoach = json.selectedCoach;
        coachee.contractPlan = json.plan;
        coachee.availableSessionsCount = json.available_sessions_count;
        coachee.updateAvailableSessionCountDate = json.update_sessions_count_date;
        return coachee;
    };
    return AdminAPIService;
}());
AdminAPIService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Http])
], AdminAPIService);
export { AdminAPIService };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/service/adminAPI.service.js.map