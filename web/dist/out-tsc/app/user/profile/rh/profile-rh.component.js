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
import { FormBuilder, Validators } from "@angular/forms";
import { Observable } from "rxjs/Observable";
import { HR } from "../../../model/HR";
import { AuthService } from "../../../service/auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CoachCoacheeService } from "../../../service/coach_coachee.service";
import { Headers } from "@angular/http";
var ProfileRhComponent = (function () {
    function ProfileRhComponent(authService, formBuilder, cd, route, coachService, router) {
        this.authService = authService;
        this.formBuilder = formBuilder;
        this.cd = cd;
        this.route = route;
        this.coachService = coachService;
        this.router = router;
        this.isOwner = false;
        this.updateUserLoading = false;
        this.loading = true;
    }
    ProfileRhComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
        this.loading = true;
        this.formRh = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            description: ['', Validators.required]
        });
        this.getRhAndUser();
    };
    ProfileRhComponent.prototype.ngAfterViewInit = function () {
        console.log("afterViewInit");
        // this.isOwner = (user instanceof Coach) && (coach.email === user.email);
    };
    ProfileRhComponent.prototype.getRhAndUser = function () {
        var _this = this;
        console.log("getRh");
        this.subscriptionGetRh = this.route.params.subscribe(function (params) {
            var rhId = params['id'];
            _this.coachService.getRhForId(rhId).subscribe(function (rh) {
                console.log("gotRh", rh);
                _this.setFormValues(rh);
                _this.mrh = rh;
                _this.rh = Observable.of(rh);
                console.log("getUser");
                var user = _this.authService.getConnectedUser();
                _this.user = Observable.of(user);
                _this.isOwner = (user instanceof HR) && (rh.email === user.email);
                _this.cd.detectChanges();
                _this.loading = false;
            }, function (error) {
                console.log('getRh, error', error);
                _this.loading = false;
            });
        });
    };
    ProfileRhComponent.prototype.setFormValues = function (rh) {
        this.formRh.setValue({
            firstName: rh.first_name,
            lastName: rh.last_name,
            description: rh.description,
        });
    };
    ProfileRhComponent.prototype.submitRhProfilUpdate = function () {
        var _this = this;
        console.log("submitRhProfilUpdate");
        this.updateUserLoading = true;
        this.rh.last().flatMap(function (rh) {
            console.log("submitRhProfilUpdate, rh obtained");
            return _this.authService.updateRhForId(rh.id, _this.formRh.value.firstName, _this.formRh.value.lastName, _this.formRh.value.description, _this.mrh.avatar_url);
        }).flatMap(function (rh) {
            if (_this.avatarUrl != null && _this.avatarUrl !== undefined) {
                console.log("Upload avatar");
                var params = [_this.mrh.id];
                var formData = new FormData();
                formData.append('uploadFile', _this.avatarUrl, _this.avatarUrl.name);
                var headers = new Headers();
                headers.append('Accept', 'application/json');
                return _this.authService.put(AuthService.PUT_RH_PROFILE_PICT, params, formData, { headers: headers })
                    .map(function (res) { return res.json(); })
                    .catch(function (error) { return Observable.throw(error); });
            }
            else {
                return Observable.of(rh);
            }
        }).subscribe(function (rh) {
            console.log('Upload avatar success', rh);
            _this.updateUserLoading = false;
            Materialize.toast('Votre profil a été modifié !', 3000, 'rounded');
            //refresh page
            setTimeout('', 1000);
            window.location.reload();
        }, function (error) {
            console.log('rh update, error', error);
            _this.updateUserLoading = false;
            Materialize.toast('Impossible de modifier votre profil', 3000, 'rounded');
        });
    };
    ProfileRhComponent.prototype.filePreview = function (event) {
        if (event.target.files && event.target.files[0]) {
            this.avatarUrl = event.target.files[0];
            console.log("filePreview", this.avatarUrl);
            var reader = new FileReader();
            reader.onload = function (e) {
                // $('#avatar-preview').attr('src', e.target.result);
                $('#avatar-preview').css('background-image', 'url(' + e.target.result + ')');
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    };
    ProfileRhComponent.prototype.goToMeetings = function () {
        this.router.navigate(['/meetings']);
    };
    ProfileRhComponent.prototype.ngOnDestroy = function () {
        if (this.subscriptionGetRh) {
            console.log("Unsubscribe rh");
            this.subscriptionGetRh.unsubscribe();
        }
        if (this.subscriptionGetUser) {
            console.log("Unsubscribe user");
            this.subscriptionGetUser.unsubscribe();
        }
    };
    ProfileRhComponent = __decorate([
        Component({
            selector: 'rb-profile-rh',
            templateUrl: './profile-rh.component.html',
            styleUrls: ['./profile-rh.component.scss']
        }),
        __metadata("design:paramtypes", [AuthService, FormBuilder, ChangeDetectorRef, ActivatedRoute, CoachCoacheeService, Router])
    ], ProfileRhComponent);
    return ProfileRhComponent;
}());
export { ProfileRhComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/user/profile/rh/profile-rh.component.js.map