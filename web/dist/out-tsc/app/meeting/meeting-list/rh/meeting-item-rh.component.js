var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input } from '@angular/core';
import { Coachee } from "../../../model/coachee";
import { PotentialCoachee } from "../../../model/PotentialCoachee";
import { Observable } from "rxjs/Observable";
import { CoachCoacheeService } from "../../../service/CoachCoacheeService";
var MeetingItemRhComponent = (function () {
    function MeetingItemRhComponent(coachCoacheeService) {
        this.coachCoacheeService = coachCoacheeService;
    }
    MeetingItemRhComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
        if (this.coachee)
            this.getUsageRate(this.coachee.id);
    };
    MeetingItemRhComponent.prototype.getUsageRate = function (rhId) {
        var _this = this;
        this.coachCoacheeService.getUsageRate(rhId).subscribe(function (rate) {
            console.log("getUsageRate, rate : ", rate);
            _this.coacheeUsageRate = Observable.of(rate);
        });
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
MeetingItemRhComponent = __decorate([
    Component({
        selector: 'rb-meeting-item-rh',
        templateUrl: './meeting-item-rh.component.html',
        styleUrls: ['./meeting-item-rh.component.css']
    }),
    __metadata("design:paramtypes", [CoachCoacheeService])
], MeetingItemRhComponent);
export { MeetingItemRhComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/meeting/meeting-list/rh/meeting-item-rh.component.js.map