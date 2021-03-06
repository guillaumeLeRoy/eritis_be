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
import { CoachCoacheeService } from "../../../../service/coach_coachee.service";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
var ProfileCoacheeAdminComponent = (function () {
    function ProfileCoacheeAdminComponent(router, cd, apiService, route) {
        this.router = router;
        this.cd = cd;
        this.apiService = apiService;
        this.route = route;
        this.loading = true;
        this.coachee = new BehaviorSubject(null);
    }
    ProfileCoacheeAdminComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
        this.loading = true;
        this.getCoachee();
    };
    ProfileCoacheeAdminComponent.prototype.ngAfterViewInit = function () {
    };
    ProfileCoacheeAdminComponent.prototype.ngOnDestroy = function () {
        if (this.subscriptionGetCoachee) {
            console.log("Unsubscribe coach");
            this.subscriptionGetCoachee.unsubscribe();
        }
        if (this.subscriptionGetRoute) {
            console.log("Unsubscribe route");
            this.subscriptionGetRoute.unsubscribe();
        }
    };
    ProfileCoacheeAdminComponent.prototype.getCoachee = function () {
        var _this = this;
        this.subscriptionGetRoute = this.route.params.subscribe(function (params) {
            var coacheeId = params['id'];
            _this.subscriptionGetCoachee = _this.apiService.getCoacheeForId(coacheeId, true).subscribe(function (coachee) {
                console.log("gotCoachee", coachee);
                _this.coachee.next(coachee);
                _this.rhId = coachee.associatedRh.id;
                // this.cd.detectChanges();
                _this.loading = false;
            });
        });
    };
    ProfileCoacheeAdminComponent.prototype.goToRhProfile = function () {
        this.router.navigate(['admin/profile/rh', this.rhId]);
    };
    ProfileCoacheeAdminComponent = __decorate([
        Component({
            selector: 'er-profile-coachee-admin',
            templateUrl: './profile-coachee-admin.component.html',
            styleUrls: ['./profile-coachee-admin.component.scss']
        }),
        __metadata("design:paramtypes", [Router, ChangeDetectorRef, CoachCoacheeService, ActivatedRoute])
    ], ProfileCoacheeAdminComponent);
    return ProfileCoacheeAdminComponent;
}());
export { ProfileCoacheeAdminComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/user/profile/coachee/profile-coachee-admin/profile-coachee-admin.component.js.map