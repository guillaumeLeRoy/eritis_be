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
import { ActivatedRoute } from "@angular/router";
import { Coach } from "../../../model/Coach";
import { AuthService } from "../../../service/auth.service";
import { CoachCoacheeService } from "../../../service/coach_coachee.service";
import { FormBuilder, Validators } from "@angular/forms";
import { Headers } from "@angular/http";
var ProfileCoachComponent = (function () {
    function ProfileCoachComponent(authService, cd, formBuilder, coachService, route) {
        this.authService = authService;
        this.cd = cd;
        this.formBuilder = formBuilder;
        this.coachService = coachService;
        this.route = route;
        this.isOwner = false;
        this.updateUserLoading = false;
        this.loading = true;
    }
    ProfileCoachComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
        this.loading = true;
        this.formCoach = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            description: ['', Validators.required],
        });
        this.getCoachAndUser();
    };
    ProfileCoachComponent.prototype.ngOnDestroy = function () {
        if (this.subscriptionGetCoach) {
            console.log("Unsubscribe coach");
            this.subscriptionGetCoach.unsubscribe();
        }
        if (this.subscriptionGetRoute) {
            console.log("Unsubscribe route");
            this.subscriptionGetRoute.unsubscribe();
        }
    };
    ProfileCoachComponent.prototype.getCoachAndUser = function () {
        var _this = this;
        console.log("getCoach");
        this.subscriptionGetRoute = this.route.params.subscribe(function (params) {
            var coachId = params['id'];
            _this.subscriptionGetCoach = _this.coachService.getCoachForId(coachId).subscribe(function (coach) {
                console.log("gotCoach", coach);
                _this.setFormValues(coach);
                _this.mcoach = coach;
                _this.coach = Observable.of(coach);
                console.log("getUser");
                var user = _this.authService.getConnectedUser();
                _this.isOwner = (user instanceof Coach) && (coach.email === user.email);
                _this.cd.detectChanges();
                _this.loading = false;
            }, function (error) {
                console.log('getCoach, error', error);
            });
        });
    };
    ProfileCoachComponent.prototype.setFormValues = function (coach) {
        this.formCoach.setValue({
            firstName: coach.first_name,
            lastName: coach.last_name,
            description: coach.description
        });
    };
    ProfileCoachComponent.prototype.submitCoachProfilUpdate = function () {
        var _this = this;
        console.log("submitCoachProfilUpdate");
        this.updateUserLoading = true;
        this.coach.last().flatMap(function (coach) {
            console.log("submitCoachProfilUpdate, coach obtained");
            return _this.authService.updateCoachForId(coach.id, _this.formCoach.value.firstName, _this.formCoach.value.lastName, _this.formCoach.value.description, _this.mcoach.avatar_url);
        }).flatMap(function (coach) {
            console.log('Upload user success', coach);
            if (_this.avatarUrl !== null && _this.avatarUrl !== undefined) {
                console.log("Upload avatar");
                var params = [_this.mcoach.id];
                var formData = new FormData();
                formData.append('uploadFile', _this.avatarUrl, _this.avatarUrl.name);
                var headers = new Headers();
                headers.append('Accept', 'application/json');
                //todo call coachCoacheeAPIservice
                return _this.authService.put(AuthService.PUT_COACH_PROFILE_PICT, params, formData, { headers: headers })
                    .map(function (res) { return res.json(); })
                    .catch(function (error) { return Observable.throw(error); });
            }
            else {
                return Observable.of(coach);
            }
        }).subscribe(function (coach) {
            console.log('Upload avatar success', coach);
            _this.updateUserLoading = false;
            Materialize.toast('Votre profil a été modifié !', 3000, 'rounded');
            //refresh page
            setTimeout('', 1000);
            // window.location.reload();
        }, function (error) {
            console.log('Upload avatar error', error);
            _this.updateUserLoading = false;
            Materialize.toast('Impossible de modifier votre profil', 3000, 'rounded');
        });
    };
    ProfileCoachComponent.prototype.filePreview = function (event) {
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
    ProfileCoachComponent = __decorate([
        Component({
            selector: 'er-profile-coach',
            templateUrl: './profile-coach.component.html',
            styleUrls: ['./profile-coach.component.scss']
        }),
        __metadata("design:paramtypes", [AuthService, ChangeDetectorRef, FormBuilder, CoachCoacheeService, ActivatedRoute])
    ], ProfileCoachComponent);
    return ProfileCoachComponent;
}());
export { ProfileCoachComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/user/profile/coach/profile-coach.component.js.map