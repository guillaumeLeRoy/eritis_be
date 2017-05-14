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
var CoachSelectorComponent = (function () {
    function CoachSelectorComponent(apiService, cd) {
        this.apiService = apiService;
        this.cd = cd;
    }
    CoachSelectorComponent.prototype.ngOnInit = function () {
    };
    CoachSelectorComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
        this.fetchData();
    };
    CoachSelectorComponent.prototype.ngOnDestroy = function () {
        if (this.getAllCoachsSub != null) {
            this.getAllCoachsSub.unsubscribe();
        }
        if (this.getAllCoacheesSub != null) {
            this.getAllCoacheesSub.unsubscribe();
        }
    };
    CoachSelectorComponent.prototype.onCoachSelected = function (coach) {
        this.selectedCoach = coach;
    };
    CoachSelectorComponent.prototype.onCoacheeSelected = function (coachee) {
        this.selectedCoachee = coachee;
    };
    CoachSelectorComponent.prototype.canAssociate = function () {
        return this.selectedCoachee != null && this.selectedCoach != null;
    };
    /**
     * Associate selectedCoach with selectedCoachee
     * TODO : handle error
     */
    CoachSelectorComponent.prototype.associate = function () {
        var _this = this;
        // save in backend
        this.apiService.updateCoacheeSelectedCoach(this.selectedCoachee.id, this.selectedCoach.id).subscribe(function (coachee) {
            console.log('coach selected saved');
            //reset values
            _this.selectedCoach = null;
            _this.selectedCoachee = null;
            Materialize.toast('Association effectuée !', 3000, 'rounded');
            //refresh data
            _this.fetchData();
        });
    };
    CoachSelectorComponent.prototype.fetchData = function () {
        var _this = this;
        this.getAllCoachsSub = this.apiService.getCoachs().subscribe(function (coachs) {
            console.log('getAllCoachs subscribe, coachs : ', coachs);
            _this.coachs = Observable.of(coachs);
            _this.cd.detectChanges();
        });
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
    return CoachSelectorComponent;
}());
CoachSelectorComponent = __decorate([
    Component({
        selector: 'er-coach-selector',
        templateUrl: './coach-selector.component.html',
        styleUrls: ['./coach-selector.component.css']
    }),
    __metadata("design:paramtypes", [AdminAPIService, ChangeDetectorRef])
], CoachSelectorComponent);
export { CoachSelectorComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/user/coach-selector/coach-selector.component.js.map