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
import { Observable } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { Coach } from "../../../model/Coach";
import { AuthService } from "../../../service/auth.service";
import { CoachCoacheeService } from "../../../service/coach_coachee.service";
import { FormBuilder, Validators } from "@angular/forms";
var ProfileCoachComponent = (function () {
    function ProfileCoachComponent(authService, router, cd, formBuilder, coachService, route) {
        this.authService = authService;
        this.router = router;
        this.cd = cd;
        this.formBuilder = formBuilder;
        this.coachService = coachService;
        this.route = route;
        this.status = 'visiter';
    }
    ProfileCoachComponent.prototype.ngOnInit = function () {
        this.formCoach = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            avatar: ['', Validators.required],
            description: ['', Validators.required],
        });
        this.getCoach();
        this.getUser();
    };
    ProfileCoachComponent.prototype.getCoach = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            var coachId = params['id'];
            _this.status = params['status'];
            _this.coachService.getCoachForId(coachId).subscribe(function (coach) {
                console.log("gotCoach", coach);
                _this.setFormValues(coach);
                _this.coach = Observable.of(coach);
                _this.cd.detectChanges();
            });
        });
    };
    ProfileCoachComponent.prototype.getUser = function () {
        var _this = this;
        this.authService.getConnectedUserObservable().subscribe(function (user) {
            console.log('getConnectedUser : ' + user);
            _this.user = Observable.of(user);
            _this.cd.detectChanges();
        });
    };
    ProfileCoachComponent.prototype.setFormValues = function (coach) {
        this.formCoach.setValue({
            firstName: coach.firstName,
            lastName: coach.lastName,
            avatar: coach.avatar_url,
            description: coach.description
        });
    };
    ProfileCoachComponent.prototype.submitCoachProfilUpdate = function () {
        var _this = this;
        console.log("submitCoachProfilUpdate");
        this.coach.last().flatMap(function (coach) {
            console.log("submitCoachProfilUpdate, coach obtained");
            return _this.authService.updateCoachForId(coach.id, _this.formCoach.value.firstName, _this.formCoach.value.lastName, _this.formCoach.value.description, _this.formCoach.value.avatar);
        }).subscribe(function (user) {
            console.log("coach updated : ", user);
            //refresh page
            Materialize.toast('Votre profil a été modifié !', 3000, 'rounded');
            _this.getCoach();
        }, function (error) {
            console.log('coach update, error', error);
            //TODO display error
            Materialize.toast('Impossible de modifier votre profil', 3000, 'rounded');
        });
    };
    ProfileCoachComponent.prototype.goToMeetings = function () {
        window.scrollTo(0, 0);
        this.router.navigate(['/meetings']);
    };
    ProfileCoachComponent.prototype.ngAfterViewInit = function () {
        console.log("afterViewInit");
    };
    ProfileCoachComponent.prototype.ngOnDestroy = function () {
        // if (this.subscriptionGetCoach) {
        //   this.subscriptionGetCoach.unsubscribe();
        // }
        // if (this.subscriptionConnectUser) {
        //   this.subscriptionConnectUser.unsubscribe();
        // }
    };
    return ProfileCoachComponent;
}());
__decorate([
    Input(),
    __metadata("design:type", Coach)
], ProfileCoachComponent.prototype, "iCoach", void 0);
ProfileCoachComponent = __decorate([
    Component({
        selector: 'rb-profile-coach',
        templateUrl: './profile-coach.component.html',
        styleUrls: ['./profile-coach.component.css']
    }),
    __metadata("design:paramtypes", [AuthService, Router, ChangeDetectorRef, FormBuilder, CoachCoacheeService, ActivatedRoute])
], ProfileCoachComponent);
export { ProfileCoachComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/user/profile/coach/profile-coach.component.js.map