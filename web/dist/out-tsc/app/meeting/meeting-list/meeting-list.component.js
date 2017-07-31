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
import { Observable } from "rxjs";
import { AuthService } from "../../service/auth.service";
import { Coach } from "../../model/Coach";
import { Coachee } from "../../model/Coachee";
import { HR } from "../../model/HR";
var MeetingListComponent = (function () {
    function MeetingListComponent(authService, cd) {
        this.authService = authService;
        this.cd = cd;
    }
    MeetingListComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
        window.scrollTo(0, 0);
    };
    MeetingListComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
        this.onRefreshRequested();
    };
    MeetingListComponent.prototype.onRefreshRequested = function () {
        var _this = this;
        var user = this.authService.getConnectedUser();
        console.log('onRefreshRequested, user : ', user);
        if (user == null) {
            this.connectedUserSubscription = this.authService.getConnectedUserObservable().subscribe(function (user) {
                console.log('onRefreshRequested, getConnectedUser');
                _this.onUserObtained(user);
            });
        }
        else {
            this.onUserObtained(user);
        }
    };
    MeetingListComponent.prototype.isUserACoach = function (user) {
        return user instanceof Coach;
    };
    MeetingListComponent.prototype.isUserACoachee = function (user) {
        return user instanceof Coachee;
    };
    MeetingListComponent.prototype.isUserARh = function (user) {
        return user instanceof HR;
    };
    MeetingListComponent.prototype.onUserObtained = function (user) {
        console.log('onUserObtained, user : ', user);
        if (user) {
            this.user = Observable.of(user);
            this.cd.detectChanges();
        }
    };
    MeetingListComponent.prototype.ngOnDestroy = function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.connectedUserSubscription) {
            this.connectedUserSubscription.unsubscribe();
        }
    };
    return MeetingListComponent;
}());
MeetingListComponent = __decorate([
    Component({
        selector: 'rb-meeting-list',
        templateUrl: './meeting-list.component.html',
        styleUrls: ['./meeting-list.component.scss']
    }),
    __metadata("design:paramtypes", [AuthService, ChangeDetectorRef])
], MeetingListComponent);
export { MeetingListComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/meeting/meeting-list/meeting-list.component.js.map