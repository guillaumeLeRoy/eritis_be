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
import { FormBuilder, Validators } from "@angular/forms";
var RegisterCoachComponent = (function () {
    function RegisterCoachComponent(formBuilder) {
        this.formBuilder = formBuilder;
        this.introductionHidden = false;
        this.deontologieHidden = true;
        this.formHidden = true;
        this.conditionsChecked = false;
    }
    RegisterCoachComponent.prototype.ngOnInit = function () {
        this.registerForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.pattern('[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?')]],
            name: ['', Validators.required],
            surname: ['', Validators.required],
            avatar: ['', Validators.required],
            linkedin: ['', Validators.required],
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
            insurance: ['', Validators.required]
        });
    };
    RegisterCoachComponent.prototype.showIntroduction = function () {
        window.scrollTo(0, 0);
        this.introductionHidden = false;
        this.deontologieHidden = true;
        this.formHidden = true;
    };
    RegisterCoachComponent.prototype.showDeontologie = function () {
        window.scrollTo(0, 0);
        this.introductionHidden = true;
        this.deontologieHidden = false;
        this.formHidden = true;
    };
    RegisterCoachComponent.prototype.showForm = function () {
        window.scrollTo(0, 0);
        this.introductionHidden = true;
        this.deontologieHidden = true;
        this.formHidden = false;
    };
    RegisterCoachComponent.prototype.filePreview = function (event, type) {
        console.log("filePreview", event.target.files[0]);
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
    RegisterCoachComponent.prototype.onRegister = function () {
    };
    return RegisterCoachComponent;
}());
RegisterCoachComponent = __decorate([
    Component({
        selector: 'rb-register-coach',
        templateUrl: './register-coach.component.html',
        styleUrls: ['./register-coach.component.scss']
    }),
    __metadata("design:paramtypes", [FormBuilder])
], RegisterCoachComponent);
export { RegisterCoachComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/login/register/register-coach/register-coach.component.js.map