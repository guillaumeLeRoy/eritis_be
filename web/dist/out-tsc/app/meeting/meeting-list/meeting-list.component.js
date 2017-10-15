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
import { AuthService } from "../../service/auth.service";
import { Coach } from "../../model/Coach";
import { Coachee } from "../../model/Coachee";
import { HR } from "../../model/HR";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
var MeetingListComponent = (function () {
    function MeetingListComponent(authService, cd) {
        this.authService = authService;
        this.cd = cd;
        this.user = new BehaviorSubject(null);
    }
    MeetingListComponent.prototype.ngOnInit = function () {
        console.log('ngOnInit');
    };
    MeetingListComponent.prototype.ngAfterViewInit = function () {
        console.log('ngAfterViewInit');
        this.getConnectedUser();
    };
    MeetingListComponent.prototype.ngOnDestroy = function () {
        if (this.connectedUserSubscription) {
            this.connectedUserSubscription.unsubscribe();
        }
    };
    MeetingListComponent.prototype.getConnectedUser = function () {
        var _this = this;
        console.log('onRefreshRequested');
        this.connectedUserSubscription = this.authService.getConnectedUserObservable()
            .subscribe(function (user) {
            _this.onUserObtained(user);
            _this.cd.detectChanges();
        });
    };
    MeetingListComponent.prototype.onUserObtained = function (user) {
        console.log('toto, onUserObtained, user : ', user);
        // if (user) {
        this.user.next(user);
        // }
    };
    MeetingListComponent.prototype.isUserACoach = function (user) {
        return user instanceof Coach;
    };
    MeetingListComponent.prototype.isUserACoachee = function (user) {
        return user instanceof Coachee;
    };
    MeetingListComponent.prototype.isUserARh = function (user) {
        return user instanceof HR;
    };
    MeetingListComponent = __decorate([
        Component({
            selector: 'er-meeting-list',
            templateUrl: './meeting-list.component.html',
            styleUrls: ['./meeting-list.component.scss']
        }),
        __metadata("design:paramtypes", [AuthService, ChangeDetectorRef])
    ], MeetingListComponent);
    return MeetingListComponent;
}());
export { MeetingListComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/meeting/meeting-list/meeting-list.component.js.map