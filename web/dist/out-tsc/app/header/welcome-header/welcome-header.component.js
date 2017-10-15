var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from "@angular/router";
import { PromiseObservable } from "rxjs/observable/PromiseObservable";
import { FirebaseService } from "../../service/firebase.service";
var WelcomeHeaderComponent = (function () {
    function WelcomeHeaderComponent(router, cd, firebase) {
        this.router = router;
        this.cd = cd;
        this.firebase = firebase;
    }
    WelcomeHeaderComponent.prototype.ngOnInit = function () {
    };
    WelcomeHeaderComponent.prototype.toggleLoginStatus = function () {
        $('#signin').slideToggle('slow');
    };
    WelcomeHeaderComponent.prototype.goToRegisterCoach = function () {
        this.router.navigate(['register_coach/step1']);
    };
    /*************************************
     ----------- Modal control for forgot password ------------
     *************************************/
    WelcomeHeaderComponent.prototype.onForgotPasswordClicked = function () {
        console.log('onForgotPasswordClicked');
        this.startForgotPasswordFlow();
    };
    WelcomeHeaderComponent.prototype.updateForgotPasswordModalVisibility = function (isVisible) {
        if (isVisible) {
            $('#forgot_password_modal').openModal();
        }
        else {
            $('#forgot_password_modal').closeModal();
        }
    };
    WelcomeHeaderComponent.prototype.startForgotPasswordFlow = function () {
        console.log('startForgotPasswordFlow');
        this.updateForgotPasswordModalVisibility(true);
    };
    WelcomeHeaderComponent.prototype.cancelForgotPasswordModal = function () {
        this.updateForgotPasswordModalVisibility(false);
        this.forgotEmail = null;
    };
    WelcomeHeaderComponent.prototype.validateForgotPasswordModal = function () {
        var _this = this;
        console.log('validateForgotPasswordModal');
        // make sure forgotEmail has a value
        var firebaseObs = PromiseObservable.create(this.firebase.sendPasswordResetEmail(this.forgotEmail));
        firebaseObs.subscribe(function () {
            console.log("sendPasswordResetEmail ");
            Materialize.toast("Email envoyé", 3000, 'rounded');
            _this.cancelForgotPasswordModal();
            _this.cd.detectChanges();
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
        }).unsubscribe();
    };
    WelcomeHeaderComponent = __decorate([
        Component({
            selector: 'er-welcome-header',
            templateUrl: './welcome-header.component.html',
            styleUrls: ['./welcome-header.component.scss']
        }),
        __metadata("design:paramtypes", [Router, ChangeDetectorRef, FirebaseService])
    ], WelcomeHeaderComponent);
    return WelcomeHeaderComponent;
}());
export { WelcomeHeaderComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/header/welcome-header/welcome-header.component.js.map