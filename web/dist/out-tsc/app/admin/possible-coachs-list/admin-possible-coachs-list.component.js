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
import { AdminAPIService } from "../../service/adminAPI.service";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
var AdminPossibleCoachsListComponent = (function () {
    function AdminPossibleCoachsListComponent(apiService) {
        this.apiService = apiService;
        this.loading = true;
        this.possibleCoachs = new BehaviorSubject(null);
    }
    AdminPossibleCoachsListComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
    };
    AdminPossibleCoachsListComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
        this.fetchData();
    };
    AdminPossibleCoachsListComponent.prototype.ngOnDestroy = function () {
        if (this.getAllPossibleCoachsSub != null) {
            this.getAllPossibleCoachsSub.unsubscribe();
        }
    };
    AdminPossibleCoachsListComponent.prototype.updateList = function () {
        this.fetchData();
    };
    AdminPossibleCoachsListComponent.prototype.fetchData = function () {
        var _this = this;
        this.loading = true;
        this.getAllPossibleCoachsSub = this.apiService.getPossibleCoachs().subscribe(function (coachs) {
            console.log('getAllPossibleCoachsSub subscribe, coachs : ', coachs);
            _this.loading = false;
            _this.possibleCoachs.next(coachs);
        });
    };
    AdminPossibleCoachsListComponent = __decorate([
        Component({
            selector: 'er-admin-possible-coachs-list',
            templateUrl: './admin-possible-coachs-list.component.html',
            styleUrls: ['./admin-possible-coachs-list.component.scss']
        }),
        __metadata("design:paramtypes", [AdminAPIService])
    ], AdminPossibleCoachsListComponent);
    return AdminPossibleCoachsListComponent;
}());
export { AdminPossibleCoachsListComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/admin/possible-coachs-list/admin-possible-coachs-list.component.js.map