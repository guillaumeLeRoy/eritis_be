var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { Coach } from "../../../model/Coach";
var AdminCoachItemComponent = (function () {
    function AdminCoachItemComponent(router) {
        this.router = router;
        this.months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    }
    AdminCoachItemComponent.prototype.ngOnInit = function () {
        console.log("AdminCoachItemComponent, ngOnInit : ", this.coach);
    };
    AdminCoachItemComponent.prototype.goToCoachProfile = function (coachId) {
        console.log("goToCoachProfile, %s : ", coachId);
        window.scrollTo(0, 0);
        this.router.navigate(['admin/profile/coach', coachId]);
    };
    AdminCoachItemComponent.prototype.printDateString = function (date) {
        return this.getDate(date);
    };
    AdminCoachItemComponent.prototype.getHours = function (date) {
        return (new Date(date)).getHours();
    };
    AdminCoachItemComponent.prototype.getMinutes = function (date) {
        var m = (new Date(date)).getMinutes();
        if (m === 0)
            return '00';
        return m;
    };
    AdminCoachItemComponent.prototype.getDate = function (date) {
        return (new Date(date)).getDate() + ' ' + this.months[(new Date(date)).getMonth()] + ' ' + (new Date(date)).getFullYear();
    };
    __decorate([
        Input(),
        __metadata("design:type", Coach)
    ], AdminCoachItemComponent.prototype, "coach", void 0);
    AdminCoachItemComponent = __decorate([
        Component({
            selector: 'er-admin-coach-item',
            templateUrl: './admin-coach-item.component.html',
            styleUrls: ['./admin-coach-item.component.scss']
        }),
        __metadata("design:paramtypes", [Router])
    ], AdminCoachItemComponent);
    return AdminCoachItemComponent;
}());
export { AdminCoachItemComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/admin/coachs-list/coach-item/admin-coach-item.component.js.map