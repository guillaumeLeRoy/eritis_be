var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Validators, FormBuilder } from "@angular/forms";
import { CoachCoacheeService } from "../service/CoachCoacheeService";
import { Meeting } from "../model/meeting";
var PreMeetingComponent = (function () {
    function PreMeetingComponent(formBuilder, coachService) {
        this.formBuilder = formBuilder;
        this.coachService = coachService;
        this.displayErrorPostingReview = false;
        this.reviewPosted = new EventEmitter();
    }
    PreMeetingComponent.prototype.ngOnInit = function () {
        this.rate = 3;
        // this.form = this.formBuilder.group({
        //   context: ['', [Validators.required]],
        //   mood: ['', [Validators.required]]
        // });
        this.form = this.formBuilder.group({
            context: ['', [Validators.required]]
        });
    };
    PreMeetingComponent.prototype.submitMeetingContextForm = function () {
        var _this = this;
        console.log("submitMeetingContextForm form : ", this.form.value);
        //TODO fix mood value
        // this.coachService.addAMeetingReview(this.meeting.id, this.form.value.context, this.form.value.mood).subscribe(
        //   (review: MeetingReview) => {
        //     console.log("submitMeetingContextForm, get review : ", review);
        //
        //   }
        // );
        this.coachService.addAMeetingReview(this.meeting.id, this.form.value.context, "3").subscribe(function (review) {
            console.log("submitMeetingContextForm, get review : ", review);
            //emit event
            _this.reviewPosted.emit(_this.meeting);
        }, function (error) {
            console.log('submitMeetingContextForm error', error);
            _this.displayErrorPostingReview = true;
        });
    };
    return PreMeetingComponent;
}());
__decorate([
    Input(),
    __metadata("design:type", Meeting)
], PreMeetingComponent.prototype, "meeting", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PreMeetingComponent.prototype, "reviewPosted", void 0);
PreMeetingComponent = __decorate([
    Component({
        selector: 'rb-pre-meeting',
        templateUrl: './pre-meeting.component.html',
        styleUrls: ['./pre-meeting.component.css']
    }),
    __metadata("design:paramtypes", [FormBuilder, CoachCoacheeService])
], PreMeetingComponent);
export { PreMeetingComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/meeting/pre-meeting.component.js.map