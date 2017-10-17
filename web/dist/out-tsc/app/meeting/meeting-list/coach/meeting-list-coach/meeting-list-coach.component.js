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
import { CoachCoacheeService } from "../../../../service/coach_coachee.service";
import { Observable } from "rxjs/Observable";
var MeetingListCoachComponent = (function () {
    /**
     *
     * @param meetingsService
     * @param coachCoacheeService
     * @param authService
     * @param cd
     */
    function MeetingListCoachComponent(coachCoacheeService, meetingsService, cd) {
        this.coachCoacheeService = coachCoacheeService;
        this.meetingsService = meetingsService;
        this.cd = cd;
        this.loading = true;
        this.isAdmin = false;
        this.meetingsOpenedCount = 0;
        this.hasOpenedMeeting = false;
        this.hasClosedMeeting = false;
        this.hasUnbookedMeeting = false;
    }
    MeetingListCoachComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
    };
    MeetingListCoachComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        console.log('ngAfterViewInit');
        this.loading = true;
        this.userSubscription = this.user.subscribe(function (coach) {
            _this.onUserObtained(coach);
        });
    };
    MeetingListCoachComponent.prototype.ngOnDestroy = function () {
        console.log('ngOnDestroy');
        if (this.getAllMeetingsForCoachIdSubscription) {
            this.getAllMeetingsForCoachIdSubscription.unsubscribe();
        }
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    };
    MeetingListCoachComponent.prototype.onRefreshListRequested = function () {
        var _this = this;
        console.log('onRefreshRequested');
        this.refreshSubscription = this.user.first().subscribe(function (user) {
            _this.onUserObtained(user);
        });
    };
    MeetingListCoachComponent.prototype.onUserObtained = function (user) {
        console.log('onUserObtained, user : ', user);
        if (user) {
            this.getAllMeetingsForCoach(user.id);
        }
    };
    MeetingListCoachComponent.prototype.getAllMeetingsForCoach = function (coachId) {
        var _this = this;
        this.getAllMeetingsForCoachIdSubscription = this.meetingsService.getAllMeetingsForCoachId(coachId, this.isAdmin)
            .subscribe(function (meetings) {
            console.log('got meetings for coach', meetings);
            _this.onMeetingsObtained(meetings);
        }, function (error) {
            console.log('got meetings for coach ERROR', error);
            _this.loading = false;
        });
    };
    MeetingListCoachComponent.prototype.onMeetingsObtained = function (meetings) {
        console.log('got meetings for coach', meetings);
        this.meetingsArray = meetings;
        this.meetings = Observable.of(meetings);
        this.getBookedMeetings();
        this.getUnbookedMeetings();
        this.getClosedMeetings();
        this.loading = false;
        console.log('got meetings, loading', this.loading);
        this.cd.detectChanges();
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
        console.log('getBookedMeetings');
        this.meetingsOpenedCount = 0;
        if (this.meetingsArray != null) {
            var opened = [];
            for (var _i = 0, _a = this.meetingsArray; _i < _a.length; _i++) {
                var meeting = _a[_i];
                console.log('getBookedMeetings, meeting : ', meeting);
                if (meeting != null && meeting.isOpen && meeting.agreed_date != undefined) {
                    opened.push(meeting);
                    this.hasOpenedMeeting = true;
                    console.log('getBookedMeetings, add meeting');
                    this.meetingsOpenedCount++;
                }
            }
            this.meetingsOpened = Observable.of(opened);
        }
    };
    MeetingListCoachComponent.prototype.getUnbookedMeetings = function () {
        console.log('getUnbookedMeetings');
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
    /*************************************
     ----------- Modal control to close a sessions ------------
     *************************************/
    MeetingListCoachComponent.prototype.updateCloseSessionModalVisibility = function (visible) {
        if (visible) {
            $('#complete_session_modal').openModal();
        }
        else {
            $('#complete_session_modal').closeModal();
        }
    };
    MeetingListCoachComponent.prototype.starCloseSessionFlow = function (meetingId) {
        console.log('startAddNewObjectiveFlow, coacheeId : ', meetingId);
        this.updateCloseSessionModalVisibility(true);
        this.meetingToReportId = meetingId;
    };
    MeetingListCoachComponent.prototype.cancelCloseSessionModal = function () {
        this.updateCloseSessionModalVisibility(false);
    };
    MeetingListCoachComponent.prototype.validateCloseSessionModal = function () {
        var _this = this;
        console.log('validateCloseSessionModal');
        //TODO start loader
        this.meetingsService.closeMeeting(this.meetingToReportId, this.sessionResult, this.sessionUtility).subscribe(function (meeting) {
            console.log("submitCloseMeetingForm, got meeting : ", meeting);
            // TODO stop loader
            //hide modal
            _this.updateCloseSessionModalVisibility(false);
            //refresh list of meetings
            _this.onRefreshListRequested();
            Materialize.toast('Le compte-rendu a été envoyé !', 3000, 'rounded');
        }, function (error) {
            console.log('closeMeeting error', error);
            //TODO display error
            Materialize.toast('Impossible de clore la séance', 3000, 'rounded');
        });
    };
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], MeetingListCoachComponent.prototype, "isAdmin", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Observable)
    ], MeetingListCoachComponent.prototype, "user", void 0);
    MeetingListCoachComponent = __decorate([
        Component({
            selector: 'er-meeting-list-coach',
            templateUrl: './meeting-list-coach.component.html',
            styleUrls: ['./meeting-list-coach.component.scss']
        }),
        __metadata("design:paramtypes", [CoachCoacheeService, MeetingsService, ChangeDetectorRef])
    ], MeetingListCoachComponent);
    return MeetingListCoachComponent;
}());
export { MeetingListCoachComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/meeting/meeting-list/coach/meeting-list-coach/meeting-list-coach.component.js.map