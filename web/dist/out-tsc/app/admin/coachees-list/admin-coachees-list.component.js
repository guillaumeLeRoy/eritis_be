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
var AdminCoacheesListComponent = (function () {
    function AdminCoacheesListComponent(apiService) {
        this.apiService = apiService;
        this.loading = true;
        this.coachees = new BehaviorSubject(null);
    }
    AdminCoacheesListComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
    };
    AdminCoacheesListComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
        this.fetchData();
    };
    AdminCoacheesListComponent.prototype.ngOnDestroy = function () {
        if (this.getAllCoacheesSub != null) {
            this.getAllCoacheesSub.unsubscribe();
        }
    };
    AdminCoacheesListComponent.prototype.fetchData = function () {
        var _this = this;
        this.loading = true;
        this.getAllCoacheesSub = this.apiService.getCoachees(true).subscribe(function (coachees) {
            console.log('getAllCoachees subscribe, coachees : ', coachees);
            //filter coachee with NO selected coachs
            var notAssociatedCoachees = new Array();
            for (var _i = 0, coachees_1 = coachees; _i < coachees_1.length; _i++) {
                var coachee = coachees_1[_i];
                if (coachee.selectedCoach == null) {
                    notAssociatedCoachees.push(coachee);
                }
            }
            _this.loading = false;
            _this.coachees.next(notAssociatedCoachees);
        });
    };
    AdminCoacheesListComponent = __decorate([
        Component({
            selector: 'er-admin-coachees-list',
            templateUrl: './admin-coachees-list.component.html',
            styleUrls: ['./admin-coachees-list.component.scss']
        }),
        __metadata("design:paramtypes", [CoachCoacheeService])
    ], AdminCoacheesListComponent);
    return AdminCoacheesListComponent;
}());
export { AdminCoacheesListComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/admin/coachees-list/admin-coachees-list.component.js.map