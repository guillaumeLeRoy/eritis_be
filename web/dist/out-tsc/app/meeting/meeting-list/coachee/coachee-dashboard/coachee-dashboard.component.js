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
import { AuthService } from "../../../../service/auth.service";
import { Router } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { Coachee } from "../../../../model/Coachee";
var CoacheeDashboardComponent = (function () {
    function CoacheeDashboardComponent(router, authService, cd) {
        this.router = router;
        this.authService = authService;
        this.cd = cd;
    }
    CoacheeDashboardComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
    };
    CoacheeDashboardComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
        this.onRefreshRequested();
    };
    CoacheeDashboardComponent.prototype.ngOnDestroy = function () {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        if (this.connectedUserSubscription) {
            this.connectedUserSubscription.unsubscribe();
        }
    };
    CoacheeDashboardComponent.prototype.onRefreshRequested = function () {
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
    CoacheeDashboardComponent.prototype.onUserObtained = function (user) {
        console.log('onUserObtained, user : ', user);
        if (user) {
            if (user instanceof Coachee) {
                // coachee
                console.log('get a coachee');
            }
            this.user = Observable.of(user);
            this.cd.detectChanges();
        }
    };
    CoacheeDashboardComponent.prototype.goToDate = function () {
        var _this = this;
        console.log('goToDate');
        this.user.take(1).subscribe(function (user) {
            if (user == null) {
                console.log('no connected user');
                return;
            }
            _this.router.navigate(['/date']);
        });
    };
    CoacheeDashboardComponent = __decorate([
        Component({
            selector: 'rb-coachee-dashboard',
            templateUrl: './coachee-dashboard.component.html',
            styleUrls: ['./coachee-dashboard.component.scss']
        }),
        __metadata("design:paramtypes", [Router, AuthService, ChangeDetectorRef])
    ], CoacheeDashboardComponent);
    return CoacheeDashboardComponent;
}());
export { CoacheeDashboardComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/meeting/meeting-list/coachee/coachee-dashboard/coachee-dashboard.component.js.map