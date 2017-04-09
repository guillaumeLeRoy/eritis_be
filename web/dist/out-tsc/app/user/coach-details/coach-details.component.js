var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ChangeDetectorRef, Input } from '@angular/core';
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { Coach } from "../../model/Coach";
import { CoachCoacheeService } from "../../service/CoachCoacheeService";
import { AuthService } from "../../service/auth.service";
var CoachDetailsComponent = (function () {
    function CoachDetailsComponent(router, authService, cd, coachService) {
        this.router = router;
        this.authService = authService;
        this.cd = cd;
        this.coachService = coachService;
    }
    CoachDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        var user = this.authService.getConnectedUser();
        if (user) {
            this.onConnectedUserReceived(user);
        }
        else {
            this.subscriptionConnectUser = this.authService.getConnectedUserObservable().subscribe(function (user) {
                console.log("ngOnInit, sub received user", user);
                _this.onConnectedUserReceived(user);
            });
        }
    };
    CoachDetailsComponent.prototype.onConnectedUserReceived = function (user) {
        this.connectedUser = Observable.of(user);
        this.cd.detectChanges();
    };
    CoachDetailsComponent.prototype.createAMeeting = function () {
        var _this = this;
        this.connectedUser.take(1).subscribe(function (user) {
            if (user == null) {
                console.log('no connected user');
                return;
            }
            _this.coachService.createMeetingWithCoach(_this.coach.id, user.id).subscribe(function (success) {
                console.log('addPotentialDateToMeeting success', success);
                //redirect to meetings page
                _this.router.navigate(['/meetings']);
            }, function (error) {
                console.log('addPotentialDateToMeeting error', error);
                // this.displayErrorBookingDate = true;
            });
        });
    };
    CoachDetailsComponent.prototype.ngAfterViewInit = function () {
        // this.route.params.subscribe(
        //   (params: any) => {
        //     this.coachId = params['id']
        //     this.subscriptionGetCoach = this.coachService.getCoachForId(this.coachId).subscribe(
        //       (coach: Coach) => {
        //         console.log("ngAfterViewInit, post sub coach", coach);
        //
        //         this.coach = Observable.of(coach);
        //         this.cd.detectChanges();
        //       }
        //     );
        //   }
        // )
    };
    CoachDetailsComponent.prototype.ngOnDestroy = function () {
        // if (this.subscriptionGetCoach) {
        //   this.subscriptionGetCoach.unsubscribe();
        // }
        if (this.subscriptionConnectUser) {
            this.subscriptionConnectUser.unsubscribe();
        }
    };
    return CoachDetailsComponent;
}());
__decorate([
    Input(),
    __metadata("design:type", Coach)
], CoachDetailsComponent.prototype, "coach", void 0);
CoachDetailsComponent = __decorate([
    Component({
        selector: 'rb-coach-details',
        templateUrl: './coach-details.component.html',
        styleUrls: ['./coach-details.component.css']
    }),
    __metadata("design:paramtypes", [Router, AuthService, ChangeDetectorRef, CoachCoacheeService])
], CoachDetailsComponent);
export { CoachDetailsComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/user/coach-details/coach-details.component.js.map