var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ChangeDetectorRef } from '@angular/core';
import { Observable } from "rxjs";
import { Coachee } from "../../../model/Coachee";
import { AuthService } from "../../../service/auth.service";
import { FormBuilder } from "@angular/forms";
var ProfileCoacheeComponent = (function () {
    function ProfileCoacheeComponent(authService, formBuilder, cd) {
        this.authService = authService;
        this.formBuilder = formBuilder;
        this.cd = cd;
    }
    ProfileCoacheeComponent.prototype.ngOnInit = function () {
        this.formCoachee = this.formBuilder.group({
            pseudo: [''],
            avatar: ['']
        });
    };
    ProfileCoacheeComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        var user = this.authService.getConnectedUser();
        console.log("ngAfterViewInit, user : ", user);
        this.onUserObtained(user);
        this.connectedUserSubscription = this.authService.getConnectedUserObservable().subscribe(function (user) {
            console.log("getConnectedUser");
            _this.onUserObtained(user);
        });
    };
    ProfileCoacheeComponent.prototype.ngOnDestroy = function () {
        if (this.connectedUserSubscription) {
            this.connectedUserSubscription.unsubscribe();
        }
    };
    ProfileCoacheeComponent.prototype.submitCoacheeProfileUpdate = function () {
        var _this = this;
        console.log("submitProfileUpdate");
        this.coachee.last().flatMap(function (coachee) {
            console.log("submitProfileUpdate, coache obtained");
            return _this.authService.updateCoacheeForId(coachee.id, _this.formCoachee.value.pseudo, _this.formCoachee.value.avatar);
        }).subscribe(function (user) {
            console.log("coachee updated : ", user);
            //refresh page
            _this.onUserObtained(user);
        }, function (error) {
            console.log('coachee update, error', error);
            //TODO display error
        });
    };
    ProfileCoacheeComponent.prototype.onUserObtained = function (user) {
        console.log("onUserObtained, user : ", user);
        this.connectedUser = Observable.of(user);
        if (user instanceof Coachee) {
            this.coachee = Observable.of(user);
        }
        this.cd.detectChanges();
    };
    return ProfileCoacheeComponent;
}());
ProfileCoacheeComponent = __decorate([
    Component({
        selector: 'rb-profile-coachee',
        templateUrl: 'profile-coachee.component.html',
        styleUrls: ['profile-coachee.component.css']
    }),
    __metadata("design:paramtypes", [AuthService, FormBuilder, ChangeDetectorRef])
], ProfileCoacheeComponent);
export { ProfileCoacheeComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/user/profile/coachee/profile-coachee.component.js.map