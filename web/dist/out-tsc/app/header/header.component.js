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
import { CookieService } from "ngx-cookie";
import { PromiseObservable } from "rxjs/observable/PromiseObservable";
import { FirebaseService } from "../service/firebase.service";
import { MeetingsService } from "../service/meetings.service";
import { Utils } from "../utils/Utils";
var HeaderComponent = (function () {
    function HeaderComponent(router, meetingService, authService, coachCoacheeService, cd, cookieService, firebase) {
        this.router = router;
        this.meetingService = meetingService;
        this.authService = authService;
        this.coachCoacheeService = coachCoacheeService;
        this.cd = cd;
        this.cookieService = cookieService;
        this.firebase = firebase;
        this.months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        this.hasAvailableMeetings = false;
        this.showCookiesMessage = false;
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
                // console.log("headerNav USER", this.mUser);
                // console.log("headerNav COOKIE", this.cookieService.get('ACTIVE_SESSION'));
                if (_this.mUser !== null && _this.cookieService.get('ACTIVE_SESSION') === undefined)
                    _this.onLogout();
            }
            window.scrollTo(0, 0);
        });
        // Cookie Headband
        this.showCookiesMessage = this.cookieService.get('ACCEPTS_COOKIES') === undefined;
    };
    HeaderComponent.prototype.onUserObtained = function (user) {
        console.log('onUserObtained : ' + user);
        if (this.isAdmin()) {
            this.user = null;
            this.isAuthenticated = Observable.of(false);
        }
        if (user == null) {
            this.mUser = user;
            this.isAuthenticated = Observable.of(false);
        }
        else {
            this.mUser = user;
            this.isAuthenticated = Observable.of(true);
            this.fetchNotificationsForUser(user);
            if (this.cookieService.get('ACTIVE_SESSION') === undefined)
                this.onLogout();
            else
                console.log('onUserObtained COOKIE', this.cookieService.get('ACTIVE_SESSION'));
            if (this.isUserACoach())
                this.getAvailableMeetings();
        }
        this.user = Observable.of(user);
        this.cd.detectChanges();
    };
    HeaderComponent.prototype.toggleLoginStatus = function () {
        $('#signin').slideToggle('slow');
    };
    HeaderComponent.prototype.ngOnDestroy = function () {
        this.subscription.unsubscribe();
    };
    HeaderComponent.prototype.onLogout = function () {
        console.log("login out");
        window.scrollTo(0, 0);
        $('.button-collapse').sideNav('hide');
        this.authService.loginOut();
    };
    HeaderComponent.prototype.onLogIn = function () {
        window.scrollTo(0, 0);
        this.router.navigate(['/signin']);
    };
    HeaderComponent.prototype.onSignUp = function () {
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
            this.navigateAdminHome();
        }
        else {
            console.log('goToWelcomePage');
            this.goToWelcomePage();
        }
    };
    HeaderComponent.prototype.goToWelcomePage = function () {
        $('.button-collapse').sideNav('hide');
        this.router.navigate(['/welcome']);
    };
    HeaderComponent.prototype.goToMeetings = function () {
        var user = this.authService.getConnectedUser();
        if (user != null) {
            this.router.navigate(['/meetings']);
        }
    };
    HeaderComponent.prototype.goToAvailableSessions = function () {
        var user = this.authService.getConnectedUser();
        if (user != null) {
            this.router.navigate(['/available_meetings']);
        }
    };
    HeaderComponent.prototype.goToProfile = function () {
        if (this.mUser instanceof Coach) {
            this.router.navigate(['/profile_coach', this.mUser.id]);
        }
        else if (this.mUser instanceof Coachee) {
            this.router.navigate(['/profile_coachee', this.mUser.id]);
        }
        else if (this.mUser instanceof HR) {
            this.router.navigate(['/profile_rh', this.mUser.id]);
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
    HeaderComponent.prototype.isHomePage = function () {
        var home = new RegExp('/welcome');
        return home.test(this.router.url);
    };
    HeaderComponent.prototype.isEditingProfile = function () {
        var profileCoach = new RegExp('/profile_coach');
        var profileCoachee = new RegExp('/profile_coachee');
        var profileRh = new RegExp('/profile_rh');
        return profileCoach.test(this.router.url) || profileCoachee.test(this.router.url) || profileRh.test(this.router.url);
    };
    HeaderComponent.prototype.isSigningUp = function () {
        var signupCoach = new RegExp('/signup_coach');
        var signupCoachee = new RegExp('/signup_coachee');
        var signupRh = new RegExp('/signup_rh');
        var registerCoach = new RegExp('/register_coach');
        return signupCoach.test(this.router.url) || signupCoachee.test(this.router.url) || signupRh.test(this.router.url) || registerCoach.test(this.router.url);
    };
    HeaderComponent.prototype.goToRegisterCoach = function () {
        this.router.navigate(['register_coach/step1']);
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
    HeaderComponent.prototype.getAvailableMeetings = function () {
        var _this = this;
        this.meetingService.getAvailableMeetings().subscribe(function (meetings) {
            console.log('got getAvailableMeetings', meetings);
            if (meetings != null && meetings.length > 0)
                _this.hasAvailableMeetings = true;
        });
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
        return Utils.dateToString(date) + ' - ' + Utils.getHoursAndMinutesFromDate(date);
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
        this.router.navigate(['/admin']);
    };
    HeaderComponent.prototype.navigateToSignup = function () {
        console.log("navigateToSignup");
        this.router.navigate(['admin/signup']);
    };
    HeaderComponent.prototype.navigateToCoachsList = function () {
        console.log("navigateToCoachsList");
        this.router.navigate(['admin/coachs-list']);
    };
    HeaderComponent.prototype.navigateToCoacheesList = function () {
        console.log("navigateToCoacheesList");
        this.router.navigate(['admin/coachees-list']);
    };
    HeaderComponent.prototype.navigateToRhsList = function () {
        console.log("navigateToRhsList");
        this.router.navigate(['admin/rhs-list']);
    };
    HeaderComponent.prototype.navigateToPossibleCoachsList = function () {
        console.log("navigateToPossibleCoachsList");
        this.router.navigate(['admin/possible_coachs-list']);
    };
    HeaderComponent.prototype.hideCookieHeadband = function () {
        $('#cookie_headband').fadeOut();
        this.cookieService.put('ACCEPTS_COOKIES', 'true');
    };
    /*************************************
     ----------- Modal control for forgot password ------------
     *************************************/
    HeaderComponent.prototype.onForgotPasswordClicked = function () {
        console.log('onForgotPasswordClicked');
        this.startForgotPasswordFlow();
    };
    HeaderComponent.prototype.updateForgotPasswordModalVisibility = function (isVisible) {
        if (isVisible) {
            $('#forgot_password_modal').openModal();
        }
        else {
            $('#forgot_password_modal').closeModal();
        }
    };
    HeaderComponent.prototype.startForgotPasswordFlow = function () {
        console.log('startForgotPasswordFlow');
        this.updateForgotPasswordModalVisibility(true);
    };
    HeaderComponent.prototype.cancelForgotPasswordModal = function () {
        this.updateForgotPasswordModalVisibility(false);
        this.forgotEmail = null;
    };
    HeaderComponent.prototype.validateForgotPasswordModal = function () {
        var _this = this;
        console.log('validateForgotPasswordModal');
        // make sure forgotEmail has a value
        var firebaseObs = PromiseObservable.create(this.firebase.sendPasswordResetEmail(this.forgotEmail));
        firebaseObs.subscribe(function () {
            console.log("sendPasswordResetEmail ");
            Materialize.toast("Email envoyé", 3000, 'rounded');
            _this.cancelForgotPasswordModal();
        }, function (error) {
            /**
             * {code: "auth/invalid-email", message: "The email address is badly formatted."}code: "auth/invalid-email"message: "The email address is badly formatted."__proto__: Error
             *
             * O {code: "auth/user-not-found", message: "There is no user record corresponding to this identifier. The user may have been deleted."}code: "auth/user-not-found"message: "There is no user record corresponding to this identifier. The user may have been deleted."__proto__: Error
             */
            console.log("sendPasswordResetEmail fail reason", error);
            if (error != undefined) {
                if (error.code == "auth/invalid-email") {
                    Materialize.toast("L'email n'est pas correctement formatté", 3000, 'rounded');
                    return;
                }
                else if (error.code == "auth/user-not-found") {
                    Materialize.toast("L'email ne correspond à aucun de nos utilisateurs", 3000, 'rounded');
                    return;
                }
            }
            Materialize.toast("Une erreur est survenue", 3000, 'rounded');
        });
    };
    HeaderComponent = __decorate([
        Component({
            selector: 'rb-header',
            templateUrl: 'header.component.html',
            styleUrls: ['./header.component.scss']
        }),
        __metadata("design:paramtypes", [Router, MeetingsService, AuthService, CoachCoacheeService, ChangeDetectorRef, CookieService, FirebaseService])
    ], HeaderComponent);
    return HeaderComponent;
}());
export { HeaderComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/header/header.component.js.map