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
import { MeetingsService } from "../../../../service/meetings.service";
import { CoachCoacheeService } from "../../../../service/CoachCoacheeService";
import { AuthService } from "../../../../service/auth.service";
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { ContractPlan } from "../../../../model/ContractPlan";
import { Rh } from "../../../../model/Rh";
var MeetingListRhComponent = (function () {
    function MeetingListRhComponent(router, meetingsService, coachCoacheeService, authService, cd) {
        this.router = router;
        this.meetingsService = meetingsService;
        this.coachCoacheeService = coachCoacheeService;
        this.authService = authService;
        this.cd = cd;
        this.hasCollaborators = false;
        this.hasPotentialCollaborators = false;
        this.selectedPlan = new ContractPlan('-1');
    }
    MeetingListRhComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
    };
    MeetingListRhComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
        this.onRefreshRequested();
    };
    MeetingListRhComponent.prototype.onRefreshRequested = function () {
        var _this = this;
        var user = this.authService.getConnectedUser();
        console.log('onRefreshRequested, user : ', user);
        if (user == null) {
            this.connectedUserSubscription = this.authService.getConnectedUserObservable().subscribe(function (user) {
                console.log('onRefreshRequested, getConnectedUser');
                _this.onUserObtained(user);
            });
        }
        else {
            this.onUserObtained(user);
        }
    };
    MeetingListRhComponent.prototype.onUserObtained = function (user) {
        console.log('onUserObtained, user : ', user);
        if (user) {
            if (user instanceof Rh) {
                // rh
                console.log('get a rh');
                this.getAllCoacheesForRh(user.id);
                this.getAllPotentialCoacheesForRh(user.id);
                this.getAllContractPlans();
                this.getUsageRate(user.id);
            }
            this.user = Observable.of(user);
            this.cd.detectChanges();
        }
    };
    MeetingListRhComponent.prototype.getAllCoacheesForRh = function (rhId) {
        var _this = this;
        this.subscription = this.coachCoacheeService.getAllCoacheesForRh(rhId).subscribe(function (coachees) {
            console.log('got coachees for rh', coachees);
            _this.coachees = Observable.of(coachees);
            if (coachees !== null && coachees.length > 0)
                _this.hasCollaborators = true;
            _this.cd.detectChanges();
        });
    };
    MeetingListRhComponent.prototype.getAllPotentialCoacheesForRh = function (rhId) {
        var _this = this;
        this.subscription = this.coachCoacheeService.getAllPotentialCoacheesForRh(rhId).subscribe(function (coachees) {
            console.log('got potentialCoachees for rh', coachees);
            _this.potentialCoachees = Observable.of(coachees);
            if (coachees !== null && coachees.length > 0)
                _this.hasPotentialCollaborators = true;
            _this.cd.detectChanges();
        });
    };
    MeetingListRhComponent.prototype.getAllContractPlans = function () {
        var _this = this;
        this.authService.getNotAuth(AuthService.GET_CONTRACT_PLANS, null).subscribe(function (response) {
            var json = response.json();
            console.log("getListOfContractPlans, response json : ", json);
            _this.plans = Observable.of(json);
            // this.cd.detectChanges();
        });
    };
    MeetingListRhComponent.prototype.getUsageRate = function (rhId) {
        var _this = this;
        this.coachCoacheeService.getUsageRate(rhId).subscribe(function (rate) {
            console.log("getUsageRate, rate : ", rate);
            _this.rhUsageRate = Observable.of(rate);
        });
    };
    MeetingListRhComponent.prototype.refreshDashboard = function () {
        location.reload();
    };
    MeetingListRhComponent.prototype.ngOnDestroy = function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.connectedUserSubscription) {
            this.connectedUserSubscription.unsubscribe();
        }
    };
    /*************************************
     ----------- Modal control ------------
     *************************************/
    MeetingListRhComponent.prototype.addPotentialCoacheeModalVisibility = function (isVisible) {
        if (isVisible) {
            $('#add_potential_coachee_modal').openModal();
        }
        else {
            $('#add_potential_coachee_modal').closeModal();
        }
    };
    MeetingListRhComponent.prototype.cancelAddPotentialCoachee = function () {
        this.potentialCoacheeEmail = null;
        this.addPotentialCoacheeModalVisibility(false);
    };
    MeetingListRhComponent.prototype.validateAddPotentialCoachee = function () {
        var _this = this;
        console.log('validateAddPotentialCoachee, potentialCoacheeEmail : ', this.potentialCoacheeEmail);
        this.addPotentialCoacheeModalVisibility(false);
        this.user.take(1).subscribe(function (user) {
            var body = {
                "email": _this.potentialCoacheeEmail,
                "plan_id": _this.selectedPlan.plan_id,
                "rh_id": user.id
            };
            _this.coachCoacheeService.postPotentialCoachee(body).subscribe(function (res) {
                console.log('postPotentialCoachee, res', res);
                _this.onRefreshRequested();
                Materialize.toast('Collaborateur ajouté !', 3000, 'rounded');
            }, function (error) {
                console.log('postPotentialCoachee, error', error);
                Materialize.toast("Impossible d'ajouter le collaborateur", 3000, 'rounded');
            });
        });
    };
    return MeetingListRhComponent;
}());
MeetingListRhComponent = __decorate([
    Component({
        selector: 'rb-meeting-list-rh',
        templateUrl: './meeting-list-rh.component.html',
        styleUrls: ['./meeting-list-rh.component.css']
    }),
    __metadata("design:paramtypes", [Router, MeetingsService, CoachCoacheeService, AuthService, ChangeDetectorRef])
], MeetingListRhComponent);
export { MeetingListRhComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/meeting/meeting-list/rh/meeting-list-rh/meeting-list-rh.component.js.map