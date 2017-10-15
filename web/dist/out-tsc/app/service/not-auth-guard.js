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
import { Router } from "@angular/router";
import { SessionService } from "./session.service";
var NotAuthGuard = (function () {
    function NotAuthGuard(router, sessionService) {
        this.router = router;
        this.sessionService = sessionService;
    }
    NotAuthGuard.prototype.canActivate = function (route, state) {
        var url = state.url;
        return this.checkLogin(url);
    };
    NotAuthGuard.prototype.checkLogin = function (url) {
        // if (this.authService.isAuthenticated()) { return true; }
        if (!this.sessionService.isSessionActive()) {
            return true;
        }
        // Une session est active, on redirige vers le dashboard
        this.router.navigate(['dashboard']);
        return false;
    };
    NotAuthGuard = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [Router, SessionService])
    ], NotAuthGuard);
    return NotAuthGuard;
}());
export { NotAuthGuard };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/service/not-auth-guard.js.map