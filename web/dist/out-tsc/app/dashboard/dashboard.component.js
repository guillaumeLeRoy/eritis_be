var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ChangeDetectorRef, Component } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { AuthService } from "../service/auth.service";
var DashboardComponent = (function () {
    function DashboardComponent(authService, cd) {
        this.authService = authService;
        this.cd = cd;
        this.user = new BehaviorSubject(null);
    }
    DashboardComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
    };
    DashboardComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
        this.getConnectedUser();
    };
    DashboardComponent.prototype.ngOnDestroy = function () {
        if (this.connectedUserSubscription) {
            this.connectedUserSubscription.unsubscribe();
        }
    };
    DashboardComponent.prototype.getConnectedUser = function () {
        var _this = this;
        this.connectedUserSubscription = this.authService.getConnectedUserObservable()
            .subscribe(function (user) {
            console.log('getConnectedUser, user', user);
            _this.onUserObtained(user);
            _this.cd.detectChanges();
        });
    };
    DashboardComponent.prototype.onUserObtained = function (user) {
        console.log('onUserObtained, user : ', user);
        // if (user) {
        this.user.next(user);
        // }
    };
    DashboardComponent = __decorate([
        Component({
            selector: 'er-dashboard',
            templateUrl: './dashboard.component.html',
            styleUrls: ['./dashboard.component.scss']
        }),
        __metadata("design:paramtypes", [AuthService, ChangeDetectorRef])
    ], DashboardComponent);
    return DashboardComponent;
}());
export { DashboardComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/dashboard/dashboard.component.js.map