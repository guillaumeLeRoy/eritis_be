var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MeetingsService } from "../service/meetings.service";
var PreMeetingComponent = (function () {
    function PreMeetingComponent(meetingService) {
        this.meetingService = meetingService;
        this.meetingGoal = new EventEmitter();
        this.meetingContext = new EventEmitter();
    }
    PreMeetingComponent.prototype.ngOnInit = function () {
        console.log("PreMeetingComponent onInit");
        //this.getAllMeetingReviews();
        this.getMeetingGoal();
        this.getMeetingContext();
    };
    /* Get from API review goal for the given meeting */
    PreMeetingComponent.prototype.getMeetingGoal = function () {
        var _this = this;
        this.meetingService.getMeetingGoal(this.meetingId).subscribe(function (reviews) {
            console.log("getMeetingGoal, got goal : ", reviews);
            if (reviews != null)
                _this.updateGoalValue(reviews[0].value);
        }, function (error) {
            console.log('getMeetingGoal error', error);
            //this.displayErrorPostingReview = true;
        });
    };
    /* Get from API all review context for the given meeting */
    PreMeetingComponent.prototype.getMeetingContext = function () {
        var _this = this;
        this.meetingService.getMeetingContext(this.meetingId).subscribe(function (reviews) {
            console.log("getMeetingContext, got context : ", reviews);
            if (reviews != null)
                _this.updateContextValue(reviews[0].value);
        }, function (error) {
            console.log('getMeetingContext error', error);
            //this.displayErrorPostingReview = true;
        });
    };
    PreMeetingComponent.prototype.onGoalValueChanged = function (event) {
        var goal = event.target.value;
        console.log('onGoalValueChanged res', goal);
        this.updateGoalValue(goal);
    };
    PreMeetingComponent.prototype.onContextValueChanged = function (event) {
        var context = event.target.value;
        console.log('onContextValueChanged res', context);
        this.updateContextValue(context);
    };
    PreMeetingComponent.prototype.updateGoalValue = function (goal) {
        this.uiMeetingGoal = goal;
        this.meetingGoal.emit(this.uiMeetingGoal);
    };
    PreMeetingComponent.prototype.updateContextValue = function (context) {
        this.uiMeetingContext = context;
        this.meetingContext.emit(this.uiMeetingContext);
    };
    return PreMeetingComponent;
}());
__decorate([
    Input(),
    __metadata("design:type", String)
], PreMeetingComponent.prototype, "meetingId", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PreMeetingComponent.prototype, "meetingGoal", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PreMeetingComponent.prototype, "meetingContext", void 0);
PreMeetingComponent = __decorate([
    Component({
        selector: 'er-pre-meeting',
        templateUrl: './pre-meeting.component.html',
        styleUrls: ['./pre-meeting.component.css']
    }),
    __metadata("design:paramtypes", [MeetingsService])
], PreMeetingComponent);
export { PreMeetingComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/meeting/pre-meeting.component.js.map