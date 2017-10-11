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
var SessionService = (function () {
    function SessionService() {
    }
    SessionService.prototype.saveSessionTTL = function () {
        var TTL = new Date();
        TTL.setHours(TTL.getHours() + 1);
        // TTL.setMinutes(TTL.getMinutes() + 2);
        var toSave = JSON.stringify({ 'expires': TTL });
        localStorage.setItem('ACTIVE_SESSION', toSave);
        console.log('saveSessionTTL save : ', toSave);
    };
    SessionService.prototype.isSessionActive = function () {
        var session = localStorage.getItem("ACTIVE_SESSION");
        if (session == undefined) {
            console.log('isSessionActive undefined');
            return false;
        }
        // calculate if session still valid
        console.log('isSessionActive saved : ', session);
        var TTL = new Date(JSON.parse(session).expires);
        var now = new Date();
        console.log('isSessionActive now : ', now);
        var compare = TTL > now;
        console.log('isSessionActive compare : ', compare);
        return compare;
    };
    SessionService.prototype.clearSession = function () {
        localStorage.removeItem("ACTIVE_SESSION");
    };
    SessionService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], SessionService);
    return SessionService;
}());
export { SessionService };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/service/session.service.js.map