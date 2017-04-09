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
import { CoachCoacheeService } from "../../service/CoachCoacheeService";
import { AuthService } from "../../service/auth.service";
import { Observable } from "rxjs";
import { Meeting } from "../../model/meeting";
var MeetingDateComponent = (function () {
    function MeetingDateComponent(coachService, authService, cd) {
        this.coachService = coachService;
        this.authService = authService;
        this.cd = cd;
        this.potentialDatePosted = new EventEmitter();
        // timeModel: NgbTimeStruct;
        this.timeRange = [0, 24];
        this.displayErrorBookingDate = false;
    }
    MeetingDateComponent.prototype.ngOnInit = function () {
        var _this = this;
        var user = this.authService.getConnectedUser();
        if (user) {
            this.onConnectedUserReceived(user);
        }
        else {
            this.subscriptionConnectUser = this.authService.getConnectedUserObservable().subscribe(function (user) {
                console.log("ngOnInit, sub received user", user);
                _this.onConnectedUserReceived(user);
            });
        }
    };
    MeetingDateComponent.prototype.onConnectedUserReceived = function (user) {
        this.connectedUser = Observable.of(user);
        this.cd.detectChanges();
    };
    MeetingDateComponent.prototype.bookADate = function () {
        var _this = this;
        console.log('bookADate, dateModel : ', this.dateModel);
        // console.log('bookADate, timeModel : ', this.timeModel);
        this.connectedUser.take(1).subscribe(function (user) {
            if (user == null) {
                console.log('no connected user');
                return;
            }
            var minDate = new Date(_this.dateModel.year, _this.dateModel.month, _this.dateModel.day, _this.timeRange[0], 0);
            var maxDate = new Date(_this.dateModel.year, _this.dateModel.month, _this.dateModel.day, _this.timeRange[1], 0);
            var timestampMin = +minDate.getTime().toFixed(0) / 1000;
            var timestampMax = +maxDate.getTime().toFixed(0) / 1000;
            _this.coachService.addPotentialDateToMeeting(_this.meeting.id, timestampMin, timestampMax).subscribe(function (meetingDate) {
                console.log('addPotentialDateToMeeting, meetingDate : ', meetingDate);
                //redirect to meetings page
                // this.router.navigate(['/meetings']);
                _this.potentialDatePosted.emit(meetingDate);
            }, function (error) {
                console.log('addPotentialDateToMeeting error', error);
                _this.displayErrorBookingDate = true;
            });
        });
    };
    MeetingDateComponent.prototype.ngOnDestroy = function () {
        if (this.subscriptionConnectUser) {
            this.subscriptionConnectUser.unsubscribe();
        }
    };
    return MeetingDateComponent;
}());
__decorate([
    Output(),
    __metadata("design:type", Object)
], MeetingDateComponent.prototype, "potentialDatePosted", void 0);
__decorate([
    Input(),
    __metadata("design:type", Meeting)
], MeetingDateComponent.prototype, "meeting", void 0);
MeetingDateComponent = __decorate([
    Component({
        selector: 'rb-meeting-date',
        templateUrl: './meeting-date.component.html',
        styleUrls: ['./meeting-date.component.css']
    }),
    __metadata("design:paramtypes", [CoachCoacheeService, AuthService, ChangeDetectorRef])
], MeetingDateComponent);
export { MeetingDateComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/meeting/meeting-date/meeting-date.component.js.map