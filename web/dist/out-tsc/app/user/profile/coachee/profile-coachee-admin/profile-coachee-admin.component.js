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
import { ActivatedRoute, Router } from "@angular/router";
import { AdminAPIService } from "../../../../service/adminAPI.service";
var ProfileCoacheeAdminComponent = (function () {
    function ProfileCoacheeAdminComponent(router, cd, apiService, route) {
        this.router = router;
        this.cd = cd;
        this.apiService = apiService;
        this.route = route;
    }
    ProfileCoacheeAdminComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
        this.getCoachee();
    };
    ProfileCoacheeAdminComponent.prototype.getCoachee = function () {
        var _this = this;
        this.subscriptionGetCoachee = this.route.params.subscribe(function (params) {
            var coacheeId = params['id'];
            _this.apiService.getCoachee(coacheeId).subscribe(function (coachee) {
                console.log("gotCoachee", coachee);
                _this.coachee = Observable.of(coachee);
                _this.cd.detectChanges();
            });
        });
    };
    ProfileCoacheeAdminComponent.prototype.goToCoacheesAdmin = function () {
        window.scrollTo(0, 0);
        this.router.navigate(['admin/coachees-list']);
    };
    ProfileCoacheeAdminComponent.prototype.ngAfterViewInit = function () {
    };
    ProfileCoacheeAdminComponent.prototype.ngOnDestroy = function () {
        if (this.subscriptionGetCoachee) {
            console.log("Unsubscribe coach");
            this.subscriptionGetCoachee.unsubscribe();
        }
    };
    return ProfileCoacheeAdminComponent;
}());
ProfileCoacheeAdminComponent = __decorate([
    Component({
        selector: 'rb-profile-coachee-admin',
        templateUrl: './profile-coachee-admin.component.html',
        styleUrls: ['./profile-coachee-admin.component.scss']
    }),
    __metadata("design:paramtypes", [Router, ChangeDetectorRef, AdminAPIService, ActivatedRoute])
], ProfileCoacheeAdminComponent);
export { ProfileCoacheeAdminComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/user/profile/coachee/profile-coachee-admin/profile-coachee-admin.component.js.map