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
import { Utils } from "../../../../utils/Utils";
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
    MeetingItemCoacheeComponent.prototype.ngOnDestroy = function () {
        console.log("ngOnDestroy");
        if (this.mSessionReviewUtilitySubscription != null) {
            this.mSessionReviewUtilitySubscription.unsubscribe();
        }
        if (this.mSessionReviewResultSubscription != null) {
            this.mSessionReviewResultSubscription.unsubscribe();
        }
        if (this.mSessionReviewRateSubscription != null) {
            this.mSessionReviewRateSubscription.unsubscribe();
        }
        if (this.mSessionContextSubscription != null) {
            this.mSessionContextSubscription.unsubscribe();
        }
        if (this.mSessionGoalSubscription != null) {
            this.mSessionGoalSubscription.unsubscribe();
        }
        if (this.mSessionPotentialTimesSubscription != null) {
            this.mSessionPotentialTimesSubscription.unsubscribe();
        }
    };
    MeetingItemCoacheeComponent.prototype.timestampToString = function (timestamp) {
        return Utils.timestampToString(timestamp);
    };
    MeetingItemCoacheeComponent.prototype.hoursAndMinutesFromTimestamp = function (timestamp) {
        return Utils.getHoursAndMinutesFromTimestamp(timestamp);
    };
    MeetingItemCoacheeComponent.prototype.getDate = function (date) {
        return (new Date(date)).getDate() + ' ' + this.months[(new Date(date)).getMonth()];
    };
    MeetingItemCoacheeComponent.prototype.getSessionCoachReview = function () {
        this.getSessionReviewTypeResult();
        this.getSessionReviewTypeUtility();
        this.getSessionReviewTypeRate();
    };
    MeetingItemCoacheeComponent.prototype.loadMeetingPotentialTimes = function () {
        var _this = this;
        this.loading = true;
        this.mSessionPotentialTimesSubscription = this.meetingService.getMeetingPotentialTimes(this.meeting.id, this.isAdmin).subscribe(function (dates) {
            console.log("potential dates obtained, ", dates);
            _this.potentialDates = Observable.of(dates);
            _this.cd.detectChanges();
            _this.loading = false;
        }, function (error) {
            console.log('get potentials dates error', error);
        });
    };
    MeetingItemCoacheeComponent.prototype.getGoal = function () {
        var _this = this;
        this.loading = true;
        this.mSessionGoalSubscription = this.meetingService.getMeetingGoal(this.meeting.id, this.isAdmin).subscribe(function (reviews) {
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
        this.mSessionContextSubscription = this.meetingService.getMeetingContext(this.meeting.id, this.isAdmin).subscribe(function (reviews) {
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
        this.mSessionReviewResultSubscription = this.meetingService.getSessionReviewResult(this.meeting.id, this.isAdmin).subscribe(function (reviews) {
            console.log("getSessionReviewTypeResult, got result : ", reviews);
            if (reviews != null) {
                _this.sessionResult = reviews[0].value;
            }
            else {
                _this.sessionResult = null;
            }
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
        this.mSessionReviewUtilitySubscription = this.meetingService.getSessionReviewUtility(this.meeting.id, this.isAdmin).subscribe(function (reviews) {
            console.log("getSessionReviewTypeUtility, got goal : ", reviews);
            if (reviews != null) {
                _this.sessionUtility = reviews[0].value;
            }
            else {
                _this.sessionUtility = null;
            }
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
        this.mSessionReviewRateSubscription = this.meetingService.getSessionReviewRate(this.meeting.id, this.isAdmin).subscribe(function (reviews) {
            console.log("getSessionReviewTypeRate, got rate : ", reviews);
            if (reviews != null) {
                _this.sessionRate = reviews[0].value;
            }
            else {
                _this.sessionRate = null;
            }
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
        this.router.navigate(['dashboard/date', meetingId]);
    };
    MeetingItemCoacheeComponent.prototype.openModal = function () {
        this.cancelMeetingTimeEvent.emit(this.meeting); //TODO to improve
        // $('#deleteModal').openModal();
    };
    MeetingItemCoacheeComponent.prototype.goToChatRoom = function () {
        console.log('goToChatRoom');
        window.open(this.meeting.coach.chat_room_url, "_blank");
    };
    MeetingItemCoacheeComponent.prototype.goToCoachProfile = function (coachId) {
        window.scrollTo(0, 0);
        if (this.isAdmin)
            this.router.navigate(['admin/profile/coach', coachId]);
        else
            this.router.navigate(['dashboard/profile_coach', coachId]);
    };
    MeetingItemCoacheeComponent.prototype.rateSession = function () {
        console.log('rateSession');
        this.onRateSessionBtnClickedEmitter.emit(this.meeting.id);
    };
    __decorate([
        Input(),
        __metadata("design:type", Meeting)
    ], MeetingItemCoacheeComponent.prototype, "meeting", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], MeetingItemCoacheeComponent.prototype, "isAdmin", void 0);
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
            selector: 'er-meeting-item-coachee',
            templateUrl: './meeting-item-coachee.component.html',
            styleUrls: ['./meeting-item-coachee.component.scss'],
        }),
        __metadata("design:paramtypes", [Router, MeetingsService, ChangeDetectorRef])
    ], MeetingItemCoacheeComponent);
    return MeetingItemCoacheeComponent;
}());
export { MeetingItemCoacheeComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/meeting/meeting-list/coachee/meeting-item-coachee/meeting-item-coachee.component.js.map