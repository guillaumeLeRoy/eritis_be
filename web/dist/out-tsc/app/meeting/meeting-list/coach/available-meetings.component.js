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
import { Observable } from "rxjs/Observable";
import { MeetingsService } from "../../../service/meetings.service";
import { AuthService } from "../../../service/auth.service";
import { Coach } from "../../../model/Coach";
import { Router } from "@angular/router";
var AvailableMeetingsComponent = (function () {
    function AvailableMeetingsComponent(authService, meetingService, cd, router) {
        this.authService = authService;
        this.meetingService = meetingService;
        this.cd = cd;
        this.router = router;
        this.hasAvailableMeetings = false;
    }
    AvailableMeetingsComponent.prototype.ngOnInit = function () {
        this.onRefreshRequested();
    };
    AvailableMeetingsComponent.prototype.onRefreshRequested = function () {
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
    AvailableMeetingsComponent.prototype.onUserObtained = function (user) {
        console.log('onUserObtained, user : ', user);
        if (user) {
            if (user instanceof Coach) {
                // coach
                console.log('get a coach');
                this.getAllMeetings();
            }
            this.user = Observable.of(user);
            this.cd.detectChanges();
        }
    };
    AvailableMeetingsComponent.prototype.getAllMeetings = function () {
        var _this = this;
        this.meetingService.getAvailableMeetings().subscribe(function (meetings) {
            console.log('got getAllMeetings', meetings);
            _this.availableMeetings = Observable.of(meetings);
            if (meetings != null && meetings.length > 0)
                _this.hasAvailableMeetings = true;
            _this.cd.detectChanges();
        });
    };
    AvailableMeetingsComponent.prototype.onSelectMeetingBtnClicked = function (meeting) {
        var _this = this;
        this.user.take(1).subscribe(function (user) {
            _this.meetingService.associateCoachToMeeting(meeting.id, user.id).subscribe(function (meeting) {
                console.log('on meeting associated : ', meeting);
                //navigate to dashboard
                _this.router.navigate(['/meetings']);
            });
        });
    };
    AvailableMeetingsComponent.prototype.confirmPotentialDate = function (meetingId) {
        var _this = this;
        var minDate = new Date(this.selectedDate);
        minDate.setHours(this.selectedHour);
        var maxDate = new Date(this.selectedDate);
        maxDate.setHours(this.selectedHour + 1);
        var timestampMin = +minDate.getTime().toFixed(0) / 1000;
        var timestampMax = +maxDate.getTime().toFixed(0) / 1000;
        // create new date
        this.meetingService.addPotentialDateToMeeting(meetingId, timestampMin, timestampMax).subscribe(function (meetingDate) {
            console.log('addPotentialDateToMeeting, meetingDate : ', meetingDate);
            // validate date
            _this.meetingService.setFinalDateToMeeting(meetingId, meetingDate.id).subscribe(function (meeting) {
                console.log("confirmPotentialDate, response", meeting);
                _this.onRefreshRequested();
                Materialize.toast('Meeting validé !', 3000, 'rounded');
            }, function (error) {
                console.log('get potentials dates error', error);
                Materialize.toast('Erreur lors de la validation du meeting', 3000, 'rounded');
            });
        }, function (error) {
            console.log('addPotentialDateToMeeting error', error);
        });
    };
    AvailableMeetingsComponent.prototype.onSubmitValidateMeeting = function () {
        var _this = this;
        this.user.take(1).subscribe(function (user) {
            _this.meetingService.associateCoachToMeeting(_this.selectedMeeting.id, user.id).subscribe(function (meeting) {
                console.log('on meeting associated : ', meeting);
                //navigate to dashboard
                _this.confirmPotentialDate(meeting.id);
                _this.coachValidateModalVisibility(false);
            });
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
    return AvailableMeetingsComponent;
}());
AvailableMeetingsComponent = __decorate([
    Component({
        selector: 'er-available-meetings',
        templateUrl: './available-meetings.component.html',
        styleUrls: ['./available-meetings.component.css']
    }),
    __metadata("design:paramtypes", [AuthService, MeetingsService, ChangeDetectorRef, Router])
], AvailableMeetingsComponent);
export { AvailableMeetingsComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/meeting/meeting-list/coach/available-meetings.component.js.map