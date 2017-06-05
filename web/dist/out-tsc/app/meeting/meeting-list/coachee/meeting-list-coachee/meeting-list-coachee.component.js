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
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { Coachee } from "../../../../model/Coachee";
var MeetingListCoacheeComponent = (function () {
    function MeetingListCoacheeComponent(router, meetingsService, coachCoacheeService, authService, cd) {
        this.router = router;
        this.meetingsService = meetingsService;
        this.coachCoacheeService = coachCoacheeService;
        this.authService = authService;
        this.cd = cd;
        this.hasOpenedMeeting = false;
        this.hasClosedMeeting = false;
        this.hasUnbookedMeeting = false;
    }
    MeetingListCoacheeComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
    };
    MeetingListCoacheeComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
        this.onRefreshRequested();
    };
    MeetingListCoacheeComponent.prototype.onRefreshRequested = function () {
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
    MeetingListCoacheeComponent.prototype.onUserObtained = function (user) {
        console.log('onUserObtained, user : ', user);
        if (user) {
            if (user instanceof Coachee) {
                // coachee
                console.log('get a coachee');
                this.getAllMeetingsForCoachee(user.id);
            }
            this.user = Observable.of(user);
            this.cd.detectChanges();
        }
    };
    MeetingListCoacheeComponent.prototype.getAllMeetingsForCoachee = function (coacheeId) {
        var _this = this;
        this.subscription = this.meetingsService.getAllMeetingsForCoacheeId(coacheeId).subscribe(function (meetings) {
            console.log('got meetings for coachee', meetings);
            _this.meetingsArray = meetings;
            _this.meetings = Observable.of(meetings);
            _this.getOpenedMeetings();
            _this.getClosedMeetings();
            _this.cd.detectChanges();
        });
    };
    MeetingListCoacheeComponent.prototype.goToDate = function () {
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
                window.scrollTo(0, 0);
                _this.router.navigate(['/date', meeting.id]);
            });
        });
    };
    MeetingListCoacheeComponent.prototype.getOpenedMeetings = function () {
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
    MeetingListCoacheeComponent.prototype.getClosedMeetings = function () {
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
    MeetingListCoacheeComponent.prototype.getBookedMeetings = function () {
        console.log('getOpenedMeetings');
        if (this.meetingsArray != null) {
            var opened = [];
            for (var _i = 0, _a = this.meetingsArray; _i < _a.length; _i++) {
                var meeting = _a[_i];
                if (meeting.isOpen && meeting.agreed_date) {
                    opened.push(meeting);
                    this.hasOpenedMeeting = true;
                }
            }
            this.meetingsOpened = Observable.of(opened);
        }
    };
    MeetingListCoacheeComponent.prototype.getUnbookedMeetings = function () {
        console.log('getAskedMeetings');
        if (this.meetingsArray != null) {
            var unbooked = [];
            for (var _i = 0, _a = this.meetingsArray; _i < _a.length; _i++) {
                var meeting = _a[_i];
                if (meeting.isOpen && !meeting.agreed_date) {
                    unbooked.push(meeting);
                    this.hasUnbookedMeeting = true;
                }
            }
            this.meetingsUnbooked = Observable.of(unbooked);
        }
    };
    MeetingListCoacheeComponent.prototype.getUsageRate = function (rhId) {
        var _this = this;
        this.coachCoacheeService.getUsageRate(rhId).subscribe(function (rate) {
            console.log("getUsageRate, rate : ", rate);
            _this.rhUsageRate = Observable.of(rate);
        });
    };
    MeetingListCoacheeComponent.prototype.refreshDashboard = function () {
        location.reload();
    };
    MeetingListCoacheeComponent.prototype.ngOnDestroy = function () {
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
    MeetingListCoacheeComponent.prototype.coacheeDeleteModalVisibility = function (isVisible) {
        if (isVisible) {
            $('#coachee_delete_meeting_modal').openModal();
        }
        else {
            $('#coachee_delete_meeting_modal').closeModal();
        }
    };
    MeetingListCoacheeComponent.prototype.openCoacheeDeleteMeetingModal = function (meeting) {
        this.meetingToCancel = meeting;
        this.coacheeDeleteModalVisibility(true);
    };
    MeetingListCoacheeComponent.prototype.cancelCoacheeDeleteMeeting = function () {
        this.coacheeDeleteModalVisibility(false);
        this.meetingToCancel = null;
    };
    MeetingListCoacheeComponent.prototype.validateCoacheeDeleteMeeting = function () {
        var _this = this;
        console.log('validateCoacheeDeleteMeeting');
        var meetingId = this.meetingToCancel.id;
        this.coacheeDeleteModalVisibility(false);
        this.meetingToCancel = null;
        this.meetingsService.deleteMeeting(meetingId).subscribe(function (response) {
            console.log('confirmCancelMeeting, res', response);
            // this.onMeetingCancelled.emit();
            _this.onRefreshRequested();
            Materialize.toast('Meeting supprimé !', 3000, 'rounded');
        }, function (error) {
            console.log('confirmCancelMeeting, error', error);
            Materialize.toast('Impossible de supprimer le meeting', 3000, 'rounded');
        });
    };
    return MeetingListCoacheeComponent;
}());
MeetingListCoacheeComponent = __decorate([
    Component({
        selector: 'rb-meeting-list-coachee',
        templateUrl: './meeting-list-coachee.component.html',
        styleUrls: ['./meeting-list-coachee.component.css']
    }),
    __metadata("design:paramtypes", [Router, MeetingsService, CoachCoacheeService, AuthService, ChangeDetectorRef])
], MeetingListCoacheeComponent);
export { MeetingListCoacheeComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/meeting/meeting-list/coachee/meeting-list-coachee/meeting-list-coachee.component.js.map