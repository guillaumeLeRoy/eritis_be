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
import { AdminAPIService } from "../../service/adminAPI.service";
var CoacheesListComponent = (function () {
    function CoacheesListComponent(apiService, cd) {
        this.apiService = apiService;
        this.cd = cd;
    }
    CoacheesListComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
    };
    CoacheesListComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
        this.fetchData();
    };
    CoacheesListComponent.prototype.ngOnDestroy = function () {
        if (this.getAllCoacheesSub != null) {
            this.getAllCoacheesSub.unsubscribe();
        }
    };
    CoacheesListComponent.prototype.fetchData = function () {
        var _this = this;
        this.getAllCoacheesSub = this.apiService.getCoachees().subscribe(function (coachees) {
            console.log('getAllCoachees subscribe, coachees : ', coachees);
            //filter coachee with NO selected coachs
            var notAssociatedCoachees = new Array();
            for (var _i = 0, coachees_1 = coachees; _i < coachees_1.length; _i++) {
                var coachee = coachees_1[_i];
                if (coachee.selectedCoach == null) {
                    notAssociatedCoachees.push(coachee);
                }
            }
            _this.coachees = Observable.of(notAssociatedCoachees);
            _this.cd.detectChanges();
        });
    };
    return CoacheesListComponent;
}());
CoacheesListComponent = __decorate([
    Component({
        selector: 'er-coachees-list',
        templateUrl: './coachees-list.component.html',
        styleUrls: ['./coachees-list.component.scss']
    }),
    __metadata("design:paramtypes", [AdminAPIService, ChangeDetectorRef])
], CoacheesListComponent);
export { CoacheesListComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/admin/coachees-list/coachees-list.component.js.map