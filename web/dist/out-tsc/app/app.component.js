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
import { environment } from "../environments/environment";
import { FirebaseService } from "./service/firebase.service";
import { CookieService } from "ngx-cookie";
var AppComponent = (function () {
    function AppComponent(firebaseService, cookieService) {
        this.firebaseService = firebaseService;
        this.cookieService = cookieService;
        this.showCookiesMessage = false;
        console.log("AppComponent ctr, env : ", environment);
        firebaseService.init();
    }
    AppComponent.prototype.ngOnInit = function () {
        // Cookie Headband
        this.showCookiesMessage = this.cookieService.get('ACCEPTS_COOKIES') === undefined;
    };
    AppComponent.prototype.hideCookieHeadband = function () {
        $('#cookie_headband').fadeOut();
        this.cookieService.put('ACCEPTS_COOKIES', 'true');
    };
    AppComponent = __decorate([
        Component({
            selector: 'er-root',
            templateUrl: './app.component.html'
        }),
        __metadata("design:paramtypes", [FirebaseService, CookieService])
    ], AppComponent);
    return AppComponent;
}());
export { AppComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/app.component.js.map