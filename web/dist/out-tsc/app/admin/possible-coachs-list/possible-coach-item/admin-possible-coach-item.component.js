var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Router } from "@angular/router";
import { AdminAPIService } from "../../../service/adminAPI.service";
import { PossibleCoach } from "../../../model/PossibleCoach";
var AdminPossibleCoachItemComponent = (function () {
    function AdminPossibleCoachItemComponent(router, apiService) {
        this.router = router;
        this.apiService = apiService;
        this.coachAdded = new EventEmitter();
        this.months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    }
    AdminPossibleCoachItemComponent.prototype.ngOnInit = function () {
        console.log("AdminPossibleCoachItemComponent, ngOnInit : ", this.coach);
    };
    AdminPossibleCoachItemComponent.prototype.goToCoachProfile = function (coachId) {
        this.router.navigate(['admin/profile/possible-coach', coachId]);
    };
    AdminPossibleCoachItemComponent.prototype.sendInvite = function (email) {
        var _this = this;
        console.log('sendInvite, email', email);
        this.apiService.createPotentialCoach(email).subscribe(function (res) {
            console.log('createPotentialCoach, res', res);
            _this.coachAdded.emit(null);
            Materialize.toast('Invitation envoyée au Coach !', 3000, 'rounded');
        }, function (error) {
            console.log('createPotentialCoach, error', error);
            Materialize.toast("Impossible d'ajouter le Coach", 3000, 'rounded');
        });
    };
    AdminPossibleCoachItemComponent.prototype.printDateString = function (date) {
        return this.getDate(date);
    };
    AdminPossibleCoachItemComponent.prototype.getHours = function (date) {
        return (new Date(date)).getHours();
    };
    AdminPossibleCoachItemComponent.prototype.getMinutes = function (date) {
        var m = (new Date(date)).getMinutes();
        if (m === 0)
            return '00';
        return m;
    };
    AdminPossibleCoachItemComponent.prototype.getDate = function (date) {
        return (new Date(date)).getDate() + ' ' + this.months[(new Date(date)).getMonth()] + ' ' + (new Date(date)).getFullYear();
    };
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], AdminPossibleCoachItemComponent.prototype, "coachAdded", void 0);
    __decorate([
        Input(),
        __metadata("design:type", PossibleCoach)
    ], AdminPossibleCoachItemComponent.prototype, "coach", void 0);
    AdminPossibleCoachItemComponent = __decorate([
        Component({
            selector: 'er-admin-possible-coach-item',
            templateUrl: './admin-possible-coach-item.component.html',
            styleUrls: ['./admin-possible-coach-item.component.scss']
        }),
        __metadata("design:paramtypes", [Router, AdminAPIService])
    ], AdminPossibleCoachItemComponent);
    return AdminPossibleCoachItemComponent;
}());
export { AdminPossibleCoachItemComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/admin/possible-coachs-list/possible-coach-item/admin-possible-coach-item.component.js.map