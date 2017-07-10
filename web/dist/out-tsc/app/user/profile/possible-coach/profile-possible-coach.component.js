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
import { ActivatedRoute, Router } from "@angular/router";
import { AdminAPIService } from "../../../service/adminAPI.service";
import { Observable } from "rxjs/Observable";
var ProfilePossibleCoachComponent = (function () {
    function ProfilePossibleCoachComponent(apiService, router, cd, route) {
        this.apiService = apiService;
        this.router = router;
        this.cd = cd;
        this.route = route;
    }
    ProfilePossibleCoachComponent.prototype.ngOnInit = function () {
        this.getCoach();
    };
    ProfilePossibleCoachComponent.prototype.getCoach = function () {
        var _this = this;
        console.log("getCoach");
        this.subscriptionGetCoach = this.route.params.subscribe(function (params) {
            var coachId = params['id'];
            _this.apiService.getPossibleCoach(coachId).subscribe(function (possibleCoach) {
                console.log("getPossibleCoach", possibleCoach);
                _this.possibleCoach = Observable.of(possibleCoach);
                _this.cd.detectChanges();
            }, function (error) {
                console.log('getCoach, error', error);
            });
        });
    };
    ProfilePossibleCoachComponent.prototype.ngAfterViewInit = function () {
        console.log("afterViewInit");
        // this.isOwner = (user instanceof Coach) && (coach.email === user.email);
    };
    ProfilePossibleCoachComponent.prototype.sendInvite = function (email) {
        var _this = this;
        console.log('sendInvite, email', email);
        this.apiService.createPotentialCoach(email).subscribe(function (res) {
            console.log('createPotentialCoach, res', res);
            _this.getCoach();
            Materialize.toast('Invitation envoyée au Coach !', 3000, 'rounded');
        }, function (error) {
            console.log('createPotentialCoach, error', error);
            Materialize.toast("Impossible d'ajouter le Coach", 3000, 'rounded');
        });
    };
    ProfilePossibleCoachComponent.prototype.goToPossibleCoachsAdmin = function () {
        this.router.navigate(['admin/possible_coachs-list']);
    };
    ProfilePossibleCoachComponent.prototype.ngOnDestroy = function () {
        if (this.subscriptionGetCoach) {
            console.log("Unsubscribe coach");
            this.subscriptionGetCoach.unsubscribe();
        }
    };
    return ProfilePossibleCoachComponent;
}());
ProfilePossibleCoachComponent = __decorate([
    Component({
        selector: 'rb-possible-coach',
        templateUrl: './profile-possible-coach.component.html',
        styleUrls: ['./profile-possible-coach.component.scss']
    }),
    __metadata("design:paramtypes", [AdminAPIService, Router, ChangeDetectorRef, ActivatedRoute])
], ProfilePossibleCoachComponent);
export { ProfilePossibleCoachComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/user/profile/possible-coach/profile-possible-coach.component.js.map