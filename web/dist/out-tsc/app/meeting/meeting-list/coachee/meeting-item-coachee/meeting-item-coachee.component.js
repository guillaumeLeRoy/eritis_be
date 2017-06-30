var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from "@angular/core";
import { Meeting } from "../../../../model/Meeting";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { MeetingsService } from "../../../../service/meetings.service";
var MeetingItemCoacheeComponent = (function () {
    function MeetingItemCoacheeComponent(router, meetingService, cd) {
        this.router = router;
        this.meetingService = meetingService;
        this.cd = cd;
        // @Output()
        // onMeetingCancelled = new EventEmitter<any>();
        this.cancelMeetingTimeEvent = new EventEmitter();
        this.onRateSessionBtnClickedEmitter = new EventEmitter();
        this.months = ['Jan', 'Feb', 'Mar', 'Avr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }
    MeetingItemCoacheeComponent.prototype.ngOnInit = function () {
        this.coach = this.meeting.coach;
        console.log("ngOnInit, coach : ", this.coach);
        this.loadMeetingPotentialTimes();
        this.getGoal();
        this.getContext();
        this.getSessionCoachReview();
    };
    // onPreMeetingReviewPosted(meeting: Meeting) {
    //   console.log("onPreMeetingReviewPosted");
    //   this.getReview();
    // }
    //
    // onPotentialDatePosted(date: MeetingDate) {
    //   console.log("onPotentialDatePosted");
    //   this.potentialDatePosted.emit(date);
    // }
    MeetingItemCoacheeComponent.prototype.loadMeetingPotentialTimes = function () {
        var _this = this;
        this.loading = true;
        this.meetingService.getMeetingPotentialTimes(this.meeting.id).subscribe(function (dates) {
            console.log("potential dates obtained, ", dates);
            _this.potentialDates = Observable.of(dates);
            _this.cd.detectChanges();
            _this.loading = false;
        }, function (error) {
            console.log('get potentials dates error', error);
        });
    };
    MeetingItemCoacheeComponent.prototype.printTimeString = function (date) {
        return this.getHours(date) + ':' + this.getMinutes(date);
    };
    MeetingItemCoacheeComponent.prototype.getHours = function (date) {
        return (new Date(date)).getHours();
    };
    MeetingItemCoacheeComponent.prototype.getMinutes = function (date) {
        var m = (new Date(date)).getMinutes();
        if (m === 0)
            return '00';
        return m;
    };
    MeetingItemCoacheeComponent.prototype.getDate = function (date) {
        return (new Date(date)).getDate() + ' ' + this.months[(new Date(date)).getMonth()];
    };
    MeetingItemCoacheeComponent.prototype.getSessionCoachReview = function () {
        this.getSessionReviewTypeResult();
        this.getSessionReviewTypeUtility();
        this.getSessionReviewTypeRate();
    };
    MeetingItemCoacheeComponent.prototype.getGoal = function () {
        var _this = this;
        this.loading = true;
        this.meetingService.getMeetingGoal(this.meeting.id).subscribe(function (reviews) {
            console.log("getMeetingGoal, got goal : ", reviews);
            if (reviews != null) {
                _this.hasGoal = true;
                _this.goal = Observable.of(reviews[0].value);
            }
            else {
                _this.hasGoal = false;
                _this.goal = null;
            }
            _this.cd.detectChanges();
            _this.loading = false;
        }, function (error) {
            console.log('getMeetingGoal error', error);
            //this.displayErrorPostingReview = true;
        });
    };
    MeetingItemCoacheeComponent.prototype.getContext = function () {
        var _this = this;
        this.loading = true;
        this.meetingService.getMeetingContext(this.meeting.id).subscribe(function (reviews) {
            console.log("getMeetingContext, got context : ", reviews);
            if (reviews != null) {
                _this.hasContext = true;
                _this.context = Observable.of(reviews[0].value);
            }
            else {
                _this.hasContext = false;
                _this.context = null;
            }
            _this.loading = false;
            _this.cd.detectChanges();
        }, function (error) {
            console.log('getMeetingContext error', error);
            //this.displayErrorPostingReview = true;
        });
    };
    MeetingItemCoacheeComponent.prototype.getSessionReviewTypeResult = function () {
        var _this = this;
        this.loading = true;
        this.meetingService.getSessionReviewResult(this.meeting.id).subscribe(function (reviews) {
            console.log("getSessionReviewTypeResult, got result : ", reviews);
            if (reviews != null)
                _this.sessionResult = reviews[0].value;
            else
                _this.sessionResult = null;
            _this.cd.detectChanges();
            _this.hasSessionResult = (_this.sessionResult != null);
            _this.loading = false;
        }, function (error) {
            console.log('getReviewResult error', error);
            //this.displayErrorPostingReview = true;
        });
    };
    MeetingItemCoacheeComponent.prototype.getSessionReviewTypeUtility = function () {
        var _this = this;
        this.loading = true;
        this.meetingService.getSessionReviewUtility(this.meeting.id).subscribe(function (reviews) {
            console.log("getSessionReviewTypeUtility, got goal : ", reviews);
            if (reviews != null)
                _this.sessionUtility = reviews[0].value;
            else
                _this.sessionUtility = null;
            _this.cd.detectChanges();
            _this.hasSessionUtility = (_this.sessionUtility != null);
            _this.loading = false;
        }, function (error) {
            console.log('getSessionReviewTypeUtility error', error);
            //this.displayErrorPostingReview = true;
        });
    };
    MeetingItemCoacheeComponent.prototype.getSessionReviewTypeRate = function () {
        var _this = this;
        this.loading = true;
        this.meetingService.getSessionReviewRate(this.meeting.id).subscribe(function (reviews) {
            console.log("getSessionReviewTypeRate, got rate : ", reviews);
            if (reviews != null)
                _this.sessionRate = reviews[0].value;
            else
                _this.sessionRate = null;
            _this.cd.detectChanges();
            _this.hasRate = (_this.sessionRate != null);
            _this.loading = false;
        }, function (error) {
            console.log('getSessionReviewTypeRate error', error);
            //this.displayErrorPostingReview = true;
        });
    };
    MeetingItemCoacheeComponent.prototype.goToModifyDate = function (meetingId) {
        window.scrollTo(0, 0);
        this.router.navigate(['/date', meetingId]);
    };
    MeetingItemCoacheeComponent.prototype.openModal = function () {
        this.cancelMeetingTimeEvent.emit(this.meeting); //TODO to improve
        // $('#deleteModal').openModal();
    };
    MeetingItemCoacheeComponent.prototype.goToChatRoom = function () {
        console.log('goToChatRoom');
        var win = window.open(this.meeting.coach.chat_room_url, "_blank");
    };
    MeetingItemCoacheeComponent.prototype.goToCoachProfile = function (coachId) {
        window.scrollTo(0, 0);
        this.router.navigate(['/profile_coach', coachId]);
    };
    MeetingItemCoacheeComponent.prototype.rateSession = function () {
        console.log('rateSession');
        this.onRateSessionBtnClickedEmitter.emit(this.meeting.id);
    };
    return MeetingItemCoacheeComponent;
}());
__decorate([
    Input(),
    __metadata("design:type", Meeting)
], MeetingItemCoacheeComponent.prototype, "meeting", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], MeetingItemCoacheeComponent.prototype, "cancelMeetingTimeEvent", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], MeetingItemCoacheeComponent.prototype, "onRateSessionBtnClickedEmitter", void 0);
MeetingItemCoacheeComponent = __decorate([
    Component({
        selector: 'rb-meeting-item-coachee',
        templateUrl: './meeting-item-coachee.component.html',
        styleUrls: ['./meeting-item-coachee.component.scss'],
    }),
    __metadata("design:paramtypes", [Router, MeetingsService, ChangeDetectorRef])
], MeetingItemCoacheeComponent);
export { MeetingItemCoacheeComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/meeting/meeting-list/coachee/meeting-item-coachee/meeting-item-coachee.component.js.map