var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
var FirebaseService = (function () {
    function FirebaseService() {
        console.log("FirebaseService ctr");
    }
    FirebaseService.prototype.init = function () {
        console.log("AppComponent init");
        // Initialize Firebase
        var config = {
            apiKey: environment.firebase_apiKey,
            authDomain: environment.firebase_authDomain,
            databaseURL: environment.firebase_databaseURL,
        };
        console.log("AppComponent init config", config);
        firebase.initializeApp(config);
    };
    FirebaseService.prototype.getInstance = function () {
        return firebase;
    };
    FirebaseService.prototype.auth = function () {
        return firebase.auth();
    };
    FirebaseService.prototype.sendPasswordResetEmail = function (email) {
        return firebase.auth().sendPasswordResetEmail(email);
    };
    FirebaseService = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [])
    ], FirebaseService);
    return FirebaseService;
}());
export { FirebaseService };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/service/firebase.service.js.map