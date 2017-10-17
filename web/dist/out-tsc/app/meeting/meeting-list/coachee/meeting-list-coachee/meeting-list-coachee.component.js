var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { MeetingsService } from "../../../../service/meetings.service";
import { Observable } from "rxjs/Observable";
import { AuthService } from "../../../../service/auth.service";
var MeetingListCoacheeComponent = (function () {
    function MeetingListCoacheeComponent(meetingsService, authService, cd) {
        this.meetingsService = meetingsService;
        this.authService = authService;
        this.cd = cd;
        this.loading = true;
        this.isAdmin = false;
        this.hasOpenedMeeting = false;
        this.hasClosedMeeting = false;
        this.sessionRate = '0';
        this.sessionPreRate = '0';
    }
    MeetingListCoacheeComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
        this.loading = true;
    };
    MeetingListCoacheeComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        console.log('ngAfterViewInit');
        this.userSubscription = this.user.subscribe(function (user) {
            _this.onUserObtained(user);
        });
    };
    MeetingListCoacheeComponent.prototype.ngOnDestroy = function () {
        if (this.getAllMeetingsForCoacheeIdSubscription) {
            this.getAllMeetingsForCoacheeIdSubscription.unsubscribe();
        }
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    };
    MeetingListCoacheeComponent.prototype.onRefreshAllRequested = function () {
        console.log('onRefreshAllRequested');
        // call API GET user
        this.authService.refreshConnectedUser();
    };
    MeetingListCoacheeComponent.prototype.onUserObtained = function (user) {
        console.log('onUserObtained, user : ', user);
        if (user) {
            this.getAllMeetingsForCoachee(user.id);
        }
    };
    MeetingListCoacheeComponent.prototype.getAllMeetingsForCoachee = function (coacheeId) {
        var _this = this;
        this.loading = true;
        this.getAllMeetingsForCoacheeIdSubscription = this.meetingsService.getAllMeetingsForCoacheeId(coacheeId, this.isAdmin)
            .subscribe(function (meetings) {
            console.log('got meetings for coachee', meetings);
            _this.onMeetingsObtained(meetings);
        }, function (error) {
            console.log('got meetings for coachee ERROR', error);
            _this.loading = false;
        });
    };
    MeetingListCoacheeComponent.prototype.onMeetingsObtained = function (meetings) {
        console.log('got meetings for coachee', meetings);
        this.meetingsArray = meetings;
        this.meetings = Observable.of(meetings);
        this.getOpenedMeetings();
        this.getClosedMeetings();
        this.loading = false;
        console.log('got meetings, loading', this.loading);
        this.cd.detectChanges();
    };
    MeetingListCoacheeComponent.prototype.getOpenedMeetings = function () {
        console.log('getOpenedMeetings');
        if (this.meetingsArray != null) {
            var opened = new Array();
            for (var _i = 0, _a = this.meetingsArray; _i < _a.length; _i++) {
                var meeting = _a[_i];
                if (meeting.isOpen) {
                    console.log('getOpenedMeetings, add open meeting');
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
                    console.log('getClosedMeetings, add close meeting');
                    closed_1.push(meeting);
                    this.hasClosedMeeting = true;
                }
            }
            this.meetingsClosed = Observable.of(closed_1);
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
            _this.onRefreshAllRequested();
            Materialize.toast('Meeting supprimé !', 3000, 'rounded');
        }, function (error) {
            console.log('confirmCancelMeeting, error', error);
            Materialize.toast('Impossible de supprimer le meeting', 3000, 'rounded');
        });
    };
    /*************************************
     ----------- Modal control - rate session ------------
     *************************************/
    MeetingListCoacheeComponent.prototype.setSessionRate = function (value) {
        this.sessionRate = value.toString();
    };
    MeetingListCoacheeComponent.prototype.setSessionPreRate = function (value) {
        this.sessionPreRate = value.toString();
    };
    MeetingListCoacheeComponent.prototype.updateRateSessionModalVisibility = function (isVisible) {
        if (isVisible) {
            $('#rate_session_modal').openModal();
        }
        else {
            $('#rate_session_modal').closeModal();
        }
    };
    MeetingListCoacheeComponent.prototype.openRateSessionModal = function (meetingId) {
        this.rateSessionMeetingId = meetingId;
        this.updateRateSessionModalVisibility(true);
    };
    MeetingListCoacheeComponent.prototype.cancelRateSessionModal = function () {
        this.updateRateSessionModalVisibility(false);
        this.rateSessionMeetingId = null;
        this.sessionRate = null;
    };
    MeetingListCoacheeComponent.prototype.validateRateSessionModal = function () {
        var _this = this;
        console.log('validateRateSessionModal');
        this.meetingsService.addSessionRateToMeeting(this.rateSessionMeetingId, this.sessionRate).subscribe(function (response) {
            console.log('validateRateSessionModal, res', response);
            _this.onRefreshAllRequested();
            _this.updateRateSessionModalVisibility(false);
            Materialize.toast('Votre coach vient d\'être noté !', 3000, 'rounded');
        }, function (error) {
            console.log('validateRateSessionModal, error', error);
            _this.updateRateSessionModalVisibility(false);
            Materialize.toast('Impossible de noter votre coach', 3000, 'rounded');
        });
    };
    __decorate([
        Input(),
        __metadata("design:type", Observable)
    ], MeetingListCoacheeComponent.prototype, "user", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], MeetingListCoacheeComponent.prototype, "isAdmin", void 0);
    MeetingListCoacheeComponent = __decorate([
        Component({
            selector: 'er-meeting-list-coachee',
            templateUrl: './meeting-list-coachee.component.html',
            styleUrls: ['./meeting-list-coachee.component.scss']
        }),
        __metadata("design:paramtypes", [MeetingsService, AuthService, ChangeDetectorRef])
    ], MeetingListCoacheeComponent);
    return MeetingListCoacheeComponent;
}());
export { MeetingListCoacheeComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/meeting/meeting-list/coachee/meeting-list-coachee/meeting-list-coachee.component.js.map