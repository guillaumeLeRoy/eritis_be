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
import { Observable } from "rxjs/Observable";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../service/auth.service";
import { CoachCoacheeService } from "../../service/coach_coachee.service";
import { ActivatedRoute, Router } from "@angular/router";
var SignupRhComponent = (function () {
    function SignupRhComponent(formBuilder, authService, coachCoacheeService, router, route) {
        this.formBuilder = formBuilder;
        this.authService = authService;
        this.coachCoacheeService = coachCoacheeService;
        this.router = router;
        this.route = route;
        this.error = false;
        this.errorMessage = "";
        console.log("constructor");
    }
    SignupRhComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log("ngOnInit");
        // meetingId should be in the router
        this.route.queryParams.subscribe(function (params) {
            var token = params['token'];
            console.log("ngOnInit, param token", token);
            _this.coachCoacheeService.getPotentialRh(token).subscribe(function (coach) {
                console.log("getPotentialRh, data obtained", coach);
                _this.potentialRhObs = Observable.of(coach);
                _this.potentialRh = coach;
            }, function (error) {
                console.log("getPotentialRh, error obtained", error);
            });
        });
        this.signUpForm = this.formBuilder.group({
            password: ['', Validators.compose([
                    Validators.required,
                    Validators.minLength(6)
                ])
            ],
            confirmPassword: ['',
                [Validators.required,
                    this.isEqualPassword.bind(this)]
            ],
        });
    };
    SignupRhComponent.prototype.onSignUpSubmitted = function () {
        var _this = this;
        console.log("onSignUp");
        //reset errors
        this.error = false;
        this.errorMessage = '';
        console.log("onSignUp, rh");
        var user = this.signUpForm.value;
        user.email = this.potentialRh.email;
        this.authService.signUpRh(user).subscribe(function (data) {
            console.log("onSignUp, data obtained", data);
            /*L'utilisateur est TOUJOURS redirigé vers ses meetings*/
            _this.router.navigate(['/meetings']);
        }, function (error) {
            console.log("onSignUp, error obtained", error);
            _this.error = true;
            _this.errorMessage = error;
        });
    };
    SignupRhComponent.prototype.isEqualPassword = function (control) {
        if (!this.signUpForm) {
            return { passwordNoMatch: true };
        }
        if (control.value !== this.signUpForm.controls["password"].value) {
            console.log("isEqualPassword, NO");
            return { passwordNoMatch: true };
        }
    };
    return SignupRhComponent;
}());
SignupRhComponent = __decorate([
    Component({
        selector: 'er-signup-rh',
        templateUrl: './signup-rh.component.html',
        styleUrls: ['./signup-rh.component.css']
    }),
    __metadata("design:paramtypes", [FormBuilder, AuthService, CoachCoacheeService, Router, ActivatedRoute])
], SignupRhComponent);
export { SignupRhComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/login/signup/signup-rh.component.js.map