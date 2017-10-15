var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CoachCoacheeService } from "../../../../service/coach_coachee.service";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
var ProfileRhAdminComponent = (function () {
    function ProfileRhAdminComponent(route, apiService) {
        this.route = route;
        this.apiService = apiService;
        this.loading = true;
        this.rh = new BehaviorSubject(null);
    }
    ProfileRhAdminComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
        this.loading = true;
        this.getRh();
    };
    ProfileRhAdminComponent.prototype.ngOnDestroy = function () {
        if (this.subscriptionGetRh) {
            console.log("Unsubscribe rh");
            this.subscriptionGetRh.unsubscribe();
        }
        if (this.subscriptionGetRoute) {
            console.log("Unsubscribe route");
            this.subscriptionGetRoute.unsubscribe();
        }
    };
    ProfileRhAdminComponent.prototype.getRh = function () {
        var _this = this;
        console.log("getRh");
        this.subscriptionGetRoute = this.route.params.subscribe(function (params) {
            var rhId = params['id'];
            _this.subscriptionGetRh = _this.apiService.getRhForId(rhId, true).subscribe(function (rh) {
                console.log("gotRh", rh);
                _this.rh.next(rh);
                // this.cd.detectChanges();
                _this.loading = false;
            }, function (error) {
                console.log('getRh, error', error);
                _this.loading = false;
            });
        });
    };
    ProfileRhAdminComponent = __decorate([
        Component({
            selector: 'er-profile-rh-admin',
            templateUrl: './profile-rh-admin.component.html',
            styleUrls: ['./profile-rh-admin.component.scss']
        }),
        __metadata("design:paramtypes", [ActivatedRoute, CoachCoacheeService])
    ], ProfileRhAdminComponent);
    return ProfileRhAdminComponent;
}());
export { ProfileRhAdminComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/user/profile/rh/profile-rh-admin/profile-rh-admin.component.js.map