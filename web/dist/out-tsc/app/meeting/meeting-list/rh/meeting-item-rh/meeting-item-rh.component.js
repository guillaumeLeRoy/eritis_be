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
import { Coachee } from "../../../../model/Coachee";
import { PotentialCoachee } from "../../../../model/PotentialCoachee";
import { CoachCoacheeService } from "../../../../service/coach_coachee.service";
import { Observable } from "rxjs/Observable";
import { MeetingsService } from "../../../../service/meetings.service";
var MeetingItemRhComponent = (function () {
    // private coacheeUsageRate: Observable<RhUsageRate>;
    function MeetingItemRhComponent(meetingsService, coachCoacheeService, cd) {
        this.meetingsService = meetingsService;
        this.coachCoacheeService = coachCoacheeService;
        this.cd = cd;
        /**
         * Event emitted when user clicks on the "Objective" btn.
         * @type {EventEmitter<string>} the coacheeId
         */
        this.onUpdateObjectiveBtnClick = new EventEmitter();
        this.months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        this.showDetails = false;
        this.hasBookedMeeting = false;
        this.goals = {};
    }
    MeetingItemRhComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit, coachee : ', this.coachee);
        if (this.coachee != null) {
            this.getUsageRate(this.coachee.id);
            this.getAllMeetingsForCoachee(this.coachee.id);
        }
    };
    MeetingItemRhComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit, coachee : ', this.coachee);
        // this.fetchConnectedUser();
    };
    MeetingItemRhComponent.prototype.printDateString = function (date) {
        return this.getDate(date);
    };
    MeetingItemRhComponent.prototype.getHours = function (date) {
        return (new Date(date)).getHours();
    };
    MeetingItemRhComponent.prototype.getMinutes = function (date) {
        var m = (new Date(date)).getMinutes();
        if (m === 0)
            return '00';
        return m;
    };
    MeetingItemRhComponent.prototype.getDate = function (date) {
        return (new Date(date)).getDate() + ' ' + this.months[(new Date(date)).getMonth()] + ' ' + (new Date(date)).getFullYear();
    };
    MeetingItemRhComponent.prototype.toggleShowDetails = function () {
        this.showDetails = this.showDetails ? false : true;
    };
    MeetingItemRhComponent.prototype.getAllMeetingsForCoachee = function (coacheeId) {
        var _this = this;
        this.loading = true;
        this.meetingsService.getAllMeetingsForCoacheeId(coacheeId).subscribe(function (meetings) {
            console.log('got meetings for coachee', meetings);
            var bookedMeetings = [];
            for (var _i = 0, meetings_1 = meetings; _i < meetings_1.length; _i++) {
                var meeting = meetings_1[_i];
                if (meeting.agreed_date != null) {
                    bookedMeetings.push(meeting);
                    _this.hasBookedMeeting = true;
                    _this.getGoal(meeting.id);
                }
            }
            _this.meetings = Observable.of(bookedMeetings);
            _this.cd.detectChanges();
            _this.loading = false;
        });
    };
    MeetingItemRhComponent.prototype.getGoal = function (meetingId) {
        var _this = this;
        return this.meetingsService.getMeetingGoal(meetingId).subscribe(function (reviews) {
            console.log("getMeetingGoal, got goal : ", reviews);
            if (reviews != null)
                _this.goals[meetingId] = reviews[0].value;
            else
                _this.goals[meetingId] = 'n/a';
        }, function (error) {
            console.log('getMeetingGoal error', error);
            //this.displayErrorPostingReview = true;
        });
    };
    MeetingItemRhComponent.prototype.getUsageRate = function (rhId) {
        var _this = this;
        this.coachCoacheeService.getUsageRate(rhId).subscribe(function (rate) {
            console.log("getUsageRate, rate : ", rate);
            _this.coacheeUsageRate = Observable.of(rate);
        });
    };
    MeetingItemRhComponent.prototype.onClickAddObjectiveBtn = function () {
        this.onUpdateObjectiveBtnClick.emit(this.coachee.id);
    };
    return MeetingItemRhComponent;
}());
__decorate([
    Input(),
    __metadata("design:type", Coachee)
], MeetingItemRhComponent.prototype, "coachee", void 0);
__decorate([
    Input(),
    __metadata("design:type", PotentialCoachee)
], MeetingItemRhComponent.prototype, "potentialCoachee", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], MeetingItemRhComponent.prototype, "onUpdateObjectiveBtnClick", void 0);
MeetingItemRhComponent = __decorate([
    Component({
        selector: 'rb-meeting-item-rh',
        templateUrl: './meeting-item-rh.component.html',
        styleUrls: ['./meeting-item-rh.component.scss']
    }),
    __metadata("design:paramtypes", [MeetingsService, CoachCoacheeService, ChangeDetectorRef])
], MeetingItemRhComponent);
export { MeetingItemRhComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/meeting/meeting-list/rh/meeting-item-rh/meeting-item-rh.component.js.map