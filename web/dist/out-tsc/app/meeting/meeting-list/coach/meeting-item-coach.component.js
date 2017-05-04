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
import { Router } from "@angular/router";
var MeetingItemCoachComponent = (function () {
    function MeetingItemCoachComponent(router, formBuilder, coachCoacheeService, cd) {
        this.router = router;
        this.formBuilder = formBuilder;
        this.coachCoacheeService = coachCoacheeService;
        this.cd = cd;
        this.meetingUpdated = new EventEmitter();
        this.dateAgreed = new EventEmitter();
        this.months = ['Jan', 'Feb', 'Mar', 'Avr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        this.showDetails = false;
        $('select').material_select();
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
        this.getGoal();
        this.getReviewValue();
        this.getReviewNextStep();
        this.loadMeetingPotentialTimes();
    };
    MeetingItemCoachComponent.prototype.loadMeetingPotentialTimes = function () {
        var _this = this;
        this.coachCoacheeService.getMeetingPotentialTimes(this.meeting.id).subscribe(function (dates) {
            console.log("potential dates obtained, ", dates);
            dates.sort(function (a, b) {
                var d1 = new Date(a.start_date);
                var d2 = new Date(b.start_date);
                var res = d1.getUTCDate() - d2.getUTCDate();
                if (res === 0) {
                    res = d1.getUTCHours() - d2.getUTCHours();
                }
                return res;
            });
            _this.potentialDatesArray = dates;
            _this.potentialDates = Observable.of(dates);
            _this.cd.detectChanges();
            _this.loadPotentialDays();
        }, function (error) {
            console.log('get potentials dates error', error);
        });
    };
    MeetingItemCoachComponent.prototype.confirmPotentialDate = function () {
        var _this = this;
        var minDate = new Date(this.selectedDate);
        minDate.setHours(this.selectedHour);
        var maxDate = new Date(this.selectedDate);
        maxDate.setHours(this.selectedHour + 1);
        var timestampMin = +minDate.getTime().toFixed(0) / 1000;
        var timestampMax = +maxDate.getTime().toFixed(0) / 1000;
        // create new date
        this.coachCoacheeService.addPotentialDateToMeeting(this.meeting.id, timestampMin, timestampMax).subscribe(function (meetingDate) {
            console.log('addPotentialDateToMeeting, meetingDate : ', meetingDate);
            // validate date
            _this.coachCoacheeService.setFinalDateToMeeting(_this.meeting.id, meetingDate.id).subscribe(function (meeting) {
                console.log("confirmPotentialDate, response", meeting);
                // this.reloadDashboard();
                _this.dateAgreed.emit();
            }, function (error) {
                console.log('get potentials dates error', error);
            });
        }, function (error) {
            console.log('addPotentialDateToMeeting error', error);
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
    MeetingItemCoachComponent.prototype.getGoal = function () {
        var _this = this;
        this.loading = true;
        this.coachCoacheeService.getMeetingGoal(this.meeting.id).subscribe(function (reviews) {
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
    MeetingItemCoachComponent.prototype.getReviewValue = function () {
        var _this = this;
        this.loading = true;
        this.coachCoacheeService.getMeetingValue(this.meeting.id).subscribe(function (reviews) {
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
    MeetingItemCoachComponent.prototype.getReviewNextStep = function () {
        var _this = this;
        this.loading = true;
        this.coachCoacheeService.getMeetingNextStep(this.meeting.id).subscribe(function (reviews) {
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
    MeetingItemCoachComponent.prototype.loadPotentialDays = function () {
        console.log("loadPotentialDays");
        var days = [];
        for (var _a = 0, _b = this.potentialDatesArray; _a < _b.length; _a++) {
            var date = _b[_a];
            var d = new Date(date.start_date);
            d.setHours(0);
            if (days.indexOf(d.toString()) < 0)
                days.push(d.toString());
        }
        this.potentialDays = Observable.of(days);
        this.cd.detectChanges();
        $('select').material_select();
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
        $('select').material_select();
        console.log("potentialHours", hours);
    };
    MeetingItemCoachComponent.prototype.toggleShowDetails = function () {
        this.showDetails = this.showDetails ? false : true;
    };
    MeetingItemCoachComponent.prototype.getHours = function (date) {
        return (new Date(date)).getHours();
    };
    MeetingItemCoachComponent.prototype.getDate = function (date) {
        return (new Date(date)).getDate() + ' ' + this.months[(new Date(date)).getMonth()];
    };
    MeetingItemCoachComponent.prototype.openModal = function () {
        $('#deleteModal').openModal();
    };
    MeetingItemCoachComponent.prototype.closeModal = function () {
        $('#deleteModal').closeModal();
    };
    MeetingItemCoachComponent.prototype.reloadDashboard = function () {
        console.log('reloadCoachDashboard');
        this.dateAgreed.emit();
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
__decorate([
    Output(),
    __metadata("design:type", Object)
], MeetingItemCoachComponent.prototype, "dateAgreed", void 0);
MeetingItemCoachComponent = __decorate([
    Component({
        selector: 'rb-meeting-item-coach',
        templateUrl: 'meeting-item-coach.component.html',
        styleUrls: ['meeting-item-coach.component.css']
    }),
    __metadata("design:paramtypes", [Router, FormBuilder, CoachCoacheeService, ChangeDetectorRef])
], MeetingItemCoachComponent);
export { MeetingItemCoachComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/meeting/meeting-list/coach/meeting-item-coach.component.js.map