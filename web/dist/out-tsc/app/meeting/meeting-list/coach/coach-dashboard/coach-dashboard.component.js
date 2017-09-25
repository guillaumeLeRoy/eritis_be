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
import { AuthService } from "../../../../service/auth.service";
import { Observable } from "rxjs/Observable";
import { Coach } from "../../../../model/Coach";
var CoachDashboardComponent = (function () {
    function CoachDashboardComponent(authService, cd) {
        this.authService = authService;
        this.cd = cd;
    }
    CoachDashboardComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
    };
    CoachDashboardComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
        this.onRefreshRequested();
    };
    CoachDashboardComponent.prototype.ngOnDestroy = function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.connectedUserSubscription) {
            this.connectedUserSubscription.unsubscribe();
        }
    };
    CoachDashboardComponent.prototype.onRefreshRequested = function () {
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
    CoachDashboardComponent.prototype.onUserObtained = function (user) {
        console.log('onUserObtained, user : ', user);
        if (user) {
            if (user instanceof Coach) {
                // coachee
                console.log('get a coach');
            }
            this.user = Observable.of(user);
            this.cd.detectChanges();
        }
    };
    CoachDashboardComponent = __decorate([
        Component({
            selector: 'rb-coach-dashboard',
            templateUrl: './coach-dashboard.component.html',
            styleUrls: ['./coach-dashboard.component.scss']
        }),
        __metadata("design:paramtypes", [AuthService, ChangeDetectorRef])
    ], CoachDashboardComponent);
    return CoachDashboardComponent;
}());
export { CoachDashboardComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/meeting/meeting-list/coach/coach-dashboard/coach-dashboard.component.js.map