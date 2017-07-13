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
var RhsListComponent = (function () {
    function RhsListComponent(apiService, cd) {
        this.apiService = apiService;
        this.cd = cd;
    }
    RhsListComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
    };
    RhsListComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
        this.fetchData();
    };
    RhsListComponent.prototype.ngOnDestroy = function () {
        if (this.getAllrhsSub != null) {
            this.getAllrhsSub.unsubscribe();
        }
    };
    RhsListComponent.prototype.fetchData = function () {
        var _this = this;
        this.getAllrhsSub = this.apiService.getRhs().subscribe(function (rhs) {
            console.log('getAllrhsSub subscribe, rhs : ', rhs);
            _this.rhs = Observable.of(rhs);
            _this.cd.detectChanges();
        });
    };
    return RhsListComponent;
}());
RhsListComponent = __decorate([
    Component({
        selector: 'er-rhs-list',
        templateUrl: './rhs-list.component.html',
        styleUrls: ['./rhs-list.component.scss']
    }),
    __metadata("design:paramtypes", [AdminAPIService, ChangeDetectorRef])
], RhsListComponent);
export { RhsListComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/admin/rhs-list/rhs-list.component.js.map