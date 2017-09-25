var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { CoachCoacheeService } from "../../../../service/coach_coachee.service";
import { AuthService } from "../../../../service/auth.service";
import { Observable } from "rxjs/Observable";
import { ContractPlan } from "../../../../model/ContractPlan";
import { HR } from "../../../../model/HR";
import { FormBuilder, Validators } from "@angular/forms";
import { Utils } from "../../../../utils/Utils";
var MeetingListRhComponent = (function () {
    function MeetingListRhComponent(authService, coachCoacheeService, cd, formBuilder) {
        this.authService = authService;
        this.coachCoacheeService = coachCoacheeService;
        this.cd = cd;
        this.formBuilder = formBuilder;
        this.loading1 = true;
        this.loading2 = true;
        this.isAdmin = false;
        this.hasCollaborators = false;
        this.hasPotentialCollaborators = false;
        this.selectedPlan = new ContractPlan(-1);
    }
    MeetingListRhComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
        this.loading1 = true;
        this.loading2 = true;
        this.signInForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.pattern(Utils.EMAIL_REGEX)]],
            first_name: [''],
            last_name: [''],
        });
    };
    MeetingListRhComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
        this.onRefreshRequested();
    };
    MeetingListRhComponent.prototype.onRefreshRequested = function () {
        console.log('onRefreshRequested, getConnectedUser');
        this.onUserObtained(this.mUser);
    };
    MeetingListRhComponent.prototype.onUserObtained = function (user) {
        console.log('onUserObtained, user : ', user);
        if (user) {
            // rh
            console.log('get a rh');
            this.getAllCoacheesForRh(user.id);
            this.getAllPotentialCoacheesForRh(user.id);
            this.getAllContractPlans();
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
            _this.loading1 = false;
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
            _this.loading2 = false;
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
    MeetingListRhComponent.prototype.ngOnDestroy = function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
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
        // this.potentialCoacheeEmail = null;
        this.addPotentialCoacheeModalVisibility(false);
    };
    MeetingListRhComponent.prototype.validateAddPotentialCoachee = function () {
        // console.log('validateAddPotentialCoachee, potentialCoacheeEmail : ', this.potentialCoacheeEmail);
        var _this = this;
        this.addPotentialCoacheeModalVisibility(false);
        this.user.take(1).subscribe(function (user) {
            // let body = {
            //   "email": this.potentialCoacheeEmail,
            //   "plan_id": this.selectedPlan.plan_id,
            //   "rh_id": user.id,
            //   "first_name": this.potentialCoacheeFirstName,
            //   "last_name": this.potentialCoacheeLastName,
            // };
            // force Plan
            _this.selectedPlan.plan_id = 1;
            var body = {
                "email": _this.signInForm.value.email,
                "plan_id": _this.selectedPlan.plan_id,
                "rh_id": user.id,
                "first_name": _this.signInForm.value.first_name,
                "last_name": _this.signInForm.value.last_name,
            };
            console.log('postPotentialCoachee, body', body);
            _this.coachCoacheeService.postPotentialCoachee(body).subscribe(function (res) {
                console.log('postPotentialCoachee, res', res);
                _this.onRefreshRequested();
                Materialize.toast('Manager ajouté !', 3000, 'rounded');
            }, function (errorRes) {
                var json = errorRes.json();
                console.log('postPotentialCoachee, error', json);
                if (json.error == "EMAIL_ALREADY_USED") {
                    Materialize.toast("Impossible d'ajouter le manager, cet email est déjà utilisé", 3000, 'rounded');
                }
                else {
                    Materialize.toast("Impossible d'ajouter le manager", 3000, 'rounded');
                }
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
    __decorate([
        Input(),
        __metadata("design:type", HR)
    ], MeetingListRhComponent.prototype, "mUser", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], MeetingListRhComponent.prototype, "isAdmin", void 0);
    MeetingListRhComponent = __decorate([
        Component({
            selector: 'rb-meeting-list-rh',
            templateUrl: './meeting-list-rh.component.html',
            styleUrls: ['./meeting-list-rh.component.scss']
        }),
        __metadata("design:paramtypes", [AuthService, CoachCoacheeService, ChangeDetectorRef, FormBuilder])
    ], MeetingListRhComponent);
    return MeetingListRhComponent;
}());
export { MeetingListRhComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/meeting/meeting-list/rh/meeting-list-rh/meeting-list-rh.component.js.map