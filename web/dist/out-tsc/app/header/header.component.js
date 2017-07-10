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
import { NavigationEnd, Router } from "@angular/router";
import { AuthService } from "../service/auth.service";
import { Observable } from "rxjs";
import { Coach } from "../model/Coach";
import { Coachee } from "../model/Coachee";
import { HR } from "../model/HR";
import { CoachCoacheeService } from "../service/coach_coachee.service";
var HeaderComponent = (function () {
    function HeaderComponent(router, authService, coachCoacheeService, cd) {
        this.router = router;
        this.authService = authService;
        this.coachCoacheeService = coachCoacheeService;
        this.cd = cd;
        this.loginActivated = false;
        this.months = ['Jan', 'Feb', 'Mar', 'Avr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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
        this.router.events.subscribe(function (evt) {
            if (!(evt instanceof NavigationEnd)) {
                return;
            }
            console.log('Header navigation');
            window.scrollTo(0, 0);
        });
    };
    HeaderComponent.prototype.onUserObtained = function (user) {
        console.log('onUserObtained : ' + user);
        this.isAdminMode = Observable.of(false);
        if (this.isAdmin()) {
            this.user = null;
            this.isAuthenticated = Observable.of(false);
            this.isAdminMode = Observable.of(true);
        }
        if (user == null) {
            this.mUser = user;
            this.isAuthenticated = Observable.of(false);
        }
        else {
            this.mUser = user;
            this.isAuthenticated = Observable.of(true);
            this.fetchNotificationsForUser(user);
        }
        this.user = Observable.of(user);
        this.cd.detectChanges();
    };
    HeaderComponent.prototype.activateLogin = function () {
        this.loginActivated = true;
    };
    HeaderComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    HeaderComponent.prototype.onLogout = function () {
        window.scrollTo(0, 0);
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
    HeaderComponent.prototype.goToHome = function () {
        console.log('goToHome');
        if (this.isAuthenticated) {
            console.log('goToHomeUser');
            this.goToMeetings();
        }
        if (this.isAdmin()) {
            console.log('goToHomeAdmin');
            this.goToAdmin();
        }
        if (this.isSigningUp()) {
            console.log('goToWelcomePage');
            this.router.navigate(['/welcome']);
        }
    };
    HeaderComponent.prototype.goToAdmin = function () {
        window.scrollTo(0, 0);
        this.router.navigate(['/admin']);
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
        window.scrollTo(0, 0);
        if (this.mUser instanceof Coach) {
            this.router.navigate(['/profile_coach', this.mUser.id]);
        }
        else if (this.mUser instanceof Coachee) {
            this.router.navigate(['/profile_coachee', this.mUser.id]);
        }
        else if (this.mUser instanceof HR) {
            this.router.navigate(['/profile_rh']);
        }
    };
    // call API to inform that notifications have been read
    HeaderComponent.prototype.updateNotificationRead = function () {
        var user = this.authService.getConnectedUser();
        var obs;
        if (user != null) {
            if (user instanceof Coach) {
                var params = [user.id];
                obs = this.authService.put(AuthService.PUT_COACH_NOTIFICATIONS_READ, params, null);
            }
            else if (user instanceof Coachee) {
                var params = [user.id];
                obs = this.authService.put(AuthService.PUT_COACHEE_NOTIFICATIONS_READ, params, null);
            }
            if (obs != null) {
                obs.subscribe(function (response) {
                    console.log('updateNotificationRead response : ' + response);
                });
            }
        }
    };
    HeaderComponent.prototype.isUserACoach = function () {
        return this.mUser instanceof Coach;
    };
    HeaderComponent.prototype.isUserACoachee = function () {
        return this.mUser instanceof Coachee;
    };
    HeaderComponent.prototype.isUserARh = function () {
        return this.mUser instanceof HR;
    };
    HeaderComponent.prototype.isAdmin = function () {
        var admin = new RegExp('/admin');
        return admin.test(this.router.url);
    };
    HeaderComponent.prototype.isSigningUp = function () {
        var signupCoach = new RegExp('/signup_coach');
        var signupCoachee = new RegExp('/signup_coachee');
        var signupRh = new RegExp('/signup_rh');
        var registerCoach = new RegExp('/register_coach');
        return signupCoach.test(this.router.url) || signupCoachee.test(this.router.url) || signupRh.test(this.router.url) || registerCoach.test(this.router.url);
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
    HeaderComponent.prototype.fetchNotificationsForUser = function (user) {
        var _this = this;
        var param = user;
        this.coachCoacheeService.getAllNotificationsForUser(param).subscribe(function (notifs) {
            console.log('fetchNotificationsForUser : ' + notifs);
            //Sort notifs by date
            if (notifs != null) {
                notifs.sort(function (a, b) {
                    var d1 = new Date(a.date);
                    var d2 = new Date(b.date);
                    var res = d1.getUTCFullYear() - d2.getUTCFullYear();
                    if (res === 0)
                        res = d1.getUTCMonth() - d2.getUTCMonth();
                    if (res === 0)
                        res = d1.getUTCDate() - d2.getUTCDate();
                    if (res === 0)
                        res = d1.getUTCHours() - d2.getUTCHours();
                    return res;
                });
            }
            _this.notifications = Observable.of(notifs);
        });
    };
    HeaderComponent.prototype.printDateString = function (date) {
        return this.getDate(date) + ' - ' + this.getHours(date) + ':' + this.getMinutes(date);
    };
    HeaderComponent.prototype.getHours = function (date) {
        return (new Date(date)).getHours();
    };
    HeaderComponent.prototype.getMinutes = function (date) {
        var m = (new Date(date)).getMinutes();
        if (m === 0)
            return '00';
        return m;
    };
    HeaderComponent.prototype.getDate = function (date) {
        return (new Date(date)).getDate() + ' ' + this.months[(new Date(date)).getMonth()];
    };
    HeaderComponent.prototype.readAllNotifications = function () {
        var _this = this;
        this.coachCoacheeService.readAllNotificationsForUser(this.mUser).subscribe(function (response) {
            console.log("getAllNotifications OK", response);
            _this.fetchNotificationsForUser(_this.mUser);
            _this.cd.detectChanges();
        });
    };
    /******* Admin page *****/
    HeaderComponent.prototype.navigateAdminHome = function () {
        console.log("navigateAdminHome");
        window.scrollTo(0, 0);
        this.router.navigate(['/admin']);
    };
    HeaderComponent.prototype.navigateToSignup = function () {
        console.log("navigateToSignup");
        window.scrollTo(0, 0);
        this.router.navigate(['admin/signup']);
    };
    HeaderComponent.prototype.navigateToCoachsList = function () {
        console.log("navigateToCoachsList");
        window.scrollTo(0, 0);
        this.router.navigate(['admin/coachs-list']);
    };
    HeaderComponent.prototype.navigateToCoacheesList = function () {
        console.log("navigateToCoacheesList");
        window.scrollTo(0, 0);
        this.router.navigate(['admin/coachees-list']);
    };
    HeaderComponent.prototype.navigateToRhsList = function () {
        console.log("navigateToRhsList");
        window.scrollTo(0, 0);
        this.router.navigate(['admin/rhs-list']);
    };
    HeaderComponent.prototype.navigateToPossibleCoachsList = function () {
        console.log("navigateToPossibleCoachsList");
        this.router.navigate(['admin/possible_coachs-list']);
    };
    return HeaderComponent;
}());
HeaderComponent = __decorate([
    Component({
        selector: 'rb-header',
        templateUrl: 'header.component.html',
        styleUrls: ['./header.component.scss']
    }),
    __metadata("design:paramtypes", [Router, AuthService, CoachCoacheeService, ChangeDetectorRef])
], HeaderComponent);
export { HeaderComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/header/header.component.js.map