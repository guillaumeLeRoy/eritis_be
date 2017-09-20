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
var ProfileRhAdminComponent = (function () {
    function ProfileRhAdminComponent(cd, route, apiService, router) {
        this.cd = cd;
        this.route = route;
        this.apiService = apiService;
        this.router = router;
        this.loading = true;
    }
    ProfileRhAdminComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
        this.loading = true;
        this.getRh();
    };
    ProfileRhAdminComponent.prototype.ngAfterViewInit = function () {
        console.log("afterViewInit");
        // this.isOwner = (user instanceof Coach) && (coach.email === user.email);
    };
    ProfileRhAdminComponent.prototype.getRh = function () {
        var _this = this;
        console.log("getRh");
        this.subscriptionGetRh = this.route.params.subscribe(function (params) {
            var rhId = params['id'];
            _this.apiService.getRh(rhId).subscribe(function (rh) {
                console.log("gotRh", rh);
                _this.mrh = rh;
                _this.rh = Observable.of(rh);
                _this.cd.detectChanges();
                _this.loading = false;
            }, function (error) {
                console.log('getRh, error', error);
                _this.loading = false;
            });
        });
    };
    ProfileRhAdminComponent.prototype.goToRhsAdmin = function () {
        this.router.navigate(['admin/rhs-list']);
    };
    ProfileRhAdminComponent.prototype.ngOnDestroy = function () {
        if (this.subscriptionGetRh) {
            console.log("Unsubscribe rh");
            this.subscriptionGetRh.unsubscribe();
        }
    };
    ProfileRhAdminComponent = __decorate([
        Component({
            selector: 'rb-profile-rh-admin',
            templateUrl: './profile-rh-admin.component.html',
            styleUrls: ['./profile-rh-admin.component.scss']
        }),
        __metadata("design:paramtypes", [ChangeDetectorRef, ActivatedRoute, AdminAPIService, Router])
    ], ProfileRhAdminComponent);
    return ProfileRhAdminComponent;
}());
export { ProfileRhAdminComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/user/profile/rh/profile-rh-admin/profile-rh-admin.component.js.map