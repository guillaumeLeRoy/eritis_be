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
var AdminAPIService = (function () {
    function AdminAPIService(authService) {
        this.authService = authService;
    }
    AdminAPIService.prototype.createPotentialCoach = function (email) {
        var body = {
            "email": email,
        };
        return this.authService.post(AuthService.POST_POTENTIAL_COACH, null, body, null, true).map(function (res) {
            var potentialCoach = res.json();
            return potentialCoach;
        });
    };
    AdminAPIService.prototype.createPotentialRh = function (body) {
        return this.authService.post(AuthService.POST_POTENTIAL_RH, null, body, null, true).map(function (res) {
            var potentialRh = res.json();
            return potentialRh;
        });
    };
    AdminAPIService.prototype.getAdmin = function () {
        return this.authService.get(AuthService.GET_ADMIN, null, true).map(function (res) {
            var admin = res.json();
            return admin;
        });
    };
    AdminAPIService.prototype.getPossibleCoachs = function () {
        return this.authService.get(AuthService.ADMIN_GET_POSSIBLE_COACHS, null, true).map(function (res) {
            var possibleCoachs = res.json();
            return possibleCoachs;
        });
    };
    AdminAPIService.prototype.getPossibleCoach = function (id) {
        var params = [id];
        return this.authService.get(AuthService.ADMIN_GET_POSSIBLE_COACH, params, true).map(function (res) {
            var possibleCoach = res.json();
            return possibleCoach;
        });
    };
    AdminAPIService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [AuthService])
    ], AdminAPIService);
    return AdminAPIService;
}());
export { AdminAPIService };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/service/adminAPI.service.js.map