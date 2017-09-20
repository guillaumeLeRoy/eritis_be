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
var PossibleCoachsListComponent = (function () {
    function PossibleCoachsListComponent(apiService, cd) {
        this.apiService = apiService;
        this.cd = cd;
        this.loading = true;
    }
    PossibleCoachsListComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
        this.loading = true;
    };
    PossibleCoachsListComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
        this.fetchData();
    };
    PossibleCoachsListComponent.prototype.ngOnDestroy = function () {
        if (this.getAllPossibleCoachsSub != null) {
            this.getAllPossibleCoachsSub.unsubscribe();
        }
    };
    PossibleCoachsListComponent.prototype.updateList = function () {
        this.fetchData();
    };
    PossibleCoachsListComponent.prototype.fetchData = function () {
        var _this = this;
        this.getAllPossibleCoachsSub = this.apiService.getPossibleCoachs().subscribe(function (coachs) {
            console.log('getAllPossibleCoachsSub subscribe, coachs : ', coachs);
            _this.possibleCoachs = Observable.of(coachs);
            _this.cd.detectChanges();
            _this.loading = false;
        });
    };
    PossibleCoachsListComponent = __decorate([
        Component({
            selector: 'rb-possible-coachs-list',
            templateUrl: './possible-coachs-list.component.html',
            styleUrls: ['./possible-coachs-list.component.scss']
        }),
        __metadata("design:paramtypes", [AdminAPIService, ChangeDetectorRef])
    ], PossibleCoachsListComponent);
    return PossibleCoachsListComponent;
}());
export { PossibleCoachsListComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/admin/possible-coachs-list/possible-coachs-list.component.js.map