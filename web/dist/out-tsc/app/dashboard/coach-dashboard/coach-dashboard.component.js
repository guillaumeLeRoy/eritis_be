var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { Observable } from "rxjs/Observable";
var CoachDashboardComponent = (function () {
    function CoachDashboardComponent(cd) {
        this.cd = cd;
    }
    CoachDashboardComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
    };
    CoachDashboardComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
        this.userSubscription = this.user.subscribe(function (coach) {
            // maybe do sth one day
        });
    };
    CoachDashboardComponent.prototype.ngOnDestroy = function () {
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
    };
    __decorate([
        Input(),
        __metadata("design:type", Observable)
    ], CoachDashboardComponent.prototype, "user", void 0);
    CoachDashboardComponent = __decorate([
        Component({
            selector: 'er-coach-dashboard',
            templateUrl: './coach-dashboard.component.html',
            styleUrls: ['./coach-dashboard.component.scss']
        }),
        __metadata("design:paramtypes", [ChangeDetectorRef])
    ], CoachDashboardComponent);
    return CoachDashboardComponent;
}());
export { CoachDashboardComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/dashboard/coach-dashboard/coach-dashboard.component.js.map