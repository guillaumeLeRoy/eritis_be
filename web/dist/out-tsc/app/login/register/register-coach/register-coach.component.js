var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie";
var RegisterCoachComponent = (function () {
    function RegisterCoachComponent(router, cookieService) {
        this.router = router;
        this.cookieService = cookieService;
    }
    RegisterCoachComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
    };
    RegisterCoachComponent.prototype.goToDeontologie = function () {
        this.router.navigate(['/register_coach/code_deontologie']);
    };
    RegisterCoachComponent.prototype.goToForm = function () {
        this.router.navigate(['/register_coach/step2']);
    };
    RegisterCoachComponent.prototype.hasAcceptedConditions = function () {
        var cookie = this.cookieService.get('COACH_REGISTER_CONDITIONS_ACCEPTED');
        console.log('Coach register conditions accepted, ', cookie);
        if (cookie !== null && cookie !== undefined) {
            return true;
        }
    };
    RegisterCoachComponent.prototype.setAcceptedConditions = function () {
        console.log('Coach register accept conditions');
        this.cookieService.put('COACH_REGISTER_CONDITIONS_ACCEPTED', 'true');
    };
    RegisterCoachComponent.prototype.deleteAcceptedConditions = function () {
        console.log('Coach register refuse conditions');
        this.cookieService.remove('COACH_REGISTER_CONDITIONS_ACCEPTED');
    };
    RegisterCoachComponent.prototype.toggleAcceptedConditions = function () {
        if (this.hasAcceptedConditions())
            this.deleteAcceptedConditions();
        else
            this.setAcceptedConditions();
    };
    return RegisterCoachComponent;
}());
RegisterCoachComponent = __decorate([
    Component({
        selector: 'rb-register-coach',
        templateUrl: './register-coach.component.html',
        styleUrls: ['./register-coach.component.scss']
    }),
    __metadata("design:paramtypes", [Router, CookieService])
], RegisterCoachComponent);
export { RegisterCoachComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/login/register/register-coach/register-coach.component.js.map