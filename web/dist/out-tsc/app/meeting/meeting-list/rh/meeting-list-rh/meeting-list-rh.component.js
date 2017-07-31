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
import { CoachCoacheeService } from "../../../../service/coach_coachee.service";
import { AuthService } from "../../../../service/auth.service";
import { Observable } from "rxjs/Observable";
import { ContractPlan } from "../../../../model/ContractPlan";
import { HR } from "../../../../model/HR";
var MeetingListRhComponent = (function () {
    function MeetingListRhComponent(coachCoacheeService, authService, cd) {
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
            if (user instanceof HR) {
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
     ----------- Modal control for Potential Coachee ------------
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
                Materialize.toast('Manager ajouté !', 3000, 'rounded');
            }, function (error) {
                console.log('postPotentialCoachee, error', error);
                Materialize.toast("Impossible d'ajouter le manager", 3000, 'rounded');
            });
        });
    };
    /*************************************
     ----------- Modal control for new coachee's objective ------------
     *************************************/
    MeetingListRhComponent.prototype.updateCoacheeObjectivePanelVisibility = function (visible) {
        if (visible) {
            $('#add_new_objective_modal').openModal();
        }
        else {
            $('#add_new_objective_modal').closeModal();
        }
    };
    MeetingListRhComponent.prototype.makeAPICallToAddNewObjective = function (user) {
        var _this = this;
        this.updateCoacheeObjectivePanelVisibility(false);
        //call API
        this.coachCoacheeService.addObjectiveToCoachee(user.id, this.addNewObjectiveCoacheeId, this.coacheeNewObjective).subscribe(function (obj) {
            console.log('addObjectiveToCoachee, SUCCESS', obj);
            // close modal
            _this.updateCoacheeObjectivePanelVisibility(false);
            _this.onRefreshRequested();
            Materialize.toast("L'objectif a été modifié !", 3000, 'rounded');
            // TODO stop loader
            // clean
            _this.coacheeNewObjective = null;
        }, function (error) {
            console.log('addObjectiveToCoachee, error', error);
            Materialize.toast("Imposible de modifier l'objectif", 3000, 'rounded');
        });
    };
    MeetingListRhComponent.prototype.startAddNewObjectiveFlow = function (coacheeId) {
        console.log('startAddNewObjectiveFlow, coacheeId : ', coacheeId);
        this.updateCoacheeObjectivePanelVisibility(true);
        this.addNewObjectiveCoacheeId = coacheeId;
    };
    MeetingListRhComponent.prototype.cancelAddNewObjectiveModal = function () {
        this.updateCoacheeObjectivePanelVisibility(false);
    };
    MeetingListRhComponent.prototype.validateAddNewObjectiveModal = function () {
        var _this = this;
        console.log('validateAddNewObjectiveModal');
        // TODO start loader
        var user = this.authService.getConnectedUser();
        if (user == null) {
            var userObs = this.authService.getConnectedUserObservable();
            userObs.take(1).subscribe(function (user) {
                console.log('validateAddNewObjectiveModal, got connected user');
                if (user instanceof HR) {
                    _this.makeAPICallToAddNewObjective(user);
                }
            });
            return;
        }
        if (user instanceof HR) {
            this.makeAPICallToAddNewObjective(user);
        }
    };
    return MeetingListRhComponent;
}());
MeetingListRhComponent = __decorate([
    Component({
        selector: 'rb-meeting-list-rh',
        templateUrl: './meeting-list-rh.component.html',
        styleUrls: ['./meeting-list-rh.component.scss']
    }),
    __metadata("design:paramtypes", [CoachCoacheeService, AuthService, ChangeDetectorRef])
], MeetingListRhComponent);
export { MeetingListRhComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/meeting/meeting-list/rh/meeting-list-rh/meeting-list-rh.component.js.map