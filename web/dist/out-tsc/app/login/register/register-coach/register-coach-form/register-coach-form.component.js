var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../../../service/auth.service';
import { Router } from '@angular/router';
import { Headers } from '@angular/http';
import { Observable } from "rxjs/Observable";
var RegisterCoachFormComponent = (function () {
    function RegisterCoachFormComponent(formBuilder, authService, router) {
        this.formBuilder = formBuilder;
        this.authService = authService;
        this.router = router;
        this.onRegisterLoading = false;
    }
    RegisterCoachFormComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
        this.registerForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.pattern('[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?')]],
            name: ['', Validators.required],
            surname: ['', Validators.required],
            avatar: [''],
            linkedin: [''],
            description: [''],
            formation: [''],
            diplomas: [''],
            otherActivities: [''],
            experienceTime: [''],
            experienceVisio: [''],
            coachingHours: [''],
            supervision: [''],
            preferedCoaching: [''],
            status: [''],
            ca1: [''],
            ca2: [''],
            ca3: [''],
            insurance: ['']
        });
    };
    RegisterCoachFormComponent.prototype.filePreview = function (event, type) {
        console.log('filePreview', event.target.files[0]);
        if (type === 'avatar') {
            this.avatarUrl = event.target.files[0];
            if (event.target.files && event.target.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('#avatar-preview').attr('src', e.target.result);
                };
                reader.readAsDataURL(event.target.files[0]);
            }
        }
        if (type === 'insurance') {
            this.insuranceUrl = event.target.files[0];
        }
    };
    RegisterCoachFormComponent.prototype.onRegister = function () {
        var _this = this;
        console.log('onRegister');
        this.onRegisterLoading = true;
        this.updatePossibleCoach().flatMap(function (res) {
            console.log("onRegister upadatePicture");
            return _this.updatePossibleCoachPicture();
        }).flatMap(function (res) {
            console.log("onRegister upadateAssurance");
            return _this.updatePossibleCoachAssuranceDoc();
        }).subscribe(function (res) {
            console.log("onRegister success", res);
            Materialize.toast('Votre candiature a été envoyée !', 3000, 'rounded');
            _this.onRegisterLoading = false;
            _this.router.navigate(['register_coach/step3']);
        }, function (error) {
            console.log('onRegister error', error);
            Materialize.toast('Impossible de soumettre votre candidature', 3000, 'rounded');
            _this.onRegisterLoading = false;
        });
        // this.updatePossibleCoach().subscribe(
        //   data => {
        //     console.log('onRegister, updatePossibleCoach success');
        //     this.updatePossibleCoachPicture().subscribe(
        //       data2 => {
        //         console.log('onRegister, updatePossibleCoachPicture success');
        //         this.updatePossibleCoachAssuranceDoc().subscribe(
        //           data3 => {
        //             console.log('onRegister, updatePossibleCoachAssuranceDoc success');
        //             Materialize.toast('Votre candiature a été envoyée !', 3000, 'rounded');
        //             this.onRegisterLoading = false;
        //             this.router.navigate(['register_coach/step3']);
        //           }, error => {
        //             console.log('onRegister, updatePossibleCoachAssuranceDoc error', error);
        //             Materialize.toast('Impossible de soumettre votre candidature', 3000, 'rounded');
        //             this.onRegisterLoading = false;
        //           }
        //         );
        //       }, error => {
        //         console.log('onRegister, updatePossibleCoachPicture error', error);
        //         Materialize.toast('Impossible de soumettre votre candidature', 3000, 'rounded');
        //         this.onRegisterLoading = false;
        //       }
        //     );
        //   }, error => {
        //     console.log('onRegister, updatePossibleCoach error', error);
        //     Materialize.toast('Impossible de soumettre votre candidature', 3000, 'rounded');
        //     this.onRegisterLoading = false;
        //   }
        // );
    };
    RegisterCoachFormComponent.prototype.updatePossibleCoach = function () {
        // TODO create body
        var body = {
            'email': this.registerForm.value.email,
            'firstName': this.registerForm.value.name,
            'lastName': this.registerForm.value.surname
        };
        var params = [];
        this.authService.putNotAuth(AuthService.UPDATE_POSSIBLE_COACH, params, body).subscribe(function (response) {
            return Observable.of(response);
        });
        return Observable.of(null);
    };
    RegisterCoachFormComponent.prototype.updatePossibleCoachPicture = function () {
        if (this.avatarUrl !== undefined) {
            var formData = new FormData();
            formData.append('uploadFile', this.avatarUrl, this.avatarUrl.name);
            formData.append('email', this.registerForm.value.email);
            var headers = new Headers();
            headers.append('Accept', 'application/json');
            var params = [];
            this.authService.putNotAuth(AuthService.UPDATE_POSSIBLE_COACH_PICTURE, params, formData, { headers: headers }).subscribe(function (response) {
                return Observable.of(response);
            });
        }
        return Observable.of(null);
    };
    RegisterCoachFormComponent.prototype.updatePossibleCoachAssuranceDoc = function () {
        if (this.insuranceUrl !== undefined) {
            var formData = new FormData();
            formData.append('uploadFile', this.insuranceUrl, this.insuranceUrl.name);
            formData.append('email', this.registerForm.value.email);
            var headers = new Headers();
            headers.append('Accept', 'application/json');
            var params = [];
            this.authService.putNotAuth(AuthService.UPDATE_POSSIBLE_COACH_ASSURANCE_DOC, params, formData, { headers: headers }).subscribe(function (response) {
                return Observable.of(response);
            });
        }
        return Observable.of(null);
    };
    return RegisterCoachFormComponent;
}());
RegisterCoachFormComponent = __decorate([
    Component({
        selector: 'rb-register-coach-form',
        templateUrl: './register-coach-form.component.html',
        styleUrls: ['./register-coach-form.component.scss']
    }),
    __metadata("design:paramtypes", [FormBuilder, AuthService, Router])
], RegisterCoachFormComponent);
export { RegisterCoachFormComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/login/register/register-coach/register-coach-form/register-coach-form.component.js.map