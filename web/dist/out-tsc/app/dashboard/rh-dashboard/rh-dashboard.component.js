var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ChangeDetectorRef, Component, Input, ViewChild } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { HR } from "../../model/HR";
import { CoachCoacheeService } from "../../service/coach_coachee.service";
import { ContractPlan } from "../../model/ContractPlan";
import { FormBuilder, Validators } from "@angular/forms";
import { Utils } from "../../utils/Utils";
import { AuthService } from "../../service/auth.service";
import { MeetingListRhComponent } from "../../meeting/meeting-list/rh/meeting-list-rh/meeting-list-rh.component";
var RhDashboardComponent = (function () {
    function RhDashboardComponent(coachCoacheeService, cd, formBuilder, authService) {
        this.coachCoacheeService = coachCoacheeService;
        this.cd = cd;
        this.formBuilder = formBuilder;
        this.authService = authService;
        this.selectedPlan = new ContractPlan(-1);
        this.signInForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.pattern(Utils.EMAIL_REGEX)]],
            first_name: [''],
            last_name: [''],
        });
    }
    RhDashboardComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
    };
    RhDashboardComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        console.log('ngAfterViewInit');
        this.userSubscription = this.user.subscribe(function (hr) {
            _this.onUserObtained(hr);
        });
    };
    RhDashboardComponent.prototype.ngOnDestroy = function () {
        if (this.userSubscription) {
            this.userSubscription.unsubscribe();
        }
        if (this.connectedUserSubscription) {
            this.connectedUserSubscription.unsubscribe();
        }
        if (this.GetUsageRateSubscription) {
            this.GetUsageRateSubscription.unsubscribe();
        }
        if (this.updateCoacheeObjectiveSubscription) {
            this.updateCoacheeObjectiveSubscription.unsubscribe();
        }
    };
    RhDashboardComponent.prototype.onRefreshAllRequested = function () {
        console.log('onRefreshAllRequested');
        // call API GET user
        this.authService.refreshConnectedUser();
    };
    RhDashboardComponent.prototype.onUserObtained = function (user) {
        console.log('onUserObtained, user : ', user);
        if (user) {
            this.getUsageRate(user.id);
        }
    };
    RhDashboardComponent.prototype.getUsageRate = function (rhId) {
        var _this = this;
        this.GetUsageRateSubscription = this.coachCoacheeService.getUsageRate(rhId).subscribe(function (rate) {
            console.log("getUsageRate, rate : ", rate);
            _this.HrUsageRate = Observable.of(rate);
            _this.cd.detectChanges();
        });
    };
    /*************************************
     ----------- Modal control for new coachee's objective ------------
     *************************************/
    RhDashboardComponent.prototype.updateCoacheeObjectivePanelVisibility = function (visible) {
        if (visible) {
            $('#add_new_objective_modal').openModal();
        }
        else {
            $('#add_new_objective_modal').closeModal();
        }
    };
    RhDashboardComponent.prototype.makeAPICallToAddNewObjective = function (user) {
        var _this = this;
        this.updateCoacheeObjectivePanelVisibility(false);
        //call API
        this.updateCoacheeObjectiveSubscription = this.coachCoacheeService.addObjectiveToCoachee(user.id, this.addNewObjectiveCoacheeId, this.coacheeNewObjective)
            .subscribe(function (obj) {
            console.log('addObjectiveToCoachee, SUCCESS', obj);
            // close modal
            _this.updateCoacheeObjectivePanelVisibility(false);
            _this.meetingListComponent.onNewObjectifAdded();
            Materialize.toast("L'objectif a été modifié !", 3000, 'rounded');
            _this.coacheeNewObjective = null;
            _this.cd.detectChanges();
        }, function (error) {
            console.log('addObjectiveToCoachee, error', error);
            Materialize.toast("Imposible de modifier l'objectif", 3000, 'rounded');
        });
    };
    RhDashboardComponent.prototype.startAddNewObjectiveFlow = function (coacheeId) {
        console.log('startAddNewObjectiveFlow, coacheeId : ', coacheeId);
        this.updateCoacheeObjectivePanelVisibility(true);
        this.addNewObjectiveCoacheeId = coacheeId;
    };
    RhDashboardComponent.prototype.cancelAddNewObjectiveModal = function () {
        this.updateCoacheeObjectivePanelVisibility(false);
    };
    RhDashboardComponent.prototype.validateAddNewObjectiveModal = function () {
        var _this = this;
        console.log('validateAddNewObjectiveModal');
        this.user.take(1).subscribe(function (user) {
            console.log('validateAddNewObjectiveModal, got connected user');
            if (user instanceof HR) {
                _this.makeAPICallToAddNewObjective(user);
            }
            _this.cd.detectChanges();
        });
        return;
    };
    /*************************************
     ----------- Modal control for Potential Coachee ------------
     *************************************/
    RhDashboardComponent.prototype.addPotentialCoacheeModalVisibility = function (isVisible) {
        if (isVisible) {
            $('#add_potential_coachee_modal').openModal();
        }
        else {
            $('#add_potential_coachee_modal').closeModal();
        }
    };
    RhDashboardComponent.prototype.cancelAddPotentialCoachee = function () {
        // this.potentialCoacheeEmail = null;
        this.addPotentialCoacheeModalVisibility(false);
    };
    RhDashboardComponent.prototype.validateAddPotentialCoachee = function () {
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
                _this.signInForm = _this.formBuilder.group({
                    email: ['', [Validators.required, Validators.pattern(Utils.EMAIL_REGEX)]],
                    first_name: [''],
                    last_name: [''],
                });
                Materialize.toast('Manager ajouté !', 3000, 'rounded');
                _this.onRefreshAllRequested();
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
    __decorate([
        ViewChild(MeetingListRhComponent),
        __metadata("design:type", MeetingListRhComponent)
    ], RhDashboardComponent.prototype, "meetingListComponent", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Observable)
    ], RhDashboardComponent.prototype, "user", void 0);
    RhDashboardComponent = __decorate([
        Component({
            selector: 'er-rh-dashboard',
            templateUrl: './rh-dashboard.component.html',
            styleUrls: ['./rh-dashboard.component.scss']
        }),
        __metadata("design:paramtypes", [CoachCoacheeService, ChangeDetectorRef, FormBuilder, AuthService])
    ], RhDashboardComponent);
    return RhDashboardComponent;
}());
export { RhDashboardComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/dashboard/rh-dashboard/rh-dashboard.component.js.map