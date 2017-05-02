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
import { Coach } from "../../../model/Coach";
var ProfileCoachSummaryComponent = (function () {
    function ProfileCoachSummaryComponent() {
    }
    ProfileCoachSummaryComponent.prototype.ngOnInit = function () {
    };
    return ProfileCoachSummaryComponent;
}());
__decorate([
    Input(),
    __metadata("design:type", Coach)
], ProfileCoachSummaryComponent.prototype, "coach", void 0);
ProfileCoachSummaryComponent = __decorate([
    Component({
        selector: 'rb-profile-coach-summary',
        templateUrl: './profile-coach-summary.component.html',
        styleUrls: ['./profile-coach-summary.component.css']
    }),
    __metadata("design:paramtypes", [])
], ProfileCoachSummaryComponent);
export { ProfileCoachSummaryComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/user/profile/coach/profile-coach-summary.component.js.map