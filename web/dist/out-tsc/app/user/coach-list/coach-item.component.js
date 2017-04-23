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
import { Coach } from "../../model/Coach";
var CoachItemComponent = (function () {
    function CoachItemComponent() {
    }
    CoachItemComponent.prototype.ngOnInit = function () {
        console.log("CoachItemComponent, ngOnInit : ", this.coach);
    };
    return CoachItemComponent;
}());
__decorate([
    Input(),
    __metadata("design:type", Coach)
], CoachItemComponent.prototype, "coach", void 0);
CoachItemComponent = __decorate([
    Component({
        selector: 'rb-coach-item',
        templateUrl: './coach-item.component.html',
        styleUrls: ['./coach-item.component.css']
    }),
    __metadata("design:paramtypes", [])
], CoachItemComponent);
export { CoachItemComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/user/coach-list/coach-item.component.js.map