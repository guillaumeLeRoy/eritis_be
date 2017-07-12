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
import { AuthService } from "./auth.service";
var AdminAPIService = (function () {
    function AdminAPIService(httpService) {
        this.httpService = httpService;
        console.log("ctr done");
    }
    AdminAPIService.prototype.createPotentialCoach = function (email) {
        var body = {
            "email": email,
        };
        return this.post(AuthService.POST_POTENTIAL_COACH, null, body).map(function (res) {
            var potentialCoach = res.json();
            return potentialCoach;
        });
    };
    AdminAPIService.prototype.createPotentialRh = function (body) {
        return this.post(AuthService.POST_POTENTIAL_RH, null, body).map(function (res) {
            var potentialRh = res.json();
            return potentialRh;
        });
    };
    AdminAPIService.prototype.getAdmin = function () {
        return this.get(AuthService.GET_ADMIN, null).map(function (res) {
            var admin = res.json();
            return admin;
        });
    };
    AdminAPIService.prototype.getCoachs = function () {
        return this.get(AuthService.ADMIN_GET_COACHS, null).map(function (res) {
            var coachs = res.json();
            return coachs;
        });
    };
    AdminAPIService.prototype.getCoach = function (id) {
        var params = [id];
        return this.get(AuthService.ADMIN_GET_COACH, params).map(function (res) {
            var coach = res.json();
            return coach;
        });
    };
    AdminAPIService.prototype.getCoachees = function () {
        return this.get(AuthService.ADMIN_GET_COACHEES, null).map(function (res) {
            var Coachees = res.json();
            return Coachees;
        });
    };
    AdminAPIService.prototype.getCoachee = function (id) {
        var params = [id];
        return this.get(AuthService.ADMIN_GET_COACHEE, params).map(function (res) {
            var coachee = res.json();
            return coachee;
        });
    };
    AdminAPIService.prototype.getRhs = function () {
        return this.get(AuthService.ADMIN_GET_RHS, null).map(function (res) {
            var HRs = res.json();
            return HRs;
        });
    };
    AdminAPIService.prototype.getRh = function (id) {
        var params = [id];
        return this.get(AuthService.ADMIN_GET_RH, params).map(function (res) {
            var rh = res.json();
            return rh;
        });
    };
    AdminAPIService.prototype.getPossibleCoachs = function () {
        return this.get(AuthService.ADMIN_GET_POSSIBLE_COACHS, null).map(function (res) {
            var coachs = res.json();
            return coachs;
        });
    };
    AdminAPIService.prototype.getPossibleCoach = function (id) {
        var params = [id];
        return this.get(AuthService.ADMIN_GET_POSSIBLE_COACH, params).map(function (res) {
            var possibleCoach = res.json();
            return possibleCoach;
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
    return AdminAPIService;
}());
AdminAPIService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Http])
], AdminAPIService);
export { AdminAPIService };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/service/adminAPI.service.js.map