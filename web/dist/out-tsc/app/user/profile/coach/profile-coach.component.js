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
import { Coach } from "../../../model/Coach";
import { AuthService } from "../../../service/auth.service";
import { FormBuilder, Validators } from "@angular/forms";
var ProfileCoachComponent = (function () {
    function ProfileCoachComponent(authService, formBuilder, cd) {
        this.authService = authService;
        this.formBuilder = formBuilder;
        this.cd = cd;
    }
    ProfileCoachComponent.prototype.ngOnInit = function () {
        this.formCoach = this.formBuilder.group({
            displayName: ['', Validators.required],
            avatar: ['', Validators.required],
            description: ['', Validators.required],
        });
    };
    ProfileCoachComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        var user = this.authService.getConnectedUser();
        console.log("ngAfterViewInit, user : ", user);
        this.onUserObtained(user);
        this.connectedUserSubscription = this.authService.getConnectedUserObservable().subscribe(function (user) {
            console.log("getConnectedUser");
            _this.onUserObtained(user);
        });
    };
    ProfileCoachComponent.prototype.ngOnDestroy = function () {
        if (this.connectedUserSubscription) {
            this.connectedUserSubscription.unsubscribe();
        }
    };
    ProfileCoachComponent.prototype.submitCoachProfilUpdate = function () {
        var _this = this;
        console.log("submitCoachProfilUpdate");
        this.coach.last().flatMap(function (coach) {
            console.log("submitCoachProfilUpdate, coach obtained");
            return _this.authService.updateCoachForId(coach.id, _this.formCoach.value.displayName, _this.formCoach.value.description, _this.formCoach.value.avatar);
        }).subscribe(function (user) {
            console.log("coach updated : ", user);
            //refresh page
            _this.onUserObtained(user);
        }, function (error) {
            console.log('coach update, error', error);
            //TODO display error
        });
    };
    ProfileCoachComponent.prototype.onUserObtained = function (user) {
        console.log("onUserObtained, user : ", user);
        this.connectedUser = Observable.of(user);
        if (user instanceof Coach) {
            //update form
            this.formCoach.setValue({
                displayName: user.display_name,
                description: user.description,
                avatar: user.avatar_url,
            });
            console.log("onUserObtained, update form : ", this.formCoach.value);
            this.coach = Observable.of(user);
        }
        this.cd.detectChanges();
    };
    return ProfileCoachComponent;
}());
ProfileCoachComponent = __decorate([
    Component({
        selector: 'rb-profile-coach',
        templateUrl: 'profile-coach.component.html',
        styleUrls: ['profile-coach.component.css']
    }),
    __metadata("design:paramtypes", [AuthService, FormBuilder, ChangeDetectorRef])
], ProfileCoachComponent);
export { ProfileCoachComponent };
//# sourceMappingURL=/Users/guillaume/git/eritis_fe/src/app/user/profile/coach/profile-coach.component.js.map