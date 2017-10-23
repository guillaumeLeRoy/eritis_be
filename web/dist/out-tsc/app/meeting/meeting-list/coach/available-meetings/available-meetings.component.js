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
import { Observable } from 'rxjs/Observable';
import { MeetingsService } from '../../../../service/meetings.service';
import { AuthService } from '../../../../service/auth.service';
import { Coach } from '../../../../model/Coach';
import { Router } from '@angular/router';
import { MeetingDate } from '../../../../model/MeetingDate';
var AvailableMeetingsComponent = (function () {
    function AvailableMeetingsComponent(authService, meetingService, cd, router) {
        this.authService = authService;
        this.meetingService = meetingService;
        this.cd = cd;
        this.router = router;
        this.hasAvailableMeetings = false;
        this.loading = true;
    }
    AvailableMeetingsComponent.prototype.ngOnInit = function () {
    };
    AvailableMeetingsComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
        this.loading = true;
        this.getConnectedUser();
    };
    AvailableMeetingsComponent.prototype.ngOnDestroy = function () {
        console.log('ngOnDestroy');
        if (this.connectedUserSubscription) {
            this.connectedUserSubscription.unsubscribe();
        }
        if (this.getAllMeetingsSubscription) {
            this.getAllMeetingsSubscription.unsubscribe();
        }
        if (this.getBookedMeetingsSubscription) {
            this.getBookedMeetingsSubscription.unsubscribe();
        }
    };
    AvailableMeetingsComponent.prototype.getConnectedUser = function () {
        var _this = this;
        this.connectedUserSubscription = this.authService.getConnectedUserObservable().subscribe(function (user) {
            console.log('getConnectedUser');
            _this.onUserObtained(user);
        });
    };
    AvailableMeetingsComponent.prototype.onUserObtained = function (user) {
        console.log('onUserObtained, user : ', user);
        if (user) {
            this.user = Observable.of(user);
            if (user instanceof Coach) {
                // coach
                console.log('get a coach');
                this.getAvailableMeetings();
                this.getBookedMeetings(user.id);
            }
        }
    };
    AvailableMeetingsComponent.prototype.getAvailableMeetings = function () {
        var _this = this;
        this.getAllMeetingsSubscription = this.meetingService.getAvailableMeetings().subscribe(function (meetings) {
            console.log('got getAllMeetings', meetings);
            _this.availableMeetings = Observable.of(meetings);
            _this.hasAvailableMeetings = (meetings != null && meetings.length > 0);
            _this.loading = false;
            _this.cd.detectChanges();
        });
    };
    AvailableMeetingsComponent.prototype.getBookedMeetings = function (coachId) {
        var _this = this;
        this.loading = true;
        this.getBookedMeetingsSubscription = this.meetingService.getAllMeetingsForCoachId(coachId)
            .subscribe(function (meetings) {
            console.log('got meetings for coachee', meetings);
            _this.onMeetingsObtained(meetings);
        }, function (error) {
            console.log('got meetings for coachee ERROR', error);
            _this.loading = false;
        });
    };
    AvailableMeetingsComponent.prototype.onMeetingsObtained = function (meetings) {
        console.log('got meetings for coachee', meetings);
        this.getAgreedMeetings(meetings);
        this.loading = false;
        this.cd.detectChanges();
    };
    AvailableMeetingsComponent.prototype.getAgreedMeetings = function (meetings) {
        console.log('getAgreedMeetings');
        if (meetings) {
            this.bookedMeetings = new Array();
            for (var _i = 0, meetings_1 = meetings; _i < meetings_1.length; _i++) {
                var meeting = meetings_1[_i];
                if (meeting.isOpen && meeting.coach) {
                    console.log('getAgreedMeetings, add open meeting', meeting);
                    this.bookedMeetings.push(meeting);
                }
            }
        }
    };
    AvailableMeetingsComponent.prototype.confirmPotentialDate = function (meetingId) {
        var _this = this;
        console.log('confirmPotentialDate : ', meetingId);
        var minDate = new Date(this.selectedDate);
        minDate.setHours(this.selectedHour);
        var maxDate = new Date(this.selectedDate);
        maxDate.setHours(this.selectedHour + 1);
        var timestampMin = +minDate.valueOf();
        var timestampMax = +maxDate.valueOf();
        var newDate = new MeetingDate();
        newDate.start_date = timestampMin;
        newDate.end_date = timestampMax;
        // create new date TODO :date could be set directly
        return this.meetingService.addPotentialDateToMeeting(meetingId, newDate)
            .flatMap(function (meetingDate) {
            console.log('test, onSubmitValidateMeeting 3');
            console.log('addPotentialDateToMeeting, meetingDate : ', meetingDate);
            // validate date
            return _this.meetingService.setFinalDateToMeeting(meetingId, meetingDate.id);
        });
    };
    AvailableMeetingsComponent.prototype.onSubmitValidateMeeting = function () {
        var _this = this;
        console.log('onSubmitValidateMeeting');
        this.user
            .take(1)
            .flatMap(function (user) {
            console.log('test, onSubmitValidateMeeting 1');
            return _this.meetingService.associateCoachToMeeting(_this.selectedMeeting.id, user.id);
        }).flatMap(function (meeting) {
            console.log('on meeting associated : ', meeting);
            console.log('test, onSubmitValidateMeeting 2');
            return _this.confirmPotentialDate(meeting.id);
        }).subscribe(function (meeting) {
            console.log('on meeting associated : ', meeting);
            console.log('test, onSubmitValidateMeeting 4');
            _this.coachValidateModalVisibility(false);
            // navigate to dashboard
            _this.router.navigate(['dashboard/meetings']);
            _this.cd.detectChanges();
        }, function (error) {
            console.log('get potentials dates error', error);
            Materialize.toast('Erreur lors de la validation du meeting', 3000, 'rounded');
        });
    };
    AvailableMeetingsComponent.prototype.coachValidateModalVisibility = function (isVisible) {
        if (isVisible) {
            $('#coach_cancel_meeting').openModal();
        }
        else {
            $('#coach_cancel_meeting').closeModal();
        }
    };
    AvailableMeetingsComponent.prototype.openCoachValidateMeetingModal = function ($event) {
        this.selectedMeeting = $event.meeting;
        this.selectedDate = $event.selectedDate;
        this.selectedHour = $event.selectedHour;
        this.coachValidateModalVisibility(true);
    };
    AvailableMeetingsComponent.prototype.cancelCoachValidateMeeting = function () {
        this.coachValidateModalVisibility(false);
    };
    AvailableMeetingsComponent = __decorate([
        Component({
            selector: 'er-available-meetings',
            templateUrl: './available-meetings.component.html',
            styleUrls: ['./available-meetings.component.scss']
        }),
        __metadata("design:paramtypes", [AuthService, MeetingsService, ChangeDetectorRef, Router])
    ], AvailableMeetingsComponent);
    return AvailableMeetingsComponent;
}());
export { AvailableMeetingsComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/meeting/meeting-list/coach/available-meetings/available-meetings.component.js.map