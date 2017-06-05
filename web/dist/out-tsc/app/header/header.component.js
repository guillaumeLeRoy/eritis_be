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
import { Router } from "@angular/router";
import { AuthService } from "../service/auth.service";
import { Observable } from "rxjs";
import { Coach } from "../model/Coach";
import { Coachee } from "../model/Coachee";
import { Rh } from "../model/Rh";
var HeaderComponent = (function () {
    function HeaderComponent(router, authService, cd) {
        this.router = router;
        this.authService = authService;
        this.cd = cd;
    }
    HeaderComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.mUser = this.authService.getConnectedUser();
        this.onUserObtained(this.mUser);
        // this.isAuthenticated = this.authService.isAuthenticated();
        // this.authService.isAuthenticated().subscribe(
        //   (isAuth: boolean) => {
        //     console.log("isAuthenticated : " + isAuth);
        //     this.isAuthenticated = Observable.of(isAuth);
        //     this.cd.detectChanges();
        //   }
        // );
        if (this.user == null) {
            // Un utilisateur non connecté est redirigé sur la page d'accueil
            window.scrollTo(0, 0);
            this.router.navigate(['/']);
        }
        // this.connectedUser = this.authService.getConnectedUserObservable();
        this.subscription = this.authService.getConnectedUserObservable().subscribe(function (user) {
            console.log('getConnectedUser : ' + user);
            _this.onUserObtained(user);
        });
    };
    HeaderComponent.prototype.onUserObtained = function (user) {
        console.log('onUserObtained : ' + user);
        if (user == null) {
            this.mUser = user;
            this.isAuthenticated = Observable.of(false);
        }
        else {
            this.mUser = user;
            this.isAuthenticated = Observable.of(true);
        }
        this.user = Observable.of(user);
        this.cd.detectChanges();
    };
    HeaderComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    HeaderComponent.prototype.onLogout = function () {
        this.authService.loginOut();
    };
    HeaderComponent.prototype.onLogIn = function () {
        window.scrollTo(0, 0);
        this.router.navigate(['/signin']);
    };
    HeaderComponent.prototype.onSignUp = function () {
        window.scrollTo(0, 0);
        this.router.navigate(['/signup']);
    };
    HeaderComponent.prototype.goToMeetings = function () {
        var user = this.authService.getConnectedUser();
        if (user != null) {
            window.scrollTo(0, 0);
            this.router.navigate(['/meetings']);
        }
    };
    HeaderComponent.prototype.goToAvailableSessions = function () {
        var user = this.authService.getConnectedUser();
        if (user != null) {
            window.scrollTo(0, 0);
            this.router.navigate(['/available_meetings']);
        }
    };
    HeaderComponent.prototype.goToProfile = function () {
        if (this.mUser instanceof Coach) {
            window.scrollTo(0, 0);
            this.router.navigate(['/profile_coach']);
        }
        else if (this.mUser instanceof Coachee) {
            window.scrollTo(0, 0);
            this.router.navigate(['/profile_coachee']);
        }
        else if (this.mUser instanceof Rh) {
            window.scrollTo(0, 0);
            this.router.navigate(['/profile_rh']);
        }
    };
    HeaderComponent.prototype.isUserACoach = function () {
        return this.mUser instanceof Coach;
    };
    HeaderComponent.prototype.goToCoachs = function () {
        window.scrollTo(0, 0);
        this.router.navigate(['/coachs']);
    };
    HeaderComponent.prototype.canDisplayListOfCoach = function () {
        if (this.mUser == null) {
            return false;
        }
        if (this.mUser instanceof Coach) {
            return false;
        }
        else {
            return true;
        }
    };
    return HeaderComponent;
}());
HeaderComponent = __decorate([
    Component({
        selector: 'rb-header',
        templateUrl: 'header.component.html',
        styleUrls: ['header.component.css']
    }),
    __metadata("design:paramtypes", [Router, AuthService, ChangeDetectorRef])
], HeaderComponent);
export { HeaderComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/header/header.component.js.map