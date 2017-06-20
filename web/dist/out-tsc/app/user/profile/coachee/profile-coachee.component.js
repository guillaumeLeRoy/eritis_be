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
import { Observable } from "rxjs";
import { AuthService } from "../../../service/auth.service";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CoachCoacheeService } from "../../../service/coach_coachee.service";
var ProfileCoacheeComponent = (function () {
    function ProfileCoacheeComponent(authService, router, cd, formBuilder, coachService, route) {
        this.authService = authService;
        this.router = router;
        this.cd = cd;
        this.formBuilder = formBuilder;
        this.coachService = coachService;
        this.route = route;
        this.status = 'visiter';
    }
    ProfileCoacheeComponent.prototype.ngOnInit = function () {
        this.formCoachee = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            avatar: ['', Validators.required]
        });
        this.getCoachee();
        this.getUser();
    };
    ProfileCoacheeComponent.prototype.getCoachee = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            var coacheeId = params['id'];
            _this.status = params['status'];
            _this.coachService.getCoacheeForId(coacheeId).subscribe(function (coachee) {
                console.log("gotCoachee", coachee);
                _this.setFormValues(coachee);
                _this.coachee = Observable.of(coachee);
                _this.cd.detectChanges();
            });
        });
    };
    ProfileCoacheeComponent.prototype.getUser = function () {
        var _this = this;
        this.authService.getConnectedUserObservable().subscribe(function (user) {
            console.log('getConnectedUser : ' + user);
            _this.user = Observable.of(user);
            _this.cd.detectChanges();
        });
    };
    ProfileCoacheeComponent.prototype.setFormValues = function (coachee) {
        this.formCoachee.setValue({
            firstName: coachee.firstName,
            lastName: coachee.lastName,
            avatar: coachee.avatar_url
        });
    };
    ProfileCoacheeComponent.prototype.submitCoacheeProfilUpdate = function () {
        var _this = this;
        console.log("submitCoacheeProfilUpdate");
        this.coachee.last().flatMap(function (coachee) {
            console.log("submitCoacheeProfilUpdate, coachee obtained");
            return _this.authService.updateCoacheeForId(coachee.id, _this.formCoachee.value.firstName, _this.formCoachee.value.lastName, _this.formCoachee.value.avatar);
        }).subscribe(function (user) {
            console.log("coachee updated : ", user);
            //refresh page
            Materialize.toast('Votre profil a été modifié !', 3000, 'rounded');
            _this.getCoachee();
        }, function (error) {
            console.log('coachee update, error', error);
            //TODO display error
            Materialize.toast('Impossible de modifier votre profil', 3000, 'rounded');
        });
    };
    ProfileCoacheeComponent.prototype.goToMeetings = function () {
        window.scrollTo(0, 0);
        this.router.navigate(['/meetings']);
    };
    ProfileCoacheeComponent.prototype.ngAfterViewInit = function () {
        // let user: ApiUser = this.authService.getConnectedUser();
        // console.log("ngAfterViewInit, user : ", user);
        // this.onUserObtained(user);
        //
        // this.connectedUserSubscription = this.authService.getConnectedUserObservable().subscribe(
        //   (user: ApiUser) => {
        //     console.log("getConnectedUser");
        //     this.onUserObtained(user);
        //   }
        // );
    };
    ProfileCoacheeComponent.prototype.ngOnDestroy = function () {
        // if (this.connectedUserSubscription) {
        //   this.connectedUserSubscription.unsubscribe();
        // }
    };
    return ProfileCoacheeComponent;
}());
ProfileCoacheeComponent = __decorate([
    Component({
        selector: 'rb-profile-coachee',
        templateUrl: 'profile-coachee.component.html',
        styleUrls: ['profile-coachee.component.css']
    }),
    __metadata("design:paramtypes", [AuthService, Router, ChangeDetectorRef, FormBuilder, CoachCoacheeService, ActivatedRoute])
], ProfileCoacheeComponent);
export { ProfileCoacheeComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/user/profile/coachee/profile-coachee.component.js.map