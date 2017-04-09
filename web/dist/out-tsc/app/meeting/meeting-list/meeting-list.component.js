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
import { MeetingsService } from "../../service/meetings.service";
import { Observable } from "rxjs";
import { AuthService } from "../../service/auth.service";
import { Coach } from "../../model/Coach";
import { Coachee } from "../../model/coachee";
var MeetingListComponent = (function () {
    function MeetingListComponent(meetingsService, authService, cd) {
        this.meetingsService = meetingsService;
        this.authService = authService;
        this.cd = cd;
    }
    MeetingListComponent.prototype.ngOnInit = function () {
    };
    MeetingListComponent.prototype.ngAfterViewInit = function () {
        this.onRefreshRequested();
    };
    MeetingListComponent.prototype.onRefreshRequested = function () {
        var _this = this;
        console.log("onRefreshRequested");
        var user = this.authService.getConnectedUser();
        console.log("ngAfterViewInit, user : ", user);
        this.onUserObtained(user);
        if (user == null) {
            this.connectedUserSubscription = this.authService.getConnectedUserObservable().subscribe(function (user) {
                console.log("getConnectedUser");
                _this.onUserObtained(user);
            });
        }
    };
    MeetingListComponent.prototype.isUserACoach = function (user) {
        return user instanceof Coach;
    };
    MeetingListComponent.prototype.isUserACoachee = function (user) {
        return user instanceof Coachee;
    };
    MeetingListComponent.prototype.getAllMeetingsForCoach = function (coachId) {
        var _this = this;
        this.subscription = this.meetingsService.getAllMeetingsForCoachId(coachId).subscribe(function (meetings) {
            console.log("got meetings for coach", meetings);
            _this.meetings = Observable.of(meetings);
            _this.cd.detectChanges();
        });
    };
    MeetingListComponent.prototype.getAllMeetingsForCoachee = function (coacheeId) {
        var _this = this;
        this.subscription = this.meetingsService.getAllMeetingsForCoacheeId(coacheeId).subscribe(function (meetings) {
            console.log("got meetings for coachee", meetings);
            _this.meetings = Observable.of(meetings);
            _this.cd.detectChanges();
        });
    };
    MeetingListComponent.prototype.onUserObtained = function (user) {
        console.log("onUserObtained, user : ", user);
        if (user) {
            if (user instanceof Coach) {
                //coach
                console.log("get a coach");
                this.getAllMeetingsForCoach(user.id);
            }
            else if (user instanceof Coachee) {
                //coachee
                console.log("get a coachee");
                this.getAllMeetingsForCoachee(user.id);
            }
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
        styleUrls: ['./meeting-list.component.css']
    }),
    __metadata("design:paramtypes", [MeetingsService, AuthService, ChangeDetectorRef])
], MeetingListComponent);
export { MeetingListComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/meeting/meeting-list/meeting-list.component.js.map