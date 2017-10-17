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
var CodeDeontologieComponent = (function () {
    function CodeDeontologieComponent(router) {
        this.router = router;
    }
    CodeDeontologieComponent.prototype.ngOnInit = function () {
        window.scrollTo(0, 0);
    };
    CodeDeontologieComponent.prototype.goToCoachRegister = function () {
        this.router.navigate(['/register_coach/step1']);
    };
    CodeDeontologieComponent = __decorate([
        Component({
            selector: 'er-code-deontologie',
            templateUrl: './code-deontologie.component.html',
            styleUrls: ['./code-deontologie.component.scss']
        }),
        __metadata("design:paramtypes", [Router])
    ], CodeDeontologieComponent);
    return CodeDeontologieComponent;
}());
export { CodeDeontologieComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/login/register/register-coach/code-deontologie/code-deontologie.component.js.map