var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from "@angular/core";
import { CoachCoacheeService } from "../../service/coach_coachee.service";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
var AdminRhsListComponent = (function () {
    function AdminRhsListComponent(apiService) {
        this.apiService = apiService;
        this.loading = true;
        this.rhs = new BehaviorSubject(null);
    }
    AdminRhsListComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
    };
    AdminRhsListComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
        this.fetchData();
    };
    AdminRhsListComponent.prototype.ngOnDestroy = function () {
        if (this.getAllrhsSub != null) {
            this.getAllrhsSub.unsubscribe();
        }
    };
    AdminRhsListComponent.prototype.fetchData = function () {
        var _this = this;
        this.loading = true;
        this.getAllrhsSub = this.apiService.getRhs(true)
            .subscribe(function (rhs) {
            console.log('getAllrhsSub subscribe, rhs : ', rhs);
            _this.loading = false;
            _this.rhs.next(rhs);
        });
    };
    AdminRhsListComponent = __decorate([
        Component({
            selector: 'er-admin-rhs-list',
            templateUrl: './admin-rhs-list.component.html',
            styleUrls: ['./admin-rhs-list.component.scss']
        }),
        __metadata("design:paramtypes", [CoachCoacheeService])
    ], AdminRhsListComponent);
    return AdminRhsListComponent;
}());
export { AdminRhsListComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/admin/rhs-list/admin-rhs-list.component.js.map