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
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../service/auth.service";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
var SignUpType;
(function (SignUpType) {
    SignUpType[SignUpType["COACH"] = 0] = "COACH";
    SignUpType[SignUpType["COACHEE"] = 1] = "COACHEE";
    SignUpType[SignUpType["RH"] = 2] = "RH";
})(SignUpType || (SignUpType = {}));
var SignupAdminComponent = (function () {
    /* ----- END Contract Plan ----*/
    function SignupAdminComponent(formBuilder, authService, router) {
        this.formBuilder = formBuilder;
        this.authService = authService;
        this.router = router;
        this.error = false;
        this.errorMessage = "";
        console.log("constructor");
    }
    SignupAdminComponent.prototype.ngOnInit = function () {
        console.log("ngOnInit");
        this.signUpTypes = [SignUpType.COACH, SignUpType.COACHEE, SignUpType.RH];
        this.signUpForm = this.formBuilder.group({
            email: ['', Validators.compose([
                    Validators.required,
                    this.isEmail
                ])],
            password: ['', Validators.compose([Validators.required,
                    Validators.minLength(6)])
            ],
            confirmPassword: ['',
                [Validators.required, this.isEqualPassword.bind(this)]
            ],
        });
        this.getListOfContractPlans();
    };
    SignupAdminComponent.prototype.onSelectPlan = function (plan) {
        console.log("onSelectPlan, plan ", plan);
        this.mSelectedPlan = plan;
    };
    SignupAdminComponent.prototype.onSignUpSubmitted = function () {
        var _this = this;
        console.log("onSignUp");
        //reset errors
        this.error = false;
        this.errorMessage = '';
        if (this.signUpSelectedType == SignUpType.COACH) {
            console.log("onSignUp, coach");
            this.authService.signUpCoach(this.signUpForm.value).subscribe(function (data) {
                console.log("onSignUp, data obtained", data);
                _this.router.navigate(['/profile_coach']);
            }, function (error) {
                console.log("onSignUp, error obtained", error);
                _this.error = true;
                _this.errorMessage = error;
            });
        }
        else if (this.signUpSelectedType == SignUpType.COACHEE) {
            console.log("onSignUp, coachee");
            //contract Plan is mandatory
            if (this.mSelectedPlan == null) {
                this.error = true;
                this.errorMessage = "Selectionnez un contract";
                return;
            }
            var user = this.signUpForm.value;
            user.contractPlanId = this.mSelectedPlan.plan_id;
            this.authService.signUpCoachee(user).subscribe(function (data) {
                console.log("onSignUp, data obtained", data);
                /*L'utilisateur est TOUJOURS redirigé vers ses meetings*/
                _this.router.navigate(['/meetings']);
            }, function (error) {
                console.log("onSignUp, error obtained", error);
                _this.error = true;
                _this.errorMessage = error;
            });
        }
        else if (this.signUpSelectedType == SignUpType.RH) {
            this.authService.signUpRh(this.signUpForm.value).subscribe(function (data) {
                console.log("onSignUp, RH, data obtained", data);
                /*L'utilisateur est TOUJOURS redirigé vers ses meetings*/
                _this.router.navigate(['/meetings']); //TODO change that
            }, function (error) {
                console.log("onSignUp, error obtained", error);
                _this.error = true;
                _this.errorMessage = error;
            });
        }
        else {
            Materialize.toast('Vous devez sélectionner un type', 3000, 'rounded');
        }
    };
    SignupAdminComponent.prototype.getListOfContractPlans = function () {
        var _this = this;
        this.authService.getNotAuth(AuthService.GET_CONTRACT_PLANS, null).subscribe(function (response) {
            var json = response.json();
            console.log("getListOfContractPlans, response json : ", json);
            _this.plans = Observable.of(json);
            // this.cd.detectChanges();
        });
    };
    SignupAdminComponent.prototype.isEmail = function (control) {
        if (!control.value.match("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")) {
            console.log("email NOT ok");
            // this.test = false
            return { noEmail: true };
        }
        // this.test = true
        console.log("email ok");
    };
    SignupAdminComponent.prototype.isEqualPassword = function (control) {
        if (!this.signUpForm) {
            return { passwordNoMatch: true };
        }
        if (control.value !== this.signUpForm.controls["password"].value) {
            console.log("isEqualPassword, NO");
            return { passwordNoMatch: true };
        }
    };
    SignupAdminComponent.prototype.getSignUpTypeName = function (type) {
        switch (type) {
            case SignUpType.COACH:
                return "Coach";
            case SignUpType.COACHEE:
                return "Coaché";
            case SignUpType.RH:
                return "RH";
        }
    };
    return SignupAdminComponent;
}());
SignupAdminComponent = __decorate([
    Component({
        selector: 'rb-signup',
        templateUrl: './signup_admin.component.html',
        styleUrls: ['./signup_admin.component.css']
    }),
    __metadata("design:paramtypes", [FormBuilder, AuthService, Router])
], SignupAdminComponent);
export { SignupAdminComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/login/signup/signup_admin.component.js.map