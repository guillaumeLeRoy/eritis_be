var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from "@angular/core";
import { CoachCoacheeService } from "../../../../service/coach_coachee.service";
import { Observable } from "rxjs/Observable";
var MeetingListRhComponent = (function () {
    function MeetingListRhComponent(coachCoacheeService, cd) {
        this.coachCoacheeService = coachCoacheeService;
        this.cd = cd;
        this.loading1 = true;
        this.loading2 = true;
        this.isAdmin = false;
        this.onStartAddNewObjectiveFlow = new EventEmitter();
        this.hasCollaborators = false;
        this.hasPotentialCollaborators = false;
    }
    MeetingListRhComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log('ngOnInit');
        this.loading1 = true;
        this.loading2 = true;
        this.userSubscription = this.user.subscribe(function (user) {
            _this.onUserObtained(user);
        });
    };
    MeetingListRhComponent.prototype.ngOnDestroy = function () {
        if (this.getAllCoacheesForRhSubscription)
            this.getAllCoacheesForRhSubscription.unsubscribe();
        if (this.getAllPotentialCoacheesForRhSubscription)
            this.getAllPotentialCoacheesForRhSubscription.unsubscribe();
        if (this.userSubscription)
            this.userSubscription.unsubscribe();
    };
    MeetingListRhComponent.prototype.startAddNewObjectiveFlow = function (coacheeId) {
        this.onStartAddNewObjectiveFlow.emit(coacheeId);
    };
    // call from parent
    MeetingListRhComponent.prototype.onNewObjectifAdded = function () {
        var _this = this;
        console.log('onNewObjectifAdded');
        this.user.first().subscribe(function (user) {
            _this.onUserObtained(user);
        });
    };
    MeetingListRhComponent.prototype.onUserObtained = function (user) {
        console.log('onUserObtained, user : ', user);
        if (user) {
            // rh
            console.log('get a rh');
            this.getAllCoacheesForRh(user.id);
            this.getAllPotentialCoacheesForRh(user.id);
            //this.getAllContractPlans();
        }
    };
    MeetingListRhComponent.prototype.getAllCoacheesForRh = function (rhId) {
        var _this = this;
        this.getAllCoacheesForRhSubscription = this.coachCoacheeService.getAllCoacheesForRh(rhId, this.isAdmin)
            .subscribe(function (coachees) {
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
        this.getAllPotentialCoacheesForRhSubscription = this.coachCoacheeService.getAllPotentialCoacheesForRh(rhId, this.isAdmin)
            .subscribe(function (coachees) {
            console.log('got potentialCoachees for rh', coachees);
            _this.potentialCoachees = Observable.of(coachees);
            if (coachees !== null && coachees.length > 0)
                _this.hasPotentialCollaborators = true;
            _this.cd.detectChanges();
            _this.loading2 = false;
        });
    };
    __decorate([
        Input(),
        __metadata("design:type", Observable)
    ], MeetingListRhComponent.prototype, "user", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], MeetingListRhComponent.prototype, "isAdmin", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], MeetingListRhComponent.prototype, "onStartAddNewObjectiveFlow", void 0);
    MeetingListRhComponent = __decorate([
        Component({
            selector: 'er-meeting-list-rh',
            templateUrl: './meeting-list-rh.component.html',
            styleUrls: ['./meeting-list-rh.component.scss']
        }),
        __metadata("design:paramtypes", [CoachCoacheeService, ChangeDetectorRef])
    ], MeetingListRhComponent);
    return MeetingListRhComponent;
}());
export { MeetingListRhComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/meeting/meeting-list/rh/meeting-list-rh/meeting-list-rh.component.js.map