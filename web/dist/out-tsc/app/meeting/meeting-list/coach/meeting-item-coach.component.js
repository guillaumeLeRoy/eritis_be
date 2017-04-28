var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { Meeting } from "../../../model/meeting";
import { Observable } from "rxjs";
import { FormBuilder, Validators } from "@angular/forms";
import { CoachCoacheeService } from "../../../service/CoachCoacheeService";
var MeetingItemCoachComponent = (function () {
    function MeetingItemCoachComponent(formBuilder, coachCoacheeService, cd) {
        this.formBuilder = formBuilder;
        this.coachCoacheeService = coachCoacheeService;
        this.cd = cd;
        this.meetingUpdated = new EventEmitter();
    }
    MeetingItemCoachComponent.prototype.ngOnInit = function () {
        console.log("ngOnInit, meeting : ", this.meeting);
        this.closeMeetingForm = this.formBuilder.group({
            recap: ["", Validators.required],
            score: ["", Validators.required]
        });
        this.coachee = this.meeting.coachee;
    };
    MeetingItemCoachComponent.prototype.ngAfterViewInit = function () {
        console.log("ngAfterViewInit");
        this.loadReviews();
        this.loadMeetingPotentialTimes();
    };
    MeetingItemCoachComponent.prototype.loadReviews = function () {
        var _this = this;
        this.coachCoacheeService.getMeetingReviews(this.meeting.id).subscribe(function (reviews) {
            console.log("reviews obtained, ", reviews);
            _this.hasSomeReviews = Observable.of(reviews != null);
            _this.reviews = Observable.of(reviews);
            _this.cd.detectChanges();
        }, function (error) {
            console.log('get reviews error', error);
        });
    };
    MeetingItemCoachComponent.prototype.loadMeetingPotentialTimes = function () {
        var _this = this;
        this.coachCoacheeService.getMeetingPotentialTimes(this.meeting.id).subscribe(function (dates) {
            console.log("potential dates obtained, ", dates);
            _this.potentialDates = Observable.of(dates);
            _this.cd.detectChanges();
        }, function (error) {
            console.log('get potentials dates error', error);
        });
    };
    MeetingItemCoachComponent.prototype.confirmPotentialDate = function (date) {
        var _this = this;
        this.coachCoacheeService.setFinalDateToMeeting(this.meeting.id, date.id).subscribe(function (meeting) {
            console.log("confirmPotentialDate, response", meeting);
            _this.meeting = meeting;
            _this.cd.detectChanges();
        }, function (error) {
            console.log('get potentials dates error', error);
        });
    };
    MeetingItemCoachComponent.prototype.submitCloseMeetingForm = function () {
        var _this = this;
        console.log("submitCloseMeetingForm form : ", this.closeMeetingForm.value);
        //TODO use score value
        this.coachCoacheeService.closeMeeting(this.meeting.id, this.closeMeetingForm.value.recap, "5").subscribe(function (meeting) {
            console.log("submitCloseMeetingForm, got meeting : ", meeting);
            //refresh list of meetings
            _this.meeting = meeting;
            _this.cd.detectChanges();
        }, function (error) {
            console.log('closeMeeting error', error);
            //TODO display error
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
], MeetingItemCoachComponent.prototype, "meetingUpdated", void 0);
MeetingItemCoachComponent = __decorate([
    Component({
        selector: 'rb-meeting-item-coach',
        templateUrl: 'meeting-item-coach.component.html',
        styleUrls: ['meeting-item-coach.component.css']
    }),
    __metadata("design:paramtypes", [FormBuilder, CoachCoacheeService, ChangeDetectorRef])
], MeetingItemCoachComponent);
export { MeetingItemCoachComponent };
//# sourceMappingURL=/Users/guillaume/git/eritis_fe/src/app/meeting/meeting-list/coach/meeting-item-coach.component.js.map