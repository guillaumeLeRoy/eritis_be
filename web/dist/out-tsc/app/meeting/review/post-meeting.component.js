var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { CoachCoacheeService } from "../../service/CoachCoacheeService";
import { Meeting } from "../../model/meeting";
var PostMeetingComponent = (function () {
    function PostMeetingComponent(formBuilder, coachService) {
        this.formBuilder = formBuilder;
        this.coachService = coachService;
        this.displayErrorReview = false;
        this.reviewPosted = new EventEmitter();
    }
    PostMeetingComponent.prototype.ngOnInit = function () {
        this.form = this.formBuilder.group({
            session_value: ['', [Validators.required]],
            next_step: ['', [Validators.required]]
        });
    };
    PostMeetingComponent.prototype.submitMeetingReview = function () {
        console.log("submitMeetingReview form : ", this.form.value);
        this.submitMeetingValue(this.form.value.session_value);
        this.submitMeetingNextStep(this.form.value.next_step);
    };
    PostMeetingComponent.prototype.submitMeetingValue = function (comment) {
        var _this = this;
        console.log("submitMeetingValue comment : ", comment);
        this.coachService.addAMeetingReviewForValue(this.meeting.id, comment).subscribe(function (review) {
            console.log("submitMeetingValue, get review : ", review);
            //emit event
            _this.reviewPosted.emit(_this.meeting);
        }, function (error) {
            console.log('submitMeetingValue error', error);
            _this.displayErrorReview = true;
        });
    };
    PostMeetingComponent.prototype.submitMeetingNextStep = function (comment) {
        var _this = this;
        console.log("submitMeetingNextStep comment : ", comment);
        this.coachService.addAMeetingReviewForNextStep(this.meeting.id, comment).subscribe(function (review) {
            console.log("submitMeetingNextStep, get review : ", review);
            //emit event
            _this.reviewPosted.emit(_this.meeting);
        }, function (error) {
            console.log('submitMeetingNextStep error', error);
            _this.displayErrorReview = true;
        });
    };
    return PostMeetingComponent;
}());
__decorate([
    Input(),
    __metadata("design:type", Meeting)
], PostMeetingComponent.prototype, "meeting", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PostMeetingComponent.prototype, "reviewPosted", void 0);
PostMeetingComponent = __decorate([
    Component({
        selector: 'er-post-meeting',
        templateUrl: './post-meeting.component.html',
        styleUrls: ['./post-meeting.component.css']
    }),
    __metadata("design:paramtypes", [FormBuilder, CoachCoacheeService])
], PostMeetingComponent);
export { PostMeetingComponent };
//# sourceMappingURL=/Users/guillaume/git/eritis_fe/src/app/meeting/review/post-meeting.component.js.map