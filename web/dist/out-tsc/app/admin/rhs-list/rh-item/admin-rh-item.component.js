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
import { Router } from "@angular/router";
import { HR } from "../../../model/HR";
var AdminRhItemComponent = (function () {
    function AdminRhItemComponent(router) {
        this.router = router;
        this.months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    }
    AdminRhItemComponent.prototype.ngOnInit = function () {
    };
    AdminRhItemComponent.prototype.printDateString = function (date) {
        return this.getDate(date);
    };
    AdminRhItemComponent.prototype.getHours = function (date) {
        return (new Date(date)).getHours();
    };
    AdminRhItemComponent.prototype.getMinutes = function (date) {
        var m = (new Date(date)).getMinutes();
        if (m === 0)
            return '00';
        return m;
    };
    AdminRhItemComponent.prototype.getDate = function (date) {
        return (new Date(date)).getDate() + ' ' + this.months[(new Date(date)).getMonth()] + ' ' + (new Date(date)).getFullYear();
    };
    AdminRhItemComponent.prototype.goToRhProfile = function () {
        this.router.navigate(['admin/profile/rh', this.rh.id]);
    };
    __decorate([
        Input(),
        __metadata("design:type", HR)
    ], AdminRhItemComponent.prototype, "rh", void 0);
    AdminRhItemComponent = __decorate([
        Component({
            selector: 'er-admin-rh-item',
            templateUrl: './admin-rh-item.component.html',
            styleUrls: ['./admin-rh-item.component.scss']
        }),
        __metadata("design:paramtypes", [Router])
    ], AdminRhItemComponent);
    return AdminRhItemComponent;
}());
export { AdminRhItemComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/admin/rhs-list/rh-item/admin-rh-item.component.js.map