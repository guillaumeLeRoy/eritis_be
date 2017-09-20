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
import { ActivatedRoute, Router } from "@angular/router";
import { AdminAPIService } from "../../../../service/adminAPI.service";
import { Observable } from "rxjs/Observable";
var ProfileCoachAdminComponent = (function () {
    function ProfileCoachAdminComponent(apiService, router, cd, route, adminAPIService) {
        this.apiService = apiService;
        this.router = router;
        this.cd = cd;
        this.route = route;
        this.adminAPIService = adminAPIService;
        this.loading = true;
        this.avatarLoading = false;
    }
    ProfileCoachAdminComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
        this.loading = true;
        this.getCoach();
    };
    ProfileCoachAdminComponent.prototype.getCoach = function () {
        var _this = this;
        this.subscriptionGetCoach = this.route.params.subscribe(function (params) {
            var coachId = params['id'];
            _this.apiService.getCoach(coachId).subscribe(function (coach) {
                console.log("gotCoach", coach);
                _this.coach = Observable.of(coach);
                _this.cd.detectChanges();
                _this.loading = false;
            });
        });
    };
    ProfileCoachAdminComponent.prototype.ngAfterViewInit = function () {
        console.log("afterViewInit");
        // this.isOwner = (user instanceof Coach) && (coach.email === user.email);
    };
    ProfileCoachAdminComponent.prototype.sendInvite = function (email) {
        var _this = this;
        console.log('sendInvite, email', email);
        this.apiService.createPotentialCoach(email).subscribe(function (res) {
            console.log('createPotentialCoach, res', res);
            _this.getCoach();
            Materialize.toast('Invitation envoyée au Coach !', 3000, 'rounded');
        }, function (error) {
            console.log('createPotentialCoach, error', error);
            Materialize.toast("Impossible d'ajouter le Coach", 3000, 'rounded');
        });
    };
    ProfileCoachAdminComponent.prototype.goToCoachsAdmin = function () {
        this.router.navigate(['admin/coachs-list']);
    };
    ProfileCoachAdminComponent.prototype.ngOnDestroy = function () {
        if (this.subscriptionGetCoach) {
            console.log("Unsubscribe coach");
            this.subscriptionGetCoach.unsubscribe();
        }
    };
    ProfileCoachAdminComponent.prototype.previewPicture = function (event) {
        console.log('filePreview', event.target.files[0]);
        this.avatarFile = event.target.files[0];
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#avatar-preview').css('background-image', 'url(' + e.target.result + ')');
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    };
    ProfileCoachAdminComponent.prototype.uploadAvatarPicture = function () {
        var _this = this;
        if (this.avatarFile !== null && this.avatarFile !== undefined) {
            console.log("Upload avatar");
            this.avatarLoading = true;
            this.coach.last().flatMap(function (coach) {
                return _this.adminAPIService.updateCoachProfilePicture(coach.id, _this.avatarFile);
            }).subscribe(function (res) {
                // refresh page
                console.log("Upload avatar, DONE, res : " + res);
                _this.avatarLoading = false;
                window.location.reload();
            }, function (error) {
                Materialize.toast('Impossible de modifier votre photo', 3000, 'rounded');
                _this.avatarLoading = false;
            });
        }
    };
    ProfileCoachAdminComponent = __decorate([
        Component({
            selector: 'er-profile-coach-admin',
            templateUrl: './profile-coach-admin.component.html',
            styleUrls: ['./profile-coach-admin.component.scss']
        }),
        __metadata("design:paramtypes", [AdminAPIService, Router, ChangeDetectorRef, ActivatedRoute, AdminAPIService])
    ], ProfileCoachAdminComponent);
    return ProfileCoachAdminComponent;
}());
export { ProfileCoachAdminComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/user/profile/coach/profile-coach-admin/profile-coach-admin.component.js.map