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
import { MeetingsService } from "../../../../service/meetings.service";
import { CoachCoacheeService } from "../../../../service/CoachCoacheeService";
import { AuthService } from "../../../../service/auth.service";
import { Observable } from "rxjs/Observable";
import { Coach } from "../../../../model/Coach";
var MeetingListCoachComponent = (function () {
    function MeetingListCoachComponent(meetingsService, coachCoacheeService, authService, cd) {
        this.meetingsService = meetingsService;
        this.coachCoacheeService = coachCoacheeService;
        this.authService = authService;
        this.cd = cd;
        this.hasOpenedMeeting = false;
        this.hasClosedMeeting = false;
        this.hasUnbookedMeeting = false;
    }
    MeetingListCoachComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
    };
    MeetingListCoachComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
        this.onRefreshRequested();
    };
    MeetingListCoachComponent.prototype.onRefreshRequested = function () {
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
    MeetingListCoachComponent.prototype.onUserObtained = function (user) {
        console.log('onUserObtained, user : ', user);
        if (user) {
            if (user instanceof Coach) {
                // coach
                console.log('get a coach');
                this.getAllMeetingsForCoach(user.id);
            }
            this.user = Observable.of(user);
            this.cd.detectChanges();
        }
    };
    MeetingListCoachComponent.prototype.getAllMeetingsForCoach = function (coachId) {
        var _this = this;
        this.subscription = this.meetingsService.getAllMeetingsForCoachId(coachId).subscribe(function (meetings) {
            console.log('got meetings for coach', meetings);
            _this.meetingsArray = meetings;
            _this.meetings = Observable.of(meetings);
            _this.getBookedMeetings();
            _this.getClosedMeetings();
            _this.getUnbookedMeetings();
            _this.cd.detectChanges();
        });
    };
    MeetingListCoachComponent.prototype.getOpenedMeetings = function () {
        console.log('getOpenedMeetings');
        if (this.meetingsArray != null) {
            var opened = [];
            for (var _i = 0, _a = this.meetingsArray; _i < _a.length; _i++) {
                var meeting = _a[_i];
                if (meeting != null && meeting.isOpen) {
                    opened.push(meeting);
                    this.hasOpenedMeeting = true;
                }
            }
            this.meetingsOpened = Observable.of(opened);
        }
    };
    MeetingListCoachComponent.prototype.getClosedMeetings = function () {
        console.log('getClosedMeetings');
        if (this.meetingsArray != null) {
            var closed_1 = [];
            for (var _i = 0, _a = this.meetingsArray; _i < _a.length; _i++) {
                var meeting = _a[_i];
                if (meeting != null && !meeting.isOpen) {
                    closed_1.push(meeting);
                    this.hasClosedMeeting = true;
                }
            }
            this.meetingsClosed = Observable.of(closed_1);
        }
    };
    MeetingListCoachComponent.prototype.getBookedMeetings = function () {
        console.log('getOpenedMeetings');
        if (this.meetingsArray != null) {
            var opened = [];
            for (var _i = 0, _a = this.meetingsArray; _i < _a.length; _i++) {
                var meeting = _a[_i];
                if (meeting != null && meeting.isOpen && meeting.agreed_date) {
                    opened.push(meeting);
                    this.hasOpenedMeeting = true;
                }
            }
            this.meetingsOpened = Observable.of(opened);
        }
    };
    MeetingListCoachComponent.prototype.getUnbookedMeetings = function () {
        console.log('getAskedMeetings');
        if (this.meetingsArray != null) {
            var unbooked = [];
            for (var _i = 0, _a = this.meetingsArray; _i < _a.length; _i++) {
                var meeting = _a[_i];
                if (meeting != null && meeting.isOpen && !meeting.agreed_date) {
                    unbooked.push(meeting);
                    this.hasUnbookedMeeting = true;
                }
            }
            this.meetingsUnbooked = Observable.of(unbooked);
        }
    };
    MeetingListCoachComponent.prototype.getUsageRate = function (rhId) {
        var _this = this;
        this.coachCoacheeService.getUsageRate(rhId).subscribe(function (rate) {
            console.log("getUsageRate, rate : ", rate);
            _this.rhUsageRate = Observable.of(rate);
        });
    };
    MeetingListCoachComponent.prototype.onCoachStartRoomClicked = function () {
        console.log('onCoachStartRoomClicked');
        this.user.take(1).subscribe(function (usr) {
            console.log('onCoachStartRoomClicked, get user');
            var coach = usr;
            var win = window.open(coach.chat_room_url, "_blank");
        });
    };
    MeetingListCoachComponent.prototype.refreshDashboard = function () {
        location.reload();
    };
    MeetingListCoachComponent.prototype.ngOnDestroy = function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.connectedUserSubscription) {
            this.connectedUserSubscription.unsubscribe();
        }
    };
    /*************************************
     ----------- Modal control ------------
     *************************************/
    MeetingListCoachComponent.prototype.coachCancelModalVisibility = function (isVisible) {
        if (isVisible) {
            $('#coach_cancel_meeting').openModal();
        }
        else {
            $('#coach_cancel_meeting').closeModal();
        }
    };
    MeetingListCoachComponent.prototype.openCoachCancelMeetingModal = function (meeting) {
        this.meetingToCancel = meeting;
        this.coachCancelModalVisibility(true);
    };
    MeetingListCoachComponent.prototype.cancelCoachCancelMeeting = function () {
        this.coachCancelModalVisibility(false);
        this.meetingToCancel = null;
    };
    // remove MeetingTime
    MeetingListCoachComponent.prototype.validateCoachCancelMeeting = function () {
        var _this = this;
        console.log('validateCancelMeeting, agreed date : ', this.meetingToCancel.agreed_date);
        var meetingTimeId = this.meetingToCancel.agreed_date.id;
        console.log('validateCancelMeeting, id : ', meetingTimeId);
        // hide modal
        this.coachCancelModalVisibility(false);
        this.meetingToCancel = null;
        // perform request
        this.meetingsService.removePotentialTime(meetingTimeId).subscribe(function (response) {
            console.log('validateCancelMeeting, res ', response);
            console.log('emit');
            // this.dateRemoved.emit(null);
            _this.onRefreshRequested();
            Materialize.toast('Meeting annulé !', 3000, 'rounded');
        }, function (error) {
            console.log('unbookAdate, error', error);
            Materialize.toast('Impossible d\'annuler le meeting', 3000, 'rounded');
        });
    };
    return MeetingListCoachComponent;
}());
MeetingListCoachComponent = __decorate([
    Component({
        selector: 'rb-meeting-list-coach',
        templateUrl: './meeting-list-coach.component.html',
        styleUrls: ['./meeting-list-coach.component.css']
    }),
    __metadata("design:paramtypes", [MeetingsService, CoachCoacheeService, AuthService, ChangeDetectorRef])
], MeetingListCoachComponent);
export { MeetingListCoachComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/meeting/meeting-list/coach/meeting-list-coach/meeting-list-coach.component.js.map