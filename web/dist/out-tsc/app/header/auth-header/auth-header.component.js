var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ChangeDetectorRef, Component, Input } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../service/auth.service";
import { Observable } from "rxjs";
import { Coach } from "../../model/Coach";
import { Coachee } from "../../model/Coachee";
import { HR } from "../../model/HR";
import { CoachCoacheeService } from "../../service/coach_coachee.service";
import { MeetingsService } from "../../service/meetings.service";
import { Utils } from "../../utils/Utils";
var AuthHeaderComponent = (function () {
    function AuthHeaderComponent(router, meetingService, authService, coachCoacheeService, cd) {
        this.router = router;
        this.meetingService = meetingService;
        this.authService = authService;
        this.coachCoacheeService = coachCoacheeService;
        this.cd = cd;
        this.isAdmin = false;
        this.hasAvailableMeetings = false;
    }
    AuthHeaderComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
        this.router.events.subscribe(function (evt) {
            window.scrollTo(0, 0);
        });
    };
    AuthHeaderComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        console.log('ngAfterViewInit');
        this.userSubscription = this.user.subscribe(function (user) {
            _this.onUserObtained(user);
        });
        this.initJS();
    };
    AuthHeaderComponent.prototype.ngOnDestroy = function () {
        console.log('ngOnDestroy');
        if (this.routerEventSubscription)
            this.routerEventSubscription.unsubscribe();
        if (this.userSubscription)
            this.userSubscription.unsubscribe();
        if (this.getAvailableMeetingsSubscription)
            this.getAvailableMeetingsSubscription.unsubscribe();
        if (this.getAllNotifSubscription)
            this.getAllNotifSubscription.unsubscribe();
        if (this.readAllNotifSubscription)
            this.readAllNotifSubscription.unsubscribe();
    };
    AuthHeaderComponent.prototype.onUserObtained = function (user) {
        console.log('onUserObtained : ' + user);
        if (user) {
            this.mUser = user;
            this.fetchNotificationsForUser(user);
            if (this.isUserACoach(user)) {
                this.getAvailableMeetings();
            }
        }
    };
    AuthHeaderComponent.prototype.onLogout = function () {
        console.log("login out");
        $('.button-collapse').sideNav('hide');
        this.authService.loginOut();
    };
    AuthHeaderComponent.prototype.onSignUp = function () {
        this.router.navigate(['/signup']);
    };
    AuthHeaderComponent.prototype.goToHome = function () {
        console.log('goToHome');
        if (!this.isAdmin) {
            console.log('goToHomeUser');
            this.goToMeetings();
        }
        else {
            console.log('goToHomeAdmin');
            this.navigateAdminHome();
        }
    };
    AuthHeaderComponent.prototype.goToWelcomePage = function () {
        $('.button-collapse').sideNav('hide');
        this.router.navigate(['welcome']);
    };
    AuthHeaderComponent.prototype.goToMeetings = function () {
        this.router.navigate(['dashboard/meetings']);
    };
    AuthHeaderComponent.prototype.goToAvailableSessions = function () {
        this.router.navigate(['dashboard/available_meetings']);
    };
    AuthHeaderComponent.prototype.goToProfile = function () {
        var _this = this;
        this.user.take(1).subscribe(function (user) {
            if (_this.isUserACoach(user)) {
                _this.router.navigate(['dashboard/profile_coach', user.id]);
            }
            else if (_this.isUserACoachee(user)) {
                _this.router.navigate(['dashboard/profile_coachee', user.id]);
            }
            else if (_this.isUserARh(user)) {
                _this.router.navigate(['dashboard/profile_rh', user.id]);
            }
        });
    };
    // call API to inform that notifications have been read
    // updateNotificationRead() {
    //   let user = this.authService.getConnectedUser();
    //   let obs: Observable<Response>;
    //   if (user != null) {
    //     if (user instanceof Coach) {
    //       let params = [user.id];
    //       obs = this.authService.put(AuthService.PUT_COACH_NOTIFICATIONS_READ, params, null);
    //     } else if (user instanceof Coachee) {
    //       let params = [user.id];
    //       obs = this.authService.put(AuthService.PUT_COACHEE_NOTIFICATIONS_READ, params, null);
    //     }
    //
    //     if (obs != null) {
    //       obs.subscribe((response: Response) => {
    //         console.log('updateNotificationRead response : ' + response);
    //       }).unsubscribe();
    //     }
    //
    //   }
    // }
    AuthHeaderComponent.prototype.isUserACoach = function (user) {
        return user instanceof Coach;
    };
    AuthHeaderComponent.prototype.isUserACoachee = function (user) {
        return user instanceof Coachee;
    };
    AuthHeaderComponent.prototype.isUserARh = function (user) {
        return user instanceof HR;
    };
    AuthHeaderComponent.prototype.isEditingProfile = function () {
        var profileCoach = new RegExp('/profile_coach');
        var profileCoachee = new RegExp('/profile_coachee');
        var profileRh = new RegExp('/profile_rh');
        return profileCoach.test(this.router.url) || profileCoachee.test(this.router.url) || profileRh.test(this.router.url);
    };
    // canDisplayListOfCoach(): boolean {
    //   if (this.mUser == null)
    //     return false;
    //
    //   if (this.mUser instanceof Coach)
    //     return false;
    //   else
    //     return true;
    // }
    AuthHeaderComponent.prototype.getAvailableMeetings = function () {
        var _this = this;
        this.getAvailableMeetingsSubscription = this.meetingService.getAvailableMeetings().subscribe(function (meetings) {
            console.log('got getAvailableMeetings', meetings);
            if (meetings != null && meetings.length > 0)
                _this.hasAvailableMeetings = true;
            _this.cd.detectChanges();
        });
    };
    AuthHeaderComponent.prototype.fetchNotificationsForUser = function (user) {
        var _this = this;
        var param = user;
        this.getAllNotifSubscription = this.coachCoacheeService.getAllNotificationsForUser(param).subscribe(function (notifs) {
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
            _this.cd.detectChanges();
        });
    };
    AuthHeaderComponent.prototype.printDateString = function (date) {
        return Utils.dateToString(date) + ' - ' + Utils.getHoursAndMinutesFromDate(date);
    };
    AuthHeaderComponent.prototype.readAllNotifications = function () {
        var _this = this;
        this.readAllNotifSubscription = this.coachCoacheeService.readAllNotificationsForUser(this.mUser)
            .subscribe(function (response) {
            console.log("getAllNotifications OK", response);
            _this.fetchNotificationsForUser(_this.mUser);
            _this.cd.detectChanges();
        });
    };
    /******* Admin page *****/
    AuthHeaderComponent.prototype.navigateAdminHome = function () {
        console.log("navigateAdminHome");
        this.router.navigate(['/admin']);
    };
    AuthHeaderComponent.prototype.navigateToSignup = function () {
        console.log("navigateToSignup");
        this.router.navigate(['admin/signup']);
    };
    AuthHeaderComponent.prototype.navigateToCoachsList = function () {
        console.log("navigateToCoachsList");
        this.router.navigate(['admin/coachs-list']);
    };
    AuthHeaderComponent.prototype.navigateToCoacheesList = function () {
        console.log("navigateToCoacheesList");
        this.router.navigate(['admin/coachees-list']);
    };
    AuthHeaderComponent.prototype.navigateToRhsList = function () {
        console.log("navigateToRhsList");
        this.router.navigate(['admin/rhs-list']);
    };
    AuthHeaderComponent.prototype.navigateToPossibleCoachsList = function () {
        console.log("navigateToPossibleCoachsList");
        this.router.navigate(['admin/possible_coachs-list']);
    };
    AuthHeaderComponent.prototype.initJS = function () {
        $('.button-collapse').sideNav({
            menuWidth: 400,
            edge: 'left',
            closeOnClick: true,
            draggable: true // Choose whether you can drag to open on touch screens
        });
        $('.dropdown-button-notifs').dropdown({
            inDuration: 300,
            outDuration: 125,
            constrain_width: false,
            hover: false,
            alignment: 'right',
            gutter: 0,
            belowOrigin: true // Displays dropdown below the button
        });
        $('.dropdown-button-profile').dropdown({
            inDuration: 300,
            outDuration: 125,
            constrain_width: false,
            hover: false,
            alignment: 'right',
            gutter: 0,
            belowOrigin: true // Displays dropdown below the button
        });
    };
    __decorate([
        Input(),
        __metadata("design:type", Observable)
    ], AuthHeaderComponent.prototype, "user", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Boolean)
    ], AuthHeaderComponent.prototype, "isAdmin", void 0);
    AuthHeaderComponent = __decorate([
        Component({
            selector: 'er-auth-header',
            templateUrl: './auth-header.component.html',
            styleUrls: ['./auth-header.component.scss']
        }),
        __metadata("design:paramtypes", [Router, MeetingsService, AuthService, CoachCoacheeService,
            ChangeDetectorRef])
    ], AuthHeaderComponent);
    return AuthHeaderComponent;
}());
export { AuthHeaderComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/header/auth-header/auth-header.component.js.map