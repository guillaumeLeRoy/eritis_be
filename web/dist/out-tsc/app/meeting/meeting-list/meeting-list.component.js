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
import { Router } from "@angular/router";
var MeetingListComponent = (function () {
    function MeetingListComponent(router, meetingsService, authService, cd) {
        this.router = router;
        this.meetingsService = meetingsService;
        this.authService = authService;
        this.cd = cd;
        this.hasOpenedMeeting = false;
        this.hasClosedMeeting = false;
    }
    MeetingListComponent.prototype.ngOnInit = function () {
        console.log("ngOnInit");
    };
    MeetingListComponent.prototype.ngAfterViewInit = function () {
        console.log("ngAfterViewInit");
        this.onRefreshRequested();
    };
    MeetingListComponent.prototype.onRefreshRequested = function () {
        var _this = this;
        console.log("onRefreshRequested");
        var user = this.authService.getConnectedUser();
        console.log("onRefreshRequested, user : ", user);
        this.onUserObtained(user);
        if (user == null) {
            this.connectedUserSubscription = this.authService.getConnectedUserObservable().subscribe(function (user) {
                console.log("onRefreshRequested, getConnectedUser");
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
            _this.meetingsArray = meetings;
            _this.meetings = Observable.of(meetings);
            _this.getOpenedMeetings();
            _this.getClosedMeetings();
            _this.cd.detectChanges();
        });
    };
    MeetingListComponent.prototype.getAllMeetingsForCoachee = function (coacheeId) {
        var _this = this;
        this.subscription = this.meetingsService.getAllMeetingsForCoacheeId(coacheeId).subscribe(function (meetings) {
            console.log("got meetings for coachee", meetings);
            _this.meetingsArray = meetings;
            _this.meetings = Observable.of(meetings);
            _this.getOpenedMeetings();
            _this.getClosedMeetings();
            _this.cd.detectChanges();
        });
    };
    MeetingListComponent.prototype.onUserObtained = function (user) {
        console.log("onUserObtained, user : ", user);
        if (user) {
            if (user instanceof Coach) {
                // coach
                console.log("get a coach");
                this.getAllMeetingsForCoach(user.id);
            }
            else if (user instanceof Coachee) {
                // coachee
                console.log("get a coachee");
                this.getAllMeetingsForCoachee(user.id);
            }
            this.user = Observable.of(user);
            this.cd.detectChanges();
        }
    };
    MeetingListComponent.prototype.goToDate = function () {
        var _this = this;
        console.log('goToDate');
        this.user.take(1).subscribe(function (user) {
            if (user == null) {
                console.log('no connected user');
                return;
            }
            // 1) create a new meeting
            // 2) refresh our user to have a correct number of available sessions
            // 3) redirect to our MeetingDateComponent
            _this.meetingsService.createMeeting(user.id).flatMap(function (meeting) {
                console.log('goToDate, meeting created');
                //meeting created, now fetch user
                return _this.authService.refreshConnectedUser().flatMap(function (user) {
                    console.log('goToDate, user refreshed');
                    return Observable.of(meeting);
                });
            }).subscribe(function (meeting) {
                // TODO display a loader
                console.log('goToDate, go to setup dates');
                _this.router.navigate(['/date', meeting.id]);
            });
        });
    };
    MeetingListComponent.prototype.getOpenedMeetings = function () {
        console.log('getOpenedMeetings');
        if (this.meetingsArray != null) {
            var opened = [];
            for (var _i = 0, _a = this.meetingsArray; _i < _a.length; _i++) {
                var meeting = _a[_i];
                if (meeting.isOpen) {
                    opened.push(meeting);
                    this.hasOpenedMeeting = true;
                }
            }
            this.meetingsOpened = Observable.of(opened);
        }
    };
    MeetingListComponent.prototype.getClosedMeetings = function () {
        console.log('getClosedMeetings');
        if (this.meetingsArray != null) {
            var closed_1 = [];
            for (var _i = 0, _a = this.meetingsArray; _i < _a.length; _i++) {
                var meeting = _a[_i];
                if (!meeting.isOpen) {
                    closed_1.push(meeting);
                    this.hasClosedMeeting = true;
                }
            }
            this.meetingsClosed = Observable.of(closed_1);
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
    __metadata("design:paramtypes", [Router, MeetingsService, AuthService, ChangeDetectorRef])
], MeetingListComponent);
export { MeetingListComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/meeting/meeting-list/meeting-list.component.js.map