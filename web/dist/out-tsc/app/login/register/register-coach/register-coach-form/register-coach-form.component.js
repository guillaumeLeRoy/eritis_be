var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../../../service/auth.service";
import { Router } from "@angular/router";
import { Headers } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { environment } from "../../../../../environments/environment";
import { CookieService } from "ngx-cookie";
var RegisterCoachFormComponent = (function () {
    function RegisterCoachFormComponent(formBuilder, authService, router, cookieService) {
        this.formBuilder = formBuilder;
        this.authService = authService;
        this.router = router;
        this.cookieService = cookieService;
        this.onRegisterLoading = false;
        this.hasSavedValues = false;
    }
    RegisterCoachFormComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
        if (!this.hasAcceptedConditions()) {
            this.router.navigate(['register_coach/step1']);
        }
        this.registerForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.pattern('[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?')]],
            name: ['', Validators.required],
            surname: ['', Validators.required],
            avatar: [''],
            linkedin: [''],
            description: ['', Validators.required],
            formation: ['', Validators.required],
            diplomas: ['', Validators.required],
            otherActivities: ['', Validators.required],
            experienceTime: ['', Validators.required],
            experienceVisio: ['', Validators.required],
            coachingHours: ['', Validators.required],
            supervision: ['', Validators.required],
            preferedCoaching: ['', Validators.required],
            status: ['', Validators.required],
            ca1: ['', Validators.required],
            ca2: ['', Validators.required],
            ca3: ['', Validators.required],
            insurance: ['']
        });
        this.getSavedFormValues();
    };
    RegisterCoachFormComponent.prototype.hasAcceptedConditions = function () {
        var cookie = this.cookieService.get('COACH_REGISTER_CONDITIONS_ACCEPTED');
        console.log('Coach register conditions accepted, ', cookie);
        if (cookie !== null && cookie !== undefined) {
            return true;
        }
    };
    // private hasSavedFormValues() {
    //   let cookie = this.cookieService.get('COACH_REGISTER_FORM_VALUES');
    //   console.log('hasSavedFormValues, ', cookie);
    //   if (cookie !== null && cookie !== undefined) {
    //     this.hasSavedValues = true;
    //   }
    // }
    RegisterCoachFormComponent.prototype.getSavedFormValues = function () {
        var cookie = this.cookieService.getObject('COACH_REGISTER_FORM_VALUES');
        console.log("getSavedFormValues", cookie);
        if (cookie !== null && cookie !== undefined) {
            this.registerForm = this.formBuilder.group({
                email: [cookie['email'], [Validators.required, Validators.pattern('[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?')]],
                name: [cookie['name'], Validators.required],
                surname: [cookie['surname'], Validators.required],
                avatar: [cookie['avatar']],
                linkedin: [cookie['linkedin']],
                description: [cookie['description'], Validators.required],
                formation: [cookie['formation'], Validators.required],
                diplomas: [cookie['diplomas'], Validators.required],
                otherActivities: [cookie['otherActivities'], Validators.required],
                experienceTime: [cookie['experienceTime'], Validators.required],
                experienceVisio: [cookie['experienceVisio'], Validators.required],
                coachingHours: [cookie['coachingHours'], Validators.required],
                supervision: [cookie['supervision'], Validators.required],
                preferedCoaching: [cookie['preferedCoaching'], Validators.required],
                status: [cookie['status'], Validators.required],
                ca1: [cookie['ca1'], Validators.required],
                ca2: [cookie['ca2'], Validators.required],
                ca3: [cookie['ca3'], Validators.required],
                insurance: [cookie['insurance']]
            });
        }
    };
    RegisterCoachFormComponent.prototype.saveFormValues = function () {
        var date = (new Date());
        date.setFullYear(2030);
        this.cookieService.putObject('COACH_REGISTER_FORM_VALUES', this.registerForm.value, { expires: date.toDateString() });
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
        return this.updatePossibleCoach().flatMap(function (res) {
            console.log("onRegister, userCreated");
            return _this.updatePossibleCoachPicture();
        }).flatMap(function (res) {
            console.log("onRegister upadateAssurance");
            return _this.updatePossibleCoachAssuranceDoc();
        }).subscribe(function (res) {
            console.log("onRegister success", res);
            Materialize.toast('Votre candiature a été envoyée !', 3000, 'rounded');
            _this.onRegisterLoading = false;
            _this.cookieService.put('COACH_REGISTER_FORM_SENT', 'true');
            _this.router.navigate(['register_coach/step3']);
        }, function (error) {
            console.log('onRegister error', error);
            Materialize.toast('Impossible de soumettre votre candidature', 3000, 'rounded');
            _this.onRegisterLoading = false;
        });
    };
    RegisterCoachFormComponent.prototype.displayAutoCompleteButton = function () {
        return !environment.production;
    };
    /**
     * Complete the form with fake values
     */
    RegisterCoachFormComponent.prototype.autoCompleteForm = function () {
        console.log('autoCompleteForm');
        this.getSavedFormValues();
    };
    RegisterCoachFormComponent.prototype.updatePossibleCoach = function () {
        console.log('updatePossibleCoach');
        var body = {
            'email': this.registerForm.value.email,
            'firstName': this.registerForm.value.name,
            'lastName': this.registerForm.value.surname,
            'linkedin_url': this.registerForm.value.linkedin,
            'assurance_url': this.registerForm.value.insurance,
            'description': this.registerForm.value.description,
            'training': this.registerForm.value.formation,
            'degree': this.registerForm.value.diplomas,
            'extraActivities': this.registerForm.value.otherActivities,
            'coachForYears': this.registerForm.value.experienceTime,
            'coachingExperience': this.registerForm.value.experienceVisio,
            'coachingHours': this.registerForm.value.coachingHours,
            'supervisor': this.registerForm.value.supervision,
            'favoriteCoachingSituation': this.registerForm.value.preferedCoaching,
            'status': this.registerForm.value.status,
            'revenue': this.registerForm.value.ca1 + "_" + this.registerForm.value.ca2 + "_" + this.registerForm.value.ca2,
        };
        var params = [];
        return this.authService.putNotAuth(AuthService.UPDATE_POSSIBLE_COACH, params, body).map(function (response) {
            var res = response.json();
            console.log('updatePossibleCoach success', res);
            return res;
        }, function (error) {
            console.log('updatePossibleCoach error', error);
        });
    };
    RegisterCoachFormComponent.prototype.updatePossibleCoachPicture = function () {
        console.log('updatePossibleCoachPicture');
        if (this.avatarUrl !== undefined) {
            var formData = new FormData();
            formData.append('uploadFile', this.avatarUrl, this.avatarUrl.name);
            formData.append('email', this.registerForm.value.email);
            var headers = new Headers();
            headers.append('Accept', 'application/json');
            var params = [];
            return this.authService.putNotAuth(AuthService.UPDATE_POSSIBLE_COACH_PICTURE, params, formData, { headers: headers }).map(function (response) {
                var res = response.json();
                console.log('updatePossibleCoachPicture success', res);
                return res;
            }, function (error) {
                console.log('updatePossibleCoachPicture error', error);
            });
        }
        else {
            return Observable.of(null);
        }
    };
    RegisterCoachFormComponent.prototype.updatePossibleCoachAssuranceDoc = function () {
        console.log('updatePossibleCoachAssuranceDoc');
        if (this.insuranceUrl !== undefined) {
            var formData = new FormData();
            formData.append('uploadFile', this.insuranceUrl, this.insuranceUrl.name);
            formData.append('email', this.registerForm.value.email);
            var headers = new Headers();
            headers.append('Accept', 'application/json');
            var params = [];
            return this.authService.putNotAuth(AuthService.UPDATE_POSSIBLE_COACH_ASSURANCE_DOC, params, formData, { headers: headers }).map(function (response) {
                var res = response.json();
                console.log('updatePossibleCoachAssuranceDoc success', res);
                return res;
            }, function (error) {
                console.log('updatePossibleCoachAssuranceDoc error', error);
            });
        }
        else {
            return Observable.of(null);
        }
    };
    return RegisterCoachFormComponent;
}());
RegisterCoachFormComponent = __decorate([
    Component({
        selector: 'rb-register-coach-form',
        templateUrl: './register-coach-form.component.html',
        styleUrls: ['./register-coach-form.component.scss']
    }),
    __metadata("design:paramtypes", [FormBuilder, AuthService, Router, CookieService])
], RegisterCoachFormComponent);
export { RegisterCoachFormComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/login/register/register-coach/register-coach-form/register-coach-form.component.js.map