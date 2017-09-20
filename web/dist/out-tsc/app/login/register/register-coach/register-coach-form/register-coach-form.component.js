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
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            avatar_url: [''],
            linkedin_url: [''],
            description: ['', Validators.required],
            phoneNumber: ['', Validators.required],
            lang1: ['', Validators.required],
            lang2: [''],
            lang3: [''],
            career: ['', Validators.required],
            degree: ['', Validators.required],
            extraActivities: ['', Validators.required],
            coachingExperience: ['', Validators.required],
            remoteCoachingExperience: ['', Validators.required],
            experienceShortSession: ['', Validators.required],
            coachingSpecifics: ['', Validators.required],
            supervision: ['', Validators.required],
            therapyElements: ['', Validators.required],
            ca1: ['', Validators.required],
            ca2: ['', Validators.required],
            ca3: ['', Validators.required],
            percentageCoachingInRevenue: ['', Validators.required],
            legalStatus: ['', Validators.required],
            invoice_entity: ['', Validators.required],
            invoice_siret_number: ['', Validators.required],
            invoice_address: ['', Validators.required],
            invoice_postcode: ['', Validators.required],
            invoice_city: ['', Validators.required],
            insurance_document: ['']
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
                firstname: [cookie['firstname'], Validators.required],
                lastname: [cookie['lastname'], Validators.required],
                avatar: [cookie['avatar']],
                linkedin_url: [cookie['linkedin_url']],
                description: [cookie['description'], Validators.required],
                phoneNumber: [cookie['phoneNumber'], Validators.required],
                lang1: [cookie['lang1'], Validators.required],
                lang2: [cookie['lang2']],
                lang3: [cookie['lang3']],
                career: [cookie['career'], Validators.required],
                degree: [cookie['degree'], Validators.required],
                extraActivities: [cookie['extraActivities'], Validators.required],
                coachingExperience: [cookie['coachingExperience'], Validators.required],
                remoteCoachingExperience: [cookie['remoteCoachingExperience'], Validators.required],
                experienceShortSession: [cookie['experienceShortSession'], Validators.required],
                coachingSpecifics: [cookie['coachingSpecifics'], Validators.required],
                supervision: [cookie['supervision'], Validators.required],
                therapyElements: [cookie['therapyElements'], Validators.required],
                ca1: [cookie['ca1'], Validators.required],
                ca2: [cookie['ca2'], Validators.required],
                ca3: [cookie['ca3'], Validators.required],
                percentageCoachingInRevenue: [cookie['percentageCoachingInRevenue']],
                legalStatus: [cookie['legalStatus'], Validators.required],
                invoice_entity: [cookie['invoice_entity'], Validators.required],
                invoice_siret_number: [cookie['invoice_siret_number'], Validators.required],
                invoice_address: [cookie['invoice_address'], Validators.required],
                invoice_postcode: [cookie['invoice_postcode'], Validators.required],
                invoice_city: [cookie['invoice_city'], Validators.required],
                insurance_document: [cookie['insurance_document']]
            });
        }
    };
    RegisterCoachFormComponent.prototype.saveFormValues = function () {
        var date = (new Date());
        date.setFullYear(2030);
        if (this.cookieService.get('ACCEPTS_COOKIES') !== undefined)
            this.cookieService.putObject('COACH_REGISTER_FORM_VALUES', this.registerForm.value, { expires: date.toDateString() });
    };
    RegisterCoachFormComponent.prototype.filePreview = function (event, type) {
        console.log('filePreview', event.target.files[0]);
        if (type === 'avatar') {
            this.avatarUrl = event.target.files[0];
            if (event.target.files && event.target.files[0]) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('#avatar-preview').css('background-image', 'url(' + e.target.result + ')');
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
            console.log("onRegister upadateinsurance");
            return _this.updatePossibleCoachinsuranceDoc();
        }).subscribe(function (res) {
            console.log("onRegister success", res);
            Materialize.toast('Votre candidature a été envoyée !', 3000, 'rounded');
            _this.onRegisterLoading = false;
            if (_this.cookieService.get('ACCEPTS_COOKIES') !== undefined)
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
            'first_name': this.registerForm.value.firstname,
            'last_name': this.registerForm.value.lastname,
            'description': this.registerForm.value.description,
            'mobile_phone_number': this.registerForm.value.phoneNumber,
            'languages': this.registerForm.value.lang1 + "_" + this.registerForm.value.lang2 + "_" + this.registerForm.value.lang3,
            'linkedin_url': this.registerForm.value.linkedin_url,
            'career': this.registerForm.value.career,
            'extraActivities': this.registerForm.value.extraActivities,
            'degree': this.registerForm.value.degree,
            'experience_coaching': this.registerForm.value.coachingExperience,
            'experience_remote_coaching': this.registerForm.value.remoteCoachingExperience,
            'experienceShortSession': this.registerForm.value.experienceShortSession,
            'coachingSpecifics': this.registerForm.value.coachingSpecifics,
            'supervisor': this.registerForm.value.supervision,
            'therapyElements': this.registerForm.value.therapyElements,
            'legal_status': this.registerForm.value.legalStatus,
            'revenues_last_3_years': this.registerForm.value.ca1 + "_" + this.registerForm.value.ca2 + "_" + this.registerForm.value.ca2,
            'percentage_coaching_in_revenue': this.registerForm.value.percentageCoachingInRevenue,
            'invoice_entity': this.registerForm.value.invoice_entity,
            'invoice_siret_number': this.registerForm.value.invoice_siret_number,
            'invoice_address': this.registerForm.value.invoice_address,
            'invoice_city': this.registerForm.value.invoice_city,
            'invoice_postcode': this.registerForm.value.invoice_postcode,
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
    RegisterCoachFormComponent.prototype.updatePossibleCoachinsuranceDoc = function () {
        console.log('updatePossibleCoachinsuranceDoc');
        if (this.insuranceUrl !== undefined) {
            var formData = new FormData();
            formData.append('uploadFile', this.insuranceUrl, this.insuranceUrl.name);
            formData.append('email', this.registerForm.value.email);
            var headers = new Headers();
            headers.append('Accept', 'application/json');
            var params = [];
            return this.authService.putNotAuth(AuthService.UPDATE_POSSIBLE_COACH_INSURANCE_DOC, params, formData, { headers: headers }).map(function (response) {
                var res = response.json();
                console.log('updatePossibleCoachinsuranceDoc success', res);
                return res;
            }, function (error) {
                console.log('updatePossibleCoachinsuranceDoc error', error);
            });
        }
        else {
            return Observable.of(null);
        }
    };
    RegisterCoachFormComponent = __decorate([
        Component({
            selector: 'rb-register-coach-form',
            templateUrl: './register-coach-form.component.html',
            styleUrls: ['./register-coach-form.component.scss']
        }),
        __metadata("design:paramtypes", [FormBuilder, AuthService, Router, CookieService])
    ], RegisterCoachFormComponent);
    return RegisterCoachFormComponent;
}());
export { RegisterCoachFormComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/login/register/register-coach/register-coach-form/register-coach-form.component.js.map