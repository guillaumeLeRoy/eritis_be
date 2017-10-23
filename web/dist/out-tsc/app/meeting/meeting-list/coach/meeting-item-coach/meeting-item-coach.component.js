var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { Meeting } from '../../../../model/Meeting';
import { Observable } from 'rxjs';
import { MeetingsService } from '../../../../service/meetings.service';
import { AuthService } from '../../../../service/auth.service';
import { Router } from '@angular/router';
import { Utils } from '../../../../utils/Utils';
var MeetingItemCoachComponent = (function () {
    function MeetingItemCoachComponent(authService, meetingService, cd, router) {
        this.authService = authService;
        this.meetingService = meetingService;
        this.cd = cd;
        this.router = router;
        this.isAdmin = false;
        this.onValidateDateBtnClickEmitter = new EventEmitter();
        this.cancelMeetingBtnClickEmitter = new EventEmitter();
        this.onCloseMeetingBtnClickEmitter = new EventEmitter();
        this.months = ['Jan', 'Feb', 'Mar', 'Avr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        this.showDetails = false;
        this.selectedDate = '0';
        this.selectedHour = 0;
        $('select').material_select();
    }
    MeetingItemCoachComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
        this.onRefreshRequested();
        this.coachee = this.meeting.coachee;
        $('select').material_select();
    };
    MeetingItemCoachComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
        this.getGoal();
        this.getContext();
        this.getReviewValue();
        this.getReviewNextStep();
        this.getSessionReviewTypeRate();
        this.loadMeetingPotentialTimes();
        this.loadPotentialDays();
        $('select').material_select();
    };
    MeetingItemCoachComponent.prototype.ngOnDestroy = function () {
        console.log('ngOnDestroy');
        if (this.mSessionReviewSubscription != null) {
            this.mSessionReviewSubscription.unsubscribe();
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
        if (this.connectedUserSubscription != null) {
            this.connectedUserSubscription.unsubscribe();
        }
    };
    MeetingItemCoachComponent.prototype.onRefreshRequested = function () {
        var _this = this;
        var user = this.authService.getConnectedUser();
        console.log('onRefreshRequested, user : ', user);
        if (user == null) {
            this.connectedUserSubscription = this.authService.getConnectedUserObservable()
                .subscribe(function (user) {
                console.log('onRefreshRequested, getConnectedUser');
                _this.onUserObtained(user);
            });
        }
        else {
            this.onUserObtained(user);
        }
    };
    MeetingItemCoachComponent.prototype.onUserObtained = function (user) {
        console.log('onUserObtained, user : ', user);
        if (user) {
            this.user = Observable.of(user);
            this.cd.detectChanges();
        }
    };
    MeetingItemCoachComponent.prototype.loadMeetingPotentialTimes = function () {
        var _this = this;
        this.mSessionPotentialTimesSubscription = this.meetingService.getMeetingPotentialTimes(this.meeting.id, this.isAdmin)
            .subscribe(function (dates) {
            console.log('potential dates obtained, ', dates);
            if (dates != null) {
                dates.sort(function (a, b) {
                    var d1 = new Date(a.start_date);
                    var d2 = new Date(b.start_date);
                    var res = d1.getUTCFullYear() - d2.getUTCFullYear();
                    if (res === 0)
                        res = d1.getUTCMonth() - d2.getUTCMonth();
                    if (res === 0)
                        res = d1.getUTCDate() - d2.getUTCDate();
                    if (res === 0)
                        res = d1.getUTCHours() - d2.getUTCHours();
                    return res;
                });
            }
            _this.potentialDatesArray = dates;
            _this.potentialDates = Observable.of(dates);
            _this.cd.detectChanges();
            _this.loadPotentialDays();
        }, function (error) {
            console.log('get potentials dates error', error);
        });
    };
    MeetingItemCoachComponent.prototype.onCloseMeetingBtnClick = function () {
        this.onCloseMeetingBtnClickEmitter.emit(this.meeting.id);
    };
    MeetingItemCoachComponent.prototype.getGoal = function () {
        var _this = this;
        this.loading = true;
        this.mSessionGoalSubscription = this.meetingService.getMeetingGoal(this.meeting.id, this.isAdmin).subscribe(function (reviews) {
            console.log('getMeetingGoal, got goal : ', reviews);
            if (reviews != null)
                _this.goal = Observable.of(reviews[0].value);
            else
                _this.goal = null;
            _this.cd.detectChanges();
            _this.hasGoal = (_this.goal != null);
            _this.loading = false;
        }, function (error) {
            console.log('getMeetingGoal error', error);
            // this.displayErrorPostingReview = true;
        });
    };
    MeetingItemCoachComponent.prototype.getContext = function () {
        var _this = this;
        this.loading = true;
        this.mSessionContextSubscription = this.meetingService.getMeetingContext(this.meeting.id, this.isAdmin).subscribe(function (reviews) {
            console.log('getMeetingContext, got context : ', reviews);
            if (reviews != null)
                _this.context = Observable.of(reviews[0].value);
            else
                _this.context = Observable.of('n/a');
            _this.loading = false;
            _this.cd.detectChanges();
        }, function (error) {
            console.log('getMeetingContext error', error);
            // this.displayErrorPostingReview = true;
        });
    };
    MeetingItemCoachComponent.prototype.getReviewValue = function () {
        var _this = this;
        this.loading = true;
        this.mSessionReviewSubscription = this.meetingService.getSessionReviewUtility(this.meeting.id, this.isAdmin)
            .subscribe(function (reviews) {
            console.log('getMeetingValue, got goal : ', reviews);
            if (reviews != null)
                _this.reviewValue = reviews[0].value;
            else
                _this.reviewValue = null;
            _this.cd.detectChanges();
            _this.hasValue = (_this.reviewValue != null);
            _this.loading = false;
        }, function (error) {
            console.log('getMeetingValue error', error);
            //this.displayErrorPostingReview = true;
        });
    };
    MeetingItemCoachComponent.prototype.getReviewNextStep = function () {
        var _this = this;
        this.loading = true;
        this.mSessionReviewResultSubscription = this.meetingService.getSessionReviewResult(this.meeting.id, this.isAdmin)
            .subscribe(function (reviews) {
            console.log('getMeetingNextStep, : ', reviews);
            if (reviews != null)
                _this.reviewNextStep = reviews[0].value;
            else
                _this.reviewNextStep = null;
            _this.cd.detectChanges();
            _this.hasNextStep = (_this.reviewNextStep != null);
            _this.loading = false;
        }, function (error) {
            console.log('getMeetingNextStep error', error);
            //this.displayErrorPostingReview = true;
        });
    };
    MeetingItemCoachComponent.prototype.getSessionReviewTypeRate = function () {
        var _this = this;
        this.loading = true;
        this.mSessionReviewRateSubscription = this.meetingService.getSessionReviewRate(this.meeting.id, this.isAdmin)
            .subscribe(function (reviews) {
            console.log('getSessionReviewTypeRate, got rate : ', reviews);
            if (reviews != null)
                _this.sessionRate = reviews[0].value;
            else
                _this.sessionRate = null;
            _this.cd.detectChanges();
            _this.hasRate = (_this.sessionRate != null);
            _this.loading = false;
        }, function (error) {
            console.log('getSessionReviewTypeRate error', error);
            // this.displayErrorPostingReview = true;
        });
    };
    MeetingItemCoachComponent.prototype.loadPotentialDays = function () {
        console.log('loadPotentialDays');
        var days = new Array();
        if (this.potentialDatesArray != null) {
            for (var _i = 0, _a = this.potentialDatesArray; _i < _a.length; _i++) {
                var date = _a[_i];
                var d = new Date(date.start_date);
                // remove hours and minute
                d.setHours(0);
                d.setMinutes(0);
                // avoid duplicates
                if (days.indexOf(d.toString()) < 0 && this.isDateFuture(d))
                    days.push(d.toString());
            }
        }
        this.potentialDays = Observable.of(days);
        this.cd.detectChanges();
        console.log('potentialDays', days);
    };
    MeetingItemCoachComponent.prototype.loadPotentialHours = function (selected) {
        console.log('loadPotentialHours', selected);
        var hours = [];
        for (var _i = 0, _a = this.potentialDatesArray; _i < _a.length; _i++) {
            var date = _a[_i];
            // TODO could be improved
            if (Utils.getDayAndMonthFromTimestamp(date.start_date) === Utils.getDate(selected)) {
                for (var _h = Utils.getHoursFromTimestamp(date.start_date); _h < Utils.getHoursFromTimestamp(date.end_date); _h++) {
                    if (this.isTimeslotFree(new Date(date.start_date), _h))
                        hours.push(_h);
                }
            }
        }
        this.potentialHours = Observable.of(hours);
        this.cd.detectChanges();
        console.log('potentialHours', hours);
    };
    MeetingItemCoachComponent.prototype.timestampToString = function (timestamp) {
        return Utils.timestampToString(timestamp);
    };
    MeetingItemCoachComponent.prototype.hoursAndMinutesFromTimestamp = function (timestamp) {
        return Utils.getHoursAndMinutesFromTimestamp(timestamp);
    };
    MeetingItemCoachComponent.prototype.timeIntToString = function (hour) {
        return Utils.timeIntToString(hour);
    };
    MeetingItemCoachComponent.prototype.goToCoacheeProfile = function (coacheeId) {
        if (this.isAdmin)
            this.router.navigate(['admin/profile/coachee', coacheeId]);
        else
            this.router.navigate(['dashboard/profile_coachee', coacheeId]);
    };
    MeetingItemCoachComponent.prototype.onValidateDateClick = function () {
        this.onValidateDateBtnClickEmitter.emit({
            selectedDate: this.selectedDate,
            selectedHour: this.selectedHour,
            meeting: this.meeting
        });
    };
    // Return true if the date is not past yet
    MeetingItemCoachComponent.prototype.isDateFuture = function (date) {
        var now = new Date();
        return date > now;
    };
    // Return false if coach has already an agreed meeting for this timeslot
    MeetingItemCoachComponent.prototype.isTimeslotFree = function (date, h) {
        if (this.bookedMeetings) {
            for (var _i = 0, _a = this.bookedMeetings; _i < _a.length; _i++) {
                var meeting = _a[_i];
                if (Utils.sameDay(date, new Date(meeting.agreed_date.start_date)) && Utils.sameHour(new Date(meeting.agreed_date.start_date), h))
                    return false;
            }
        }
        return true;
    };
    // Return true if the session started
    MeetingItemCoachComponent.prototype.isStarted = function () {
        if (this.meeting) {
            return (new Date()) > (new Date(this.meeting.agreed_date.start_date));
        }
        return false;
    };
    __decorate([
        Input(),
        __metadata("design:type", Meeting)
    ], MeetingItemCoachComponent.prototype, "meeting", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Array)
    ], MeetingItemCoachComponent.prototype, "bookedMeetings", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], MeetingItemCoachComponent.prototype, "isAdmin", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], MeetingItemCoachComponent.prototype, "onValidateDateBtnClickEmitter", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], MeetingItemCoachComponent.prototype, "cancelMeetingBtnClickEmitter", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], MeetingItemCoachComponent.prototype, "onCloseMeetingBtnClickEmitter", void 0);
    MeetingItemCoachComponent = __decorate([
        Component({
            selector: 'er-meeting-item-coach',
            templateUrl: './meeting-item-coach.component.html',
            styleUrls: ['./meeting-item-coach.component.scss']
        }),
        __metadata("design:paramtypes", [AuthService, MeetingsService, ChangeDetectorRef, Router])
    ], MeetingItemCoachComponent);
    return MeetingItemCoachComponent;
}());
export { MeetingItemCoachComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/meeting/meeting-list/coach/meeting-item-coach/meeting-item-coach.component.js.map