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
import { Coachee } from "../../../model/Coachee";
import { Router } from "@angular/router";
var AdminCoacheeItemComponent = (function () {
    function AdminCoacheeItemComponent(router) {
        this.router = router;
        this.months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    }
    AdminCoacheeItemComponent.prototype.ngOnInit = function () {
    };
    AdminCoacheeItemComponent.prototype.goToCoacheeProfile = function (coacheeId) {
        window.scrollTo(0, 0);
        console.log("goToCoacheeProfileAdmin, %s", coacheeId);
        this.router.navigate(['admin/profile/coachee', coacheeId]);
    };
    AdminCoacheeItemComponent.prototype.printDateString = function (date) {
        return this.getDate(date);
    };
    AdminCoacheeItemComponent.prototype.getHours = function (date) {
        return (new Date(date)).getHours();
    };
    AdminCoacheeItemComponent.prototype.getMinutes = function (date) {
        var m = (new Date(date)).getMinutes();
        if (m === 0)
            return '00';
        return m;
    };
    AdminCoacheeItemComponent.prototype.getDate = function (date) {
        return (new Date(date)).getDate() + ' ' + this.months[(new Date(date)).getMonth()] + ' ' + (new Date(date)).getFullYear();
    };
    __decorate([
        Input(),
        __metadata("design:type", Coachee)
    ], AdminCoacheeItemComponent.prototype, "coachee", void 0);
    AdminCoacheeItemComponent = __decorate([
        Component({
            selector: 'er-admin-coachee-item',
            templateUrl: './admin-coachee-item.component.html',
            styleUrls: ['./admin-coachee-item.component.scss']
        }),
        __metadata("design:paramtypes", [Router])
    ], AdminCoacheeItemComponent);
    return AdminCoacheeItemComponent;
}());
export { AdminCoacheeItemComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/admin/coachees-list/coachee-item/admin-coachee-item.component.js.map