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
import { AuthService } from "../service/auth.service";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie";
var WelcomeComponent = (function () {
    function WelcomeComponent(router, authService, formBuilder, cookieService) {
        this.router = router;
        this.authService = authService;
        this.formBuilder = formBuilder;
        this.cookieService = cookieService;
        this.loginActivated = false;
        this.error = false;
    }
    WelcomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        window.scrollTo(0, 0);
        // Clean cookies
        this.cookieService.remove('COACH_REGISTER_CONDITIONS_ACCEPTED');
        this.cookieService.remove('COACH_REGISTER_FORM_SENT');
        this.contactForm = this.formBuilder.group({
            name: ['', Validators.compose([Validators.required])],
            mail: ['', Validators.compose([Validators.required])],
            message: ['', [Validators.required]],
        });
        // this.connectedUser = this.authService.getConnectedUserObservable();
        this.authService.getConnectedUserObservable().subscribe(function (user) {
            console.log('getConnectedUser : ' + user);
            _this.onUserObtained(user);
        });
    };
    WelcomeComponent.prototype.onUserObtained = function (user) {
        console.log('onUserObtained : ' + user);
        if (user != null && this.cookieService.get('ACTIVE_SESSION') !== undefined)
            this.router.navigate(['/meetings']);
    };
    WelcomeComponent.prototype.activateLogin = function () {
        this.loginActivated = true;
    };
    /**
     * Start API request to contact Eritis
     */
    WelcomeComponent.prototype.onContactSubmit = function () {
        var _this = this;
        var body = {
            name: this.contactForm.value.name,
            email: this.contactForm.value.mail,
            message: this.contactForm.value.message
        };
        console.log("onContactSubmit, values : ", this.contactForm);
        console.log("onContactSubmit, values : ", this.contactForm.value);
        this.authService.postNotAuth("v1/contact", null, body).subscribe(function (res) {
            console.log("contact, response json : ", res);
            Materialize.toast('Votre demande de contact a bien été envoyée', 4000);
            _this.contactForm.value.name = "";
            _this.contactForm.value.mail = "";
            _this.contactForm.value.message = "";
        }, function (error) {
            Materialize.toast('Une erreur est survenue', 4000);
        });
    };
    WelcomeComponent.prototype.goToCoachRegister = function () {
        this.router.navigate(['/register_coach/step1']);
    };
    WelcomeComponent = __decorate([
        Component({
            selector: 'rb-welcome',
            templateUrl: './welcome.component.html',
            styleUrls: ['./welcome.component.scss']
        }),
        __metadata("design:paramtypes", [Router, AuthService, FormBuilder, CookieService])
    ], WelcomeComponent);
    return WelcomeComponent;
}());
export { WelcomeComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/welcome/welcome.component.js.map