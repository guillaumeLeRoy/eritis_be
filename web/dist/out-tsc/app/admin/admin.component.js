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
import { Router } from "@angular/router";
import { AdminAPIService } from "../service/adminAPI.service";
import { environment } from "../../environments/environment";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
var AdminComponent = (function () {
    function AdminComponent(router, adminHttpService) {
        this.router = router;
        this.adminHttpService = adminHttpService;
        this.admin = new BehaviorSubject(null);
    }
    AdminComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
        this.getAdmin();
    };
    AdminComponent.prototype.getAdmin = function () {
        var _this = this;
        if (environment.production) {
            this.adminHttpService.getAdmin().subscribe(function (admin) {
                console.log('getAdmin, obtained', admin);
                _this.admin.next(admin);
            }, function (error) {
                console.log('getAdmin, error obtained', error);
            });
        }
    };
    AdminComponent.prototype.isOnProfile = function () {
        var admin = new RegExp('/profile');
        return admin.test(this.router.url);
    };
    AdminComponent.prototype.navigateAdminHome = function () {
        console.log("navigateAdminHome");
        this.router.navigate(['/admin']);
    };
    AdminComponent.prototype.navigateToSignup = function () {
        console.log("navigateToSignup");
        this.router.navigate(['admin/signup']);
    };
    AdminComponent = __decorate([
        Component({
            selector: 'er-admin',
            templateUrl: './admin.component.html',
            styleUrls: ['./admin.component.scss']
        }),
        __metadata("design:paramtypes", [Router, AdminAPIService])
    ], AdminComponent);
    return AdminComponent;
}());
export { AdminComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/admin/admin.component.js.map