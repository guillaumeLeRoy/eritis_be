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
import { ActivatedRoute, Router } from "@angular/router";
import { Coach } from "../../../model/Coach";
import { AuthService } from "../../../service/auth.service";
import { CoachCoacheeService } from "../../../service/coach_coachee.service";
import { FormBuilder, Validators } from "@angular/forms";
import { Headers } from "@angular/http";
var ProfileCoachComponent = (function () {
    function ProfileCoachComponent(authService, router, cd, formBuilder, coachService, route) {
        this.authService = authService;
        this.router = router;
        this.cd = cd;
        this.formBuilder = formBuilder;
        this.coachService = coachService;
        this.route = route;
        this.isOwner = false;
        this.updateUserLoading = false;
    }
    ProfileCoachComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
        this.formCoach = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            avatar: ['', Validators.required],
            description: ['', Validators.required],
        });
        // this.getUser();
        this.getCoachAndUser();
    };
    ProfileCoachComponent.prototype.ngAfterViewInit = function () {
        console.log("afterViewInit");
        // this.isOwner = (user instanceof Coach) && (coach.email === user.email);
    };
    ProfileCoachComponent.prototype.getCoachAndUser = function () {
        var _this = this;
        console.log("getCoach");
        this.subscriptionGetCoach = this.route.params.subscribe(function (params) {
            var coachId = params['id'];
            _this.coachService.getCoachForId(coachId).subscribe(function (coach) {
                console.log("gotCoach", coach);
                _this.setFormValues(coach);
                _this.coach = Observable.of(coach);
                console.log("getUser");
                var user = _this.authService.getConnectedUser();
                _this.user = Observable.of(user);
                _this.isOwner = (user instanceof Coach) && (coach.email === user.email);
                _this.cd.detectChanges();
            }, function (error) {
                console.log('getCoach, error', error);
            });
        });
    };
    // private getUser() {
    //   console.log("getUser");
    //
    //   // this.subscriptionGetUser = this.authService.getConnectedUserObservable().subscribe(
    //   //   (user: Coach | Coachee | HR) => {
    //   //     console.log('gotUser : ' + user);
    //   //
    //   //     this.user = Observable.of(user);
    //   //     this.cd.detectChanges()
    //   //   }, (error) => {
    //   //     console.log('getUser, error', error);
    //   //   }
    //   // );
    //
    //   this.user = Observable.of(this.authService.getConnectedUser());
    // }
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
        this.updateUserLoading = true;
        var formData = new FormData();
        formData.append('uploadFile', this.avatarUrl, this.avatarUrl.name);
        var headers = new Headers();
        headers.append('Accept', 'application/json');
        this.coach.last().flatMap(function (coach) {
            console.log("submitCoachProfilUpdate, coach obtained");
            return _this.authService.updateCoachForId(coach.id, _this.formCoach.value.firstName, _this.formCoach.value.lastName, _this.formCoach.value.description, _this.formCoach.value.avatar);
        }).subscribe(function (user) {
            _this.coach.take(1).flatMap(function (coach) {
                console.log("Upload avatar");
                var params = [coach.id];
                if (_this.avatarUrl != null) {
                    return _this.authService.put(AuthService.PUT_COACH_PROFILE_PICT, params, formData, { headers: headers })
                        .map(function (res) { return res.json(); })
                        .catch(function (error) { return Observable.throw(error); });
                }
            }).subscribe(function (data) {
                console.log('Upload avatar success', data);
                console.log("coach updated : ", user);
                _this.updateUserLoading = false;
                Materialize.toast('Votre profil a été modifié !', 3000, 'rounded');
                //refresh page
                setTimeout('', 1000);
                window.location.reload();
            }, function (error) {
                console.log('Upload avatar error', error);
                Materialize.toast('Impossible de modifier votre profil', 3000, 'rounded');
            });
        }, function (error) {
            console.log('coach update, error', error);
            Materialize.toast('Impossible de modifier votre profil', 3000, 'rounded');
        });
    };
    ProfileCoachComponent.prototype.filePreview = function (event) {
        if (event.target.files && event.target.files[0]) {
            this.avatarUrl = event.target.files[0];
            console.log("filePreview", this.avatarUrl);
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#avatar-preview').attr('src', e.target.result);
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    };
    ProfileCoachComponent.prototype.goToMeetings = function () {
        this.router.navigate(['/meetings']);
    };
    ProfileCoachComponent.prototype.ngOnDestroy = function () {
        if (this.subscriptionGetCoach) {
            console.log("Unsubscribe coach");
            this.subscriptionGetCoach.unsubscribe();
        }
        if (this.subscriptionGetUser) {
            console.log("Unsubscribe user");
            this.subscriptionGetUser.unsubscribe();
        }
    };
    return ProfileCoachComponent;
}());
ProfileCoachComponent = __decorate([
    Component({
        selector: 'rb-profile-coach',
        templateUrl: './profile-coach.component.html',
        styleUrls: ['./profile-coach.component.scss']
    }),
    __metadata("design:paramtypes", [AuthService, Router, ChangeDetectorRef, FormBuilder, CoachCoacheeService, ActivatedRoute])
], ProfileCoachComponent);
export { ProfileCoachComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/user/profile/coach/profile-coach.component.js.map