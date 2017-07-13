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
import { Observable } from "rxjs/Observable";
import { AdminAPIService } from "../../service/adminAPI.service";
var AdminCoachsListComponent = (function () {
    function AdminCoachsListComponent(apiService, cd) {
        this.apiService = apiService;
        this.cd = cd;
    }
    AdminCoachsListComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
    };
    AdminCoachsListComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
        this.fetchData();
    };
    AdminCoachsListComponent.prototype.ngOnDestroy = function () {
        if (this.getAllCoachsSub != null) {
            this.getAllCoachsSub.unsubscribe();
        }
    };
    AdminCoachsListComponent.prototype.fetchData = function () {
        var _this = this;
        this.getAllCoachsSub = this.apiService.getCoachs().subscribe(function (coachs) {
            console.log('getAllCoachs subscribe, coachs : ', coachs);
            _this.coachs = Observable.of(coachs);
            _this.cd.detectChanges();
        });
    };
    return AdminCoachsListComponent;
}());
AdminCoachsListComponent = __decorate([
    Component({
        selector: 'er-admin-coachs-list',
        templateUrl: './admin-coachs-list.component.html',
        styleUrls: ['./admin-coachs-list.component.scss']
    }),
    __metadata("design:paramtypes", [AdminAPIService, ChangeDetectorRef])
], AdminCoachsListComponent);
export { AdminCoachsListComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/admin/coachs-list/admin-coachs-list.component.js.map