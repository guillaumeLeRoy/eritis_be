var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CoachCoacheeService } from "../service/CoachCoacheeService";
import { MEETING_REVIEW_TYPE_SESSION_CONTEXT, MEETING_REVIEW_TYPE_SESSION_GOAL } from "../model/MeetingReview";
var PreMeetingComponent = (function () {
    function PreMeetingComponent(coachService) {
        this.coachService = coachService;
        this.meetingGoal = new EventEmitter();
        this.meetingContext = new EventEmitter();
    }
    PreMeetingComponent.prototype.ngOnInit = function () {
        console.log("PreMeetingComponent onInit");
        this.getAllMeetingReviews();
    };
    /* Get form API all reviews for the given meeting */
    PreMeetingComponent.prototype.getAllMeetingReviews = function () {
        var _this = this;
        console.log("getAllMeetingReviews, meetingId : ", this.meetingId);
        this.coachService.getMeetingReviews(this.meetingId).subscribe(function (reviews) {
            console.log("getAllMeetingReviews, got reviews : ", reviews);
            if (reviews != null) {
                //search for correct type
                for (var _i = 0, reviews_1 = reviews; _i < reviews_1.length; _i++) {
                    var review = reviews_1[_i];
                    if (review.type == MEETING_REVIEW_TYPE_SESSION_GOAL) {
                        _this.updateGoalValue(review.comment);
                    }
                    else if (review.type == MEETING_REVIEW_TYPE_SESSION_CONTEXT) {
                        _this.updateContextValue(review.comment);
                    }
                }
            }
        }, function (error) {
            console.log('getAllMeetingReviews error', error);
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
    __metadata("design:paramtypes", [CoachCoacheeService])
], PreMeetingComponent);
export { PreMeetingComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/meeting/pre-meeting.component.js.map