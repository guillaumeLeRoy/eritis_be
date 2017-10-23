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
import { FirebaseService } from "../../service/firebase.service";
import { PromiseObservable } from "rxjs/observable/PromiseObservable";
import { Utils } from "../../utils/Utils";
var SigninComponent = (function () {
    function SigninComponent(formBuilder, authService, router, firebase) {
        this.formBuilder = formBuilder;
        this.authService = authService;
        this.router = router;
        this.firebase = firebase;
        this.error = false;
        this.loginLoading = false;
    }
    SigninComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
        this.signInForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.pattern(Utils.EMAIL_REGEX)]],
            password: ['', Validators.required],
        });
    };
    SigninComponent.prototype.onSignIn = function () {
        var _this = this;
        ga('send', 'event', {
            eventCategory: 'signin',
            eventLabel: 'start',
            eventAction: 'click',
        });
        // Activate spinner loader
        this.loginLoading = true;
        // reset errors
        this.error = false;
        this.errorMessage = '';
        this.authService.signIn(this.signInForm.value)
            .subscribe(function (user) {
            ga('send', 'event', {
                eventCategory: 'signin',
                eventLabel: 'success|userId:' + user.id,
                eventAction: 'api response',
            });
            console.log('onSignIn, user obtained', user);
            /*L'utilisateur est TOUJOURS redirigé vers ses meetings*/
            _this.router.navigate(['/dashboard']);
            // Materialize.toast('Bonjour ' + user.first_name + ' !', 3000, 'rounded');
            _this.loginLoading = false;
        }, function (error) {
            ga('send', 'event', {
                eventCategory: 'signin',
                eventLabel: 'error:' + error,
                eventAction: 'api response',
            });
            console.log('onSignIn, error obtained', error);
            Materialize.toast("Le mot de passe ou l'adresse mail est incorrect", 3000, 'rounded');
            _this.loginLoading = false;
            //this.error = true;
            //this.errorMessage = error;
        });
    };
    SigninComponent.prototype.goToSignUp = function () {
        this.router.navigate(['/signup']);
    };
    SigninComponent.prototype.onForgotPasswordClicked = function () {
        console.log('onForgotPasswordClicked');
        this.startForgotPasswordFlow();
    };
    /*************************************
     ----------- Modal control for forgot password ------------
     *************************************/
    SigninComponent.prototype.updateForgotPasswordModalVisibility = function (isVisible) {
        if (isVisible) {
            $('#forgot_password_modal').openModal();
        }
        else {
            $('#forgot_password_modal').closeModal();
        }
    };
    SigninComponent.prototype.startForgotPasswordFlow = function () {
        console.log('startForgotPasswordFlow');
        this.updateForgotPasswordModalVisibility(true);
    };
    SigninComponent.prototype.cancelForgotPasswordModal = function () {
        this.updateForgotPasswordModalVisibility(false);
        this.forgotEmail = null;
    };
    SigninComponent.prototype.validateForgotPasswordModal = function () {
        var _this = this;
        console.log('validateForgotPasswordModal');
        // make sure forgotEmail has a value
        var firebaseObs = PromiseObservable.create(this.firebase.sendPasswordResetEmail(this.forgotEmail));
        firebaseObs.subscribe(function () {
            console.log("sendPasswordResetEmail ");
            Materialize.toast("Email envoyé", 3000, 'rounded');
            _this.cancelForgotPasswordModal();
        }, function (error) {
            /**
             * {code: "auth/invalid-email", message: "The email address is badly formatted."}code: "auth/invalid-email"message: "The email address is badly formatted."__proto__: Error
             *
             * O {code: "auth/user-not-found", message: "There is no user record corresponding to this identifier. The user may have been deleted."}code: "auth/user-not-found"message: "There is no user record corresponding to this identifier. The user may have been deleted."__proto__: Error
             */
            console.log("sendPasswordResetEmail fail reason", error);
            if (error != undefined) {
                if (error.code == "auth/invalid-email") {
                    Materialize.toast("L'email n'est pas correctement formatté", 3000, 'rounded');
                    return;
                }
                else if (error.code == "auth/user-not-found") {
                    Materialize.toast("L'email ne correspond à aucun de nos utilisateurs", 3000, 'rounded');
                    return;
                }
            }
            Materialize.toast("Une erreur est survenue", 3000, 'rounded');
        });
    };
    SigninComponent = __decorate([
        Component({
            selector: 'er-signin',
            templateUrl: './signin.component.html',
            styleUrls: ['./signin.component.scss']
        }),
        __metadata("design:paramtypes", [FormBuilder, AuthService, Router, FirebaseService])
    ], SigninComponent);
    return SigninComponent;
}());
export { SigninComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/login/signin/signin.component.js.map