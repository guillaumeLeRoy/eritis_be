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
import { Coachee } from "../../../model/Coachee";
import { AuthService } from "../../../service/auth.service";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CoachCoacheeService } from "../../../service/coach_coachee.service";
import { Headers } from "@angular/http";
var ProfileCoacheeComponent = (function () {
    function ProfileCoacheeComponent(authService, router, cd, formBuilder, coachService, route) {
        this.authService = authService;
        this.router = router;
        this.cd = cd;
        this.formBuilder = formBuilder;
        this.coachService = coachService;
        this.route = route;
        this.isOwner = false;
        this.updateUserLoading = false;
    }
    ProfileCoacheeComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
        this.formCoachee = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            avatar: ['', Validators.required]
        });
        this.getCoacheeAndUser();
        // this.getUser();
    };
    ProfileCoacheeComponent.prototype.getCoacheeAndUser = function () {
        var _this = this;
        this.subscriptionGetCoachee = this.route.params.subscribe(function (params) {
            var coacheeId = params['id'];
            _this.coachService.getCoacheeForId(coacheeId).subscribe(function (coachee) {
                console.log("gotCoachee", coachee);
                _this.setFormValues(coachee);
                _this.coachee = Observable.of(coachee);
                console.log("getUser");
                var user = _this.authService.getConnectedUser();
                _this.user = Observable.of(user);
                _this.isOwner = (user instanceof Coachee) && (coachee.email === user.email);
                _this.cd.detectChanges();
            });
        });
    };
    ProfileCoacheeComponent.prototype.getUser = function () {
        var _this = this;
        this.subscriptionGetUser = this.authService.getConnectedUserObservable().subscribe(function (user) {
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
        this.updateUserLoading = true;
        var formData = new FormData();
        formData.append('uploadFile', this.avatarUrl, this.avatarUrl.name);
        var headers = new Headers();
        headers.append('Accept', 'application/json');
        this.coachee.last().flatMap(function (coachee) {
            console.log("submitCoacheeProfilUpdate, coachee obtained");
            return _this.authService.updateCoacheeForId(coachee.id, _this.formCoachee.value.firstName, _this.formCoachee.value.lastName, _this.formCoachee.value.avatar);
        }).subscribe(function (user) {
            _this.coachee.take(1).flatMap(function (coachee) {
                console.log("Upload avatar");
                var params = [coachee.id];
                if (_this.avatarUrl != null) {
                    return _this.authService.put(AuthService.PUT_COACHEE_PROFILE_PICT, params, formData, { headers: headers })
                        .map(function (res) { return res.json(); })
                        .catch(function (error) { return Observable.throw(error); });
                }
            }).subscribe(function (data) {
                console.log('Upload avatar success', data);
                console.log("coachee updated : ", user);
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
            console.log('coachee update, error', error);
            Materialize.toast('Impossible de modifier votre profil', 3000, 'rounded');
        });
    };
    ProfileCoacheeComponent.prototype.filePreview = function (event) {
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
    ProfileCoacheeComponent.prototype.goToMeetings = function () {
        window.scrollTo(0, 0);
        this.router.navigate(['/meetings']);
    };
    ProfileCoacheeComponent.prototype.goToCoacheesAdmin = function () {
        window.scrollTo(0, 0);
        this.router.navigate(['admin/coachees-list']);
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
        if (this.subscriptionGetCoachee) {
            console.log("Unsubscribe coach");
            this.subscriptionGetCoachee.unsubscribe();
        }
        if (this.subscriptionGetUser) {
            console.log("Unsubscribe user");
            this.subscriptionGetUser.unsubscribe();
        }
    };
    return ProfileCoacheeComponent;
}());
ProfileCoacheeComponent = __decorate([
    Component({
        selector: 'rb-profile-coachee',
        templateUrl: 'profile-coachee.component.html',
        styleUrls: ['./profile-coachee.component.scss']
    }),
    __metadata("design:paramtypes", [AuthService, Router, ChangeDetectorRef, FormBuilder, CoachCoacheeService, ActivatedRoute])
], ProfileCoacheeComponent);
export { ProfileCoacheeComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/user/profile/coachee/profile-coachee.component.js.map