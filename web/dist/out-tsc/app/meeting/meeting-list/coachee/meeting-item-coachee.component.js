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
import { Meeting } from "../../../model/Meeting";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { MeetingsService } from "../../../service/meetings.service";
var MeetingItemCoacheeComponent = (function () {
    function MeetingItemCoacheeComponent(router, meetingService, cd) {
        this.router = router;
        this.meetingService = meetingService;
        this.cd = cd;
        // @Output()
        // onMeetingCancelled = new EventEmitter<any>();
        this.cancelMeetingTimeEvent = new EventEmitter();
        this.months = ['Jan', 'Feb', 'Mar', 'Avr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }
    MeetingItemCoacheeComponent.prototype.ngOnInit = function () {
        this.coach = this.meeting.coach;
        console.log("ngOnInit, coach : ", this.coach);
        this.loadMeetingPotentialTimes();
        this.getGoal();
        this.getReview();
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
    MeetingItemCoacheeComponent.prototype.getGoal = function () {
        var _this = this;
        this.loading = true;
        this.meetingService.getMeetingGoal(this.meeting.id).subscribe(function (reviews) {
            console.log("getMeetingGoal, got goal : ", reviews);
            if (reviews != null)
                _this.goal = reviews[0].comment;
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
    MeetingItemCoacheeComponent.prototype.getReviewValue = function () {
        var _this = this;
        this.loading = true;
        this.meetingService.getMeetingValue(this.meeting.id).subscribe(function (reviews) {
            console.log("getMeetingValue, got goal : ", reviews);
            if (reviews != null)
                _this.reviewValue = reviews[0].comment;
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
    MeetingItemCoacheeComponent.prototype.getReviewNextStep = function () {
        var _this = this;
        this.loading = true;
        this.meetingService.getMeetingNextStep(this.meeting.id).subscribe(function (reviews) {
            console.log("getMeetingNextStep, got goal : ", reviews);
            if (reviews != null)
                _this.reviewNextStep = reviews[0].comment;
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
    MeetingItemCoacheeComponent.prototype.getReview = function () {
        this.getReviewValue();
        this.getReviewNextStep();
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
MeetingItemCoacheeComponent = __decorate([
    Component({
        selector: 'rb-meeting-item-coachee',
        templateUrl: 'meeting-item-coachee.component.html',
        styleUrls: ['meeting-item-coachee.component.css'],
    }),
    __metadata("design:paramtypes", [Router, MeetingsService, ChangeDetectorRef])
], MeetingItemCoacheeComponent);
export { MeetingItemCoacheeComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/meeting/meeting-list/coachee/meeting-item-coachee.component.js.map