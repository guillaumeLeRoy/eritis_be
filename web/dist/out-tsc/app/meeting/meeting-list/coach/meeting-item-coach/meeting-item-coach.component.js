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
import { MeetingsService } from "../../../../service/meetings.service";
import { AuthService } from "../../../../service/auth.service";
import { Router } from "@angular/router";
var MeetingItemCoachComponent = (function () {
    function MeetingItemCoachComponent(authService, meetingService, cd, router) {
        this.authService = authService;
        this.meetingService = meetingService;
        this.cd = cd;
        this.router = router;
        this.onValidateDateBtnClick = new EventEmitter();
        // @Output()
        // dateRemoved = new EventEmitter();
        this.cancelMeetingTimeEvent = new EventEmitter();
        this.onCloseMeetingBtnClickEmitter = new EventEmitter();
        this.months = ['Jan', 'Feb', 'Mar', 'Avr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        this.showDetails = false;
        this.selectedDate = '0';
        this.selectedHour = 0;
        $('select').material_select();
    }
    MeetingItemCoachComponent.prototype.ngOnInit = function () {
        console.log("ngOnInit, meeting : ", this.meeting);
        this.onRefreshRequested();
        this.coachee = this.meeting.coachee;
        $('select').material_select();
    };
    MeetingItemCoachComponent.prototype.ngAfterViewInit = function () {
        console.log("ngAfterViewInit");
        this.getGoal();
        this.getContext();
        this.getReviewValue();
        this.getReviewNextStep();
        this.loadMeetingPotentialTimes();
        this.loadPotentialDays();
        $('select').material_select();
    };
    MeetingItemCoachComponent.prototype.onRefreshRequested = function () {
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
    MeetingItemCoachComponent.prototype.onUserObtained = function (user) {
        console.log('onUserObtained, user : ', user);
        if (user) {
            this.user = Observable.of(user);
            this.cd.detectChanges();
        }
    };
    MeetingItemCoachComponent.prototype.loadMeetingPotentialTimes = function () {
        var _this = this;
        this.meetingService.getMeetingPotentialTimes(this.meeting.id).subscribe(function (dates) {
            console.log("potential dates obtained, ", dates);
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
        this.meetingService.getMeetingGoal(this.meeting.id).subscribe(function (reviews) {
            console.log("getMeetingGoal, got goal : ", reviews);
            if (reviews != null)
                _this.goal = Observable.of(reviews[0].value);
            else
                _this.goal = null;
            _this.cd.detectChanges();
            _this.hasGoal = (_this.goal != null);
            _this.loading = false;
        }, function (error) {
            console.log('getMeetingGoal error', error);
            //this.displayErrorPostingReview = true;
        });
    };
    MeetingItemCoachComponent.prototype.getContext = function () {
        var _this = this;
        this.loading = true;
        this.meetingService.getMeetingContext(this.meeting.id).subscribe(function (reviews) {
            console.log("getMeetingContext, got context : ", reviews);
            if (reviews != null)
                _this.context = Observable.of(reviews[0].value);
            else
                _this.context = Observable.of('n/a');
            _this.loading = false;
            _this.cd.detectChanges();
        }, function (error) {
            console.log('getMeetingContext error', error);
            //this.displayErrorPostingReview = true;
        });
    };
    MeetingItemCoachComponent.prototype.getReviewValue = function () {
        var _this = this;
        this.loading = true;
        this.meetingService.getSessionReviewUtility(this.meeting.id).subscribe(function (reviews) {
            console.log("getMeetingValue, got goal : ", reviews);
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
        this.meetingService.getSessionReviewResult(this.meeting.id).subscribe(function (reviews) {
            console.log("getMeetingNextStep, : ", reviews);
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
    MeetingItemCoachComponent.prototype.loadPotentialDays = function () {
        console.log("loadPotentialDays");
        var days = [];
        if (this.potentialDatesArray != null) {
            for (var _a = 0, _b = this.potentialDatesArray; _a < _b.length; _a++) {
                var date = _b[_a];
                var d = new Date(date.start_date);
                d.setHours(0);
                d.setMinutes(0);
                if (days.indexOf(d.toString()) < 0)
                    days.push(d.toString());
            }
        }
        this.potentialDays = Observable.of(days);
        this.cd.detectChanges();
        console.log("potentialDays", days);
    };
    MeetingItemCoachComponent.prototype.loadPotentialHours = function (selected) {
        console.log("loadPotentialHours", selected);
        var hours = [];
        for (var _a = 0, _b = this.potentialDatesArray; _a < _b.length; _a++) {
            var date = _b[_a];
            if (this.getDate(date.start_date) === this.getDate(selected)) {
                for (var _i = this.getHours(date.start_date); _i < this.getHours(date.end_date); _i++) {
                    hours.push(_i);
                }
            }
        }
        this.potentialHours = Observable.of(hours);
        this.cd.detectChanges();
        console.log("potentialHours", hours);
    };
    MeetingItemCoachComponent.prototype.printTimeNumber = function (hour) {
        return hour + ':00';
    };
    MeetingItemCoachComponent.prototype.printTimeString = function (date) {
        return this.getHours(date) + ':' + this.getMinutes(date);
    };
    MeetingItemCoachComponent.prototype.getHours = function (date) {
        return (new Date(date)).getHours();
    };
    MeetingItemCoachComponent.prototype.getMinutes = function (date) {
        var m = (new Date(date)).getMinutes();
        if (m === 0)
            return '00';
        return m;
    };
    MeetingItemCoachComponent.prototype.getDate = function (date) {
        return (new Date(date)).getDate() + ' ' + this.months[(new Date(date)).getMonth()];
    };
    MeetingItemCoachComponent.prototype.goToCoacheeProfile = function (coacheeId) {
        window.scrollTo(0, 0);
        this.router.navigate(['/profile_coachee', coacheeId]);
    };
    MeetingItemCoachComponent.prototype.onValidateDateClick = function () {
        this.onValidateDateBtnClick.emit({
            selectedDate: this.selectedDate,
            selectedHour: this.selectedHour,
            meeting: this.meeting
        });
    };
    return MeetingItemCoachComponent;
}());
__decorate([
    Input(),
    __metadata("design:type", Meeting)
], MeetingItemCoachComponent.prototype, "meeting", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], MeetingItemCoachComponent.prototype, "onValidateDateBtnClick", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], MeetingItemCoachComponent.prototype, "cancelMeetingTimeEvent", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], MeetingItemCoachComponent.prototype, "onCloseMeetingBtnClickEmitter", void 0);
MeetingItemCoachComponent = __decorate([
    Component({
        selector: 'rb-meeting-item-coach',
        templateUrl: './meeting-item-coach.component.html',
        styleUrls: ['./meeting-item-coach.component.scss']
    }),
    __metadata("design:paramtypes", [AuthService, MeetingsService, ChangeDetectorRef, Router])
], MeetingItemCoachComponent);
export { MeetingItemCoachComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/meeting/meeting-list/coach/meeting-item-coach/meeting-item-coach.component.js.map