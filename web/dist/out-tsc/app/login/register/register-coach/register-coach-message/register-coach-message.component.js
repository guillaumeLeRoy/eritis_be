var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie";
var RegisterCoachMessageComponent = (function () {
    function RegisterCoachMessageComponent(router, cookieService) {
        this.router = router;
        this.cookieService = cookieService;
    }
    RegisterCoachMessageComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
        if (!this.isRegistered()) {
            this.router.navigate(['register_coach/step2']);
        }
    };
    RegisterCoachMessageComponent.prototype.goToWelcomePage = function () {
        // Clean cookies
        this.cookieService.remove('COACH_REGISTER_CONDITIONS_ACCEPTED');
        this.cookieService.remove('COACH_REGISTER_FORM_SENT');
        this.router.navigate(['/welcome']);
    };
    RegisterCoachMessageComponent.prototype.isRegistered = function () {
        var cookie = this.cookieService.get('COACH_REGISTER_FORM_SENT');
        console.log('Coach register form sent, ', cookie);
        if (cookie !== null && cookie !== undefined) {
            return true;
        }
    };
    return RegisterCoachMessageComponent;
}());
RegisterCoachMessageComponent = __decorate([
    Component({
        selector: 'rb-register-coach-message',
        templateUrl: './register-coach-message.component.html',
        styleUrls: ['./register-coach-message.component.scss']
    }),
    __metadata("design:paramtypes", [Router, CookieService])
], RegisterCoachMessageComponent);
export { RegisterCoachMessageComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/login/register/register-coach/register-coach-message/register-coach-message.component.js.map