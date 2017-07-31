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
import { AuthService } from "../../service/auth.service";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie";
var SigninComponent = (function () {
    function SigninComponent(formBuilder, authService, router, cookieService) {
        this.formBuilder = formBuilder;
        this.authService = authService;
        this.router = router;
        this.cookieService = cookieService;
        this.error = false;
        this.loginLoading = false;
        authService.isAuthenticated().subscribe(function (isAuth) { return console.log('onSignIn, isAuth', isAuth); });
    }
    SigninComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
        this.signInForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.pattern('[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?')]],
            password: ['', Validators.required],
        });
    };
    SigninComponent.prototype.onSignIn = function () {
        var _this = this;
        // Activate spinner loader
        this.loginLoading = true;
        // reset errors
        this.error = false;
        this.errorMessage = '';
        this.authService.signIn(this.signInForm.value).subscribe(function (user) {
            ga('send', 'event', {
                eventCategory: 'signin',
                eventLabel: 'success|userId:' + user.id,
                eventAction: 'api response',
            });
            console.log('onSignIn, user obtained', user);
            /*if (user instanceof Coach) {
             this.router.navigate(['/meetings']);
             } else {
             this.router.navigate(['/coachs'])
             }*/
            /*L'utilisateur est TOUJOURS redirigé vers ses meetings*/
            _this.router.navigate(['/meetings']);
            Materialize.toast('Bonjour ' + user.first_name + ' !', 3000, 'rounded');
            _this.loginLoading = false;
        }, function (error) {
            ga('send', 'event', {
                eventCategory: 'signin',
                eventLabel: 'error:' + error,
                eventAction: 'api response',
            });
            console.log('onSignIn, error obtained', error);
            Materialize.toast("Le mot de passe ou l'adresse mail est inccorect", 3000, 'rounded');
            _this.loginLoading = false;
            //this.error = true;
            //this.errorMessage = error;
        });
    };
    SigninComponent.prototype.goToSignUp = function () {
        this.router.navigate(['/signup']);
    };
    return SigninComponent;
}());
SigninComponent = __decorate([
    Component({
        selector: 'rb-signin',
        templateUrl: './signin.component.html',
        styleUrls: ['./signin.component.scss']
    }),
    __metadata("design:paramtypes", [FormBuilder, AuthService, Router, CookieService])
], SigninComponent);
export { SigninComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/login/signin/signin.component.js.map