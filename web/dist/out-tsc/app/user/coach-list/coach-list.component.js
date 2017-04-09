var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ChangeDetectorRef } from '@angular/core';
import { CoachCoacheeService } from "../../service/CoachCoacheeService";
import { Observable } from "rxjs";
import { AuthService } from "../../service/auth.service";
import { Coachee } from "../../model/coachee";
import { Router } from "@angular/router";
var CoachListComponent = (function () {
    function CoachListComponent(router, service, authService, cd) {
        this.router = router;
        this.service = service;
        this.authService = authService;
        this.cd = cd;
    }
    CoachListComponent.prototype.ngOnInit = function () {
        console.log("ngOnInit");
    };
    CoachListComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        console.log("ngAfterViewInit");
        var user = this.authService.getConnectedUser();
        if (user) {
            //only a Coachee should see this component
            if (user instanceof Coachee) {
                this.onUserObtained(user);
            }
        }
        else {
            this.authService.getConnectedUserObservable().subscribe(function (user) {
                //only a Coachee should see this component
                if (user instanceof Coachee) {
                    _this.onUserObtained(user);
                }
            });
        }
    };
    CoachListComponent.prototype.onPotentialCoachSelected = function (coach) {
        console.log("potentialCoachSelected");
        this.potSelectedCoach = coach;
    };
    CoachListComponent.prototype.onFinalCoachSelected = function (selectedCoach) {
        var _this = this;
        console.log("onFinalCoachSelected");
        //reset pot coach
        this.potSelectedCoach = null;
        //save in backend
        this.coachee.last().flatMap(function (coachee) {
            console.log("onFinalCoachSelected, get coachee", coachee);
            return _this.authService.updateCoacheeSelectedCoach(coachee.id, selectedCoach.id);
        }).subscribe(function (coachee) {
            console.log("coach selected saved, redirect to meetings");
            //redirect to a meeting page
            // this.router.navigate(['/meetings']);
            _this.onUserObtained(coachee);
        });
    };
    CoachListComponent.prototype.onUserObtained = function (coachee) {
        var _this = this;
        console.log("onUserObtained, coachee", coachee);
        this.coachee = Observable.of(coachee);
        if (coachee.selectedCoach) {
            console.log("onUserObtained, we have a selected coach");
        }
        else {
            //if not coach selected, display possible coachs
            this.subscription = this.service.getAllCoachs().subscribe(function (coachs) {
                console.log("getAllCoachs subscribe, coachs : ", coachs);
                _this.coachs = Observable.of(coachs);
                _this.cd.detectChanges();
            });
        }
    };
    CoachListComponent.prototype.ngOnDestroy = function () {
        console.log("ngOnDestroy");
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    };
    return CoachListComponent;
}());
CoachListComponent = __decorate([
    Component({
        selector: 'rb-coach-list',
        templateUrl: './coach-list.component.html',
        styleUrls: ['./coach-list.component.css']
    }),
    __metadata("design:paramtypes", [Router, CoachCoacheeService, AuthService, ChangeDetectorRef])
], CoachListComponent);
export { CoachListComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/user/coach-list/coach-list.component.js.map