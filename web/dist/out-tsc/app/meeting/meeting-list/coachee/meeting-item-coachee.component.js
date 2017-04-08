var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { Meeting } from "../../../model/meeting";
import { CoachCoacheeService } from "../../../service/CoachCoacheeService";
import { Observable } from "rxjs";
var MeetingItemCoacheeComponent = (function () {
    function MeetingItemCoacheeComponent(coachCoacheeService, cd) {
        this.coachCoacheeService = coachCoacheeService;
        this.cd = cd;
        this.potentialDatePosted = new EventEmitter();
    }
    MeetingItemCoacheeComponent.prototype.ngOnInit = function () {
        this.coach = this.meeting.coach;
        console.log("ngOnInit, coach : ", this.coach);
        this.loadReview();
        this.loadMeetingPotentialTimes();
    };
    MeetingItemCoacheeComponent.prototype.onPreMeetingReviewPosted = function (meeting) {
        console.log("onPreMeetingReviewPosted");
        this.loadReview();
    };
    MeetingItemCoacheeComponent.prototype.onPotentialDatePosted = function (date) {
        console.log("onPotentialDatePosted");
        this.potentialDatePosted.emit(date);
    };
    MeetingItemCoacheeComponent.prototype.loadReview = function () {
        var _this = this;
        console.log("loadReview");
        this.coachCoacheeService.getMeetingReviews(this.meeting.id).subscribe(function (reviews) {
            console.log("loadReview, reviews obtained");
            _this.hasSomeReviews = Observable.of(reviews != null);
            _this.reviews = Observable.of(reviews);
            _this.cd.detectChanges();
        }, function (error) {
            console.log('loadReview error', error);
        });
    };
    MeetingItemCoacheeComponent.prototype.loadMeetingPotentialTimes = function () {
        var _this = this;
        this.coachCoacheeService.getMeetingPotentialTimes(this.meeting.id).subscribe(function (dates) {
            console.log("potential dates obtained, ", dates);
            _this.potentialDates = Observable.of(dates);
            _this.cd.detectChanges();
        }, function (error) {
            console.log('get potentials dates error', error);
        });
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
], MeetingItemCoacheeComponent.prototype, "potentialDatePosted", void 0);
MeetingItemCoacheeComponent = __decorate([
    Component({
        selector: 'rb-meeting-item-coachee',
        templateUrl: 'meeting-item-coachee.component.html',
        styleUrls: ['meeting-item-coachee.component.css'],
    }),
    __metadata("design:paramtypes", [CoachCoacheeService, ChangeDetectorRef])
], MeetingItemCoacheeComponent);
export { MeetingItemCoacheeComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/meeting/meeting-list/coachee/meeting-item-coachee.component.js.map