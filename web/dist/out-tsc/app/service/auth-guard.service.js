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
import { SessionService } from "./session.service";
var AuthGuard = (function () {
    function AuthGuard(authService, sessionService) {
        this.authService = authService;
        this.sessionService = sessionService;
    }
    AuthGuard.prototype.canActivate = function (route, state) {
        var url = state.url;
        return this.checkLogin(url);
    };
    AuthGuard.prototype.canActivateChild = function (route, state) {
        var url = state.url;
        return this.checkLogin(url);
    };
    AuthGuard.prototype.checkLogin = function (url) {
        //if (this.authService.isAuthenticated() && cookie) { return true; }
        if (this.sessionService.isSessionActive()) {
            this.sessionService.saveSessionTTL();
            return true;
        }
        // Pas de session active, on redirige vers welcome
        this.authService.loginOut();
        return false;
    };
    AuthGuard = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [AuthService, SessionService])
    ], AuthGuard);
    return AuthGuard;
}());
export { AuthGuard };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/service/auth-guard.service.js.map