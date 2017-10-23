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
import { Router } from "@angular/router";
var SimpleHeaderComponent = (function () {
    function SimpleHeaderComponent(router) {
        this.router = router;
    }
    SimpleHeaderComponent.prototype.ngOnInit = function () {
    };
    SimpleHeaderComponent.prototype.goToHome = function () {
        console.log('goToHome');
        this.goToWelcomePage();
    };
    SimpleHeaderComponent.prototype.goToWelcomePage = function () {
        $('.button-collapse').sideNav('hide');
        this.router.navigate(['welcome']);
    };
    SimpleHeaderComponent = __decorate([
        Component({
            selector: 'er-simple-header',
            templateUrl: './simple-header.component.html',
            styleUrls: ['./simple-header.component.scss']
        }),
        __metadata("design:paramtypes", [Router])
    ], SimpleHeaderComponent);
    return SimpleHeaderComponent;
}());
export { SimpleHeaderComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/header/simple-header/simple-header.component.js.map