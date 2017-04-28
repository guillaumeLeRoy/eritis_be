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
import { AuthService } from "../../service/auth.service";
import { CoachCoacheeService } from "../../service/CoachCoacheeService";
var CoachSelectorComponent = (function () {
    function CoachSelectorComponent(service, authService, cd) {
        this.service = service;
        this.authService = authService;
        this.cd = cd;
    }
    CoachSelectorComponent.prototype.ngOnInit = function () {
    };
    CoachSelectorComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
        this.getAllCoachsSub = this.authService.getCoachs().subscribe(function (coachs) {
            console.log('getAllCoachs subscribe, coachs : ', coachs);
            // this.coachs = Observable.of(coachs);
            // this.cd.detectChanges();
        });
        //
        // let user = this.authService.getConnectedUser();
        // if (user) {
        //   this.onUserObtained(user);
        // } else {
        //   this.authService.getConnectedUserObservable().subscribe(
        //     (user: Coach | Coachee) => {
        //       // only a Coachee should see this component
        //       this.onUserObtained(user);
        //     }
        //   );
        // }
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
    /**
     * Associate selectedCoach with selectedCoachee
     */
    CoachSelectorComponent.prototype.associate = function () {
        var _this = this;
        // save in backend
        this.authService.updateCoacheeSelectedCoach(this.selectedCoachee.id, this.selectedCoach.id).subscribe(function (coachee) {
            console.log('coach selected saved');
            var user = _this.authService.getConnectedUser();
            _this.onUserObtained(user);
        });
    };
    //TODO change that to Admin
    CoachSelectorComponent.prototype.onUserObtained = function (user) {
        var _this = this;
        console.log('onUserObtained, user', user);
        //get list of all coachs
        this.getAllCoachsSub = this.service.getAllCoachs().subscribe(function (coachs) {
            console.log('getAllCoachs subscribe, coachs : ', coachs);
            _this.coachs = Observable.of(coachs);
            _this.cd.detectChanges();
        });
        // this.getAllCoacheesSub = this.service.getAllCoachees().subscribe(
        //   (coachees: Coachee[]) => {
        //     console.log('getAllCoachees subscribe, coachees : ', coachees);
        //     //filter coachee with NO selected coachs
        //     let notAssociatedCoachees: Coachee[] = new Array<Coachee>();
        //     for (let coachee of coachees) {
        //       if (coachee.selectedCoach == null) {
        //         notAssociatedCoachees.push(coachee);
        //       }
        //     }
        //     this.coachees = Observable.of(notAssociatedCoachees);
        //     this.cd.detectChanges();
        //   }
        // );
    };
    return CoachSelectorComponent;
}());
CoachSelectorComponent = __decorate([
    Component({
        selector: 'er-coach-selector',
        templateUrl: './coach-selector.component.html',
        styleUrls: ['./coach-selector.component.css']
    }),
    __metadata("design:paramtypes", [CoachCoacheeService, AuthService, ChangeDetectorRef])
], CoachSelectorComponent);
export { CoachSelectorComponent };
//# sourceMappingURL=/Users/guillaume/git/eritis_fe/src/app/user/coach-selector/coach-selector.component.js.map