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
import { Observable } from "rxjs/Observable";
var CoacheeDashboardComponent = (function () {
    function CoacheeDashboardComponent(router) {
        this.router = router;
    }
    CoacheeDashboardComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
    };
    CoacheeDashboardComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
    };
    CoacheeDashboardComponent.prototype.ngOnDestroy = function () {
        if (this.connectedUserSubscription) {
            this.connectedUserSubscription.unsubscribe();
        }
    };
    CoacheeDashboardComponent.prototype.navigateToCreateSession = function () {
        var _this = this;
        console.log('navigateToCreateSession');
        if (this.user != null) {
            this.user.take(1).subscribe(function (user) {
                if (user == null) {
                    console.log('no connected user');
                    return;
                }
                _this.router.navigate(['dashboard/date']);
            });
        }
    };
    __decorate([
        Input(),
        __metadata("design:type", Observable)
    ], CoacheeDashboardComponent.prototype, "user", void 0);
    CoacheeDashboardComponent = __decorate([
        Component({
            selector: 'er-coachee-dashboard',
            templateUrl: './coachee-dashboard.component.html',
            styleUrls: ['./coachee-dashboard.component.scss']
        }),
        __metadata("design:paramtypes", [Router])
    ], CoacheeDashboardComponent);
    return CoacheeDashboardComponent;
}());
export { CoacheeDashboardComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/dashboard/coachee-dashboard/coachee-dashboard.component.js.map