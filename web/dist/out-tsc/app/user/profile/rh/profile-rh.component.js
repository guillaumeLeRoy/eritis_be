var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ChangeDetectorRef, Component } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Observable } from "rxjs/Observable";
import { HR } from "../../../model/HR";
import { AuthService } from "../../../service/auth.service";
var ProfileRhComponent = (function () {
    function ProfileRhComponent(authService, formBuilder, cd) {
        this.authService = authService;
        this.formBuilder = formBuilder;
        this.cd = cd;
    }
    ProfileRhComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
        this.formRh = this.formBuilder.group({
            firstName: [''],
            lastName: [''],
            avatar: ['']
        });
    };
    ProfileRhComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        var user = this.authService.getConnectedUser();
        console.log("ngAfterViewInit, user : ", user);
        this.onUserObtained(user);
        this.connectedUserSubscription = this.authService.getConnectedUserObservable().subscribe(function (user) {
            console.log("getConnectedUser");
            _this.onUserObtained(user);
        });
    };
    ProfileRhComponent.prototype.ngOnDestroy = function () {
        if (this.connectedUserSubscription) {
            this.connectedUserSubscription.unsubscribe();
        }
    };
    ProfileRhComponent.prototype.submitRhProfileUpdate = function () {
        var _this = this;
        console.log("submitProfileUpdate");
        this.rh.last().flatMap(function (rh) {
            console.log("submitProfileUpdate, rh obtained");
            return _this.authService.updateCoacheeForId(rh.id, _this.formRh.value.firstName, _this.formRh.value.lastName, _this.formRh.value.avatar);
        }).subscribe(function (user) {
            console.log("rh updated : ", user);
            //refresh page
            _this.onUserObtained(user);
        }, function (error) {
            console.log('rh update, error', error);
            //TODO display error
        });
    };
    ProfileRhComponent.prototype.onUserObtained = function (user) {
        console.log("onUserObtained, user : ", user);
        this.connectedUser = Observable.of(user);
        if (user instanceof HR) {
            this.rh = Observable.of(user);
        }
        this.cd.detectChanges();
    };
    return ProfileRhComponent;
}());
ProfileRhComponent = __decorate([
    Component({
        selector: 'rb-profile-rh',
        templateUrl: './profile-rh.component.html',
        styleUrls: ['./profile-rh.component.scss']
    }),
    __metadata("design:paramtypes", [AuthService, FormBuilder, ChangeDetectorRef])
], ProfileRhComponent);
export { ProfileRhComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/user/profile/rh/profile-rh.component.js.map