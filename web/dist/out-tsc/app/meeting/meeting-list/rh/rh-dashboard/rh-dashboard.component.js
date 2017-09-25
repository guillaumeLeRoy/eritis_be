var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ChangeDetectorRef, Component } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { AuthService } from "../../../../service/auth.service";
import { HR } from "../../../../model/HR";
import { CoachCoacheeService } from "../../../../service/coach_coachee.service";
var RhDashboardComponent = (function () {
    function RhDashboardComponent(authService, coachCoacheeService, cd) {
        this.authService = authService;
        this.coachCoacheeService = coachCoacheeService;
        this.cd = cd;
    }
    RhDashboardComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
    };
    RhDashboardComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
        this.onRefreshRequested();
    };
    RhDashboardComponent.prototype.ngOnDestroy = function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.connectedUserSubscription) {
            this.connectedUserSubscription.unsubscribe();
        }
    };
    RhDashboardComponent.prototype.onRefreshRequested = function () {
        var _this = this;
        var user = this.authService.getConnectedUser();
        console.log('onRefreshRequested, user : ', user);
        if (user == null) {
            this.connectedUserSubscription = this.authService.getConnectedUserObservable().subscribe(function (user) {
                console.log('onRefreshRequested, getConnectedUser');
                _this.onUserObtained(user);
            });
        }
        else {
            this.onUserObtained(user);
        }
    };
    RhDashboardComponent.prototype.onUserObtained = function (user) {
        console.log('onUserObtained, user : ', user);
        if (user) {
            if (user instanceof HR) {
                // rh
                console.log('get a rh');
                this.getUsageRate(user.id);
            }
            this.user = Observable.of(user);
            this.cd.detectChanges();
        }
    };
    RhDashboardComponent.prototype.getUsageRate = function (rhId) {
        var _this = this;
        this.coachCoacheeService.getUsageRate(rhId).subscribe(function (rate) {
            console.log("getUsageRate, rate : ", rate);
            _this.HrUsageRate = Observable.of(rate);
        });
    };
    RhDashboardComponent = __decorate([
        Component({
            selector: 'rb-rh-dashboard',
            templateUrl: './rh-dashboard.component.html',
            styleUrls: ['./rh-dashboard.component.scss']
        }),
        __metadata("design:paramtypes", [AuthService, CoachCoacheeService, ChangeDetectorRef])
    ], RhDashboardComponent);
    return RhDashboardComponent;
}());
export { RhDashboardComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/meeting/meeting-list/rh/rh-dashboard/rh-dashboard.component.js.map