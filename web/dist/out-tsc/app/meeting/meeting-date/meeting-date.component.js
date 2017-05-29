var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MeetingsService } from "../../service/meetings.service";
var MeetingDateComponent = (function () {
    function MeetingDateComponent(router, route, meetingService, authService, cd) {
        this.router = router;
        this.route = route;
        this.meetingService = meetingService;
        this.authService = authService;
        this.cd = cd;
        this.months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        this.days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        this.now = new Date();
        this.dateModel = { year: this.now.getFullYear(), month: this.now.getMonth() + 1, day: this.now.getDate() };
        this.timeRange = [10, 18];
        this.displayErrorBookingDate = false;
        this.isEditingPotentialDate = false;
        this.potentialDatesArray = new Array();
    }
    MeetingDateComponent.prototype.ngOnInit = function () {
        var _this = this;
        console.log("MeetingDateComponent onInit");
        // meetingId should be in the router
        this.route.params.subscribe(function (params) {
            _this.meetingId = params['meetingId'];
            _this.loadMeetingPotentialTimes(_this.meetingId);
        });
        var user = this.authService.getConnectedUser();
        if (user) {
            this.onConnectedUserReceived(user);
        }
        else {
            this.subscriptionConnectUser = this.authService.getConnectedUserObservable().subscribe(function (user) {
                console.log('ngOnInit, sub received user', user);
                _this.onConnectedUserReceived(user);
            });
        }
    };
    MeetingDateComponent.prototype.onConnectedUserReceived = function (user) {
        this.connectedUser = Observable.of(user);
        this.cd.detectChanges();
    };
    MeetingDateComponent.prototype.bookOrUpdateADate = function () {
        var _this = this;
        console.log('bookADate, dateModel : ', this.dateModel);
        // console.log('bookADate, timeModel : ', this.timeModel);
        this.connectedUser.take(1).subscribe(function (user) {
            if (user == null) {
                console.log('no connected user');
                return;
            }
            var minDate = new Date(_this.dateModel.year, _this.dateModel.month - 1, _this.dateModel.day, _this.timeRange[0], 0);
            var maxDate = new Date(_this.dateModel.year, _this.dateModel.month - 1, _this.dateModel.day, _this.timeRange[1], 0);
            var timestampMin = +minDate.getTime().toFixed(0) / 1000;
            var timestampMax = +maxDate.getTime().toFixed(0) / 1000;
            if (_this.isEditingPotentialDate) {
                // just update potential date
                _this.meetingService.updatePotentialTime(_this.mEditingPotentialTimeId, timestampMin, timestampMax).subscribe(function (meetingDate) {
                    console.log('updatePotentialTime, meetingDate : ', meetingDate);
                    // Reload potential times
                    _this.loadMeetingPotentialTimes(_this.meetingId);
                    //reset progress bar values
                    _this.resetValues();
                    Materialize.toast('Plage modifiée !', 3000, 'rounded');
                }, function (error) {
                    console.log('updatePotentialTime error', error);
                    _this.displayErrorBookingDate = true;
                    Materialize.toast('Erreur lors de la modification', 3000, 'rounded');
                });
            }
            else {
                // create new date
                _this.meetingService.addPotentialDateToMeeting(_this.meetingId, timestampMin, timestampMax).subscribe(function (meetingDate) {
                    console.log('addPotentialDateToMeeting, meetingDate : ', meetingDate);
                    _this.potentialDatesArray.push(meetingDate);
                    // Reload potential times
                    console.log('reload potential times');
                    // Reload potential times
                    _this.loadMeetingPotentialTimes(_this.meetingId);
                    //reset progress bar values
                    _this.resetValues();
                    Materialize.toast('Plage ajoutée !', 3000, 'rounded');
                }, function (error) {
                    console.log('addPotentialDateToMeeting error', error);
                    _this.displayErrorBookingDate = true;
                    Materialize.toast("Erreur lors de l'ajout", 3000, 'rounded');
                });
            }
        });
    };
    MeetingDateComponent.prototype.unbookAdate = function (potentialDateId) {
        var _this = this;
        console.log('unbookAdate');
        this.meetingService.removePotentialTime(potentialDateId).subscribe(function (response) {
            console.log('unbookAdate, response', response);
            //reset progress bar values
            _this.resetValues();
            // Reload potential times
            _this.loadMeetingPotentialTimes(_this.meetingId);
            _this.loadMeetingPotentialTimes(_this.meetingId);
        }, function (error) {
            console.log('unbookAdate, error', error);
        });
    };
    MeetingDateComponent.prototype.modifyPotentialDate = function (potentialDateId) {
        console.log('modifyPotentialDate, potentialDateId', potentialDateId);
        //find the potentialDate we want to modify
        for (var _i = 0, _a = this.potentialDatesArray; _i < _a.length; _i++) {
            var potential = _a[_i];
            if (potential.id === potentialDateId) {
                var startTime = this.getHours(potential.start_date);
                var endTime = this.getHours(potential.end_date);
                //switch to edit mode
                this.isEditingPotentialDate = true;
                this.mEditingPotentialTimeId = potentialDateId;
                this.timeRange = [startTime, endTime];
                break;
            }
        }
    };
    MeetingDateComponent.prototype.printTimeNumber = function (hour) {
        if (hour === Math.round(hour))
            return hour + ':00';
        else
            return Math.round(hour) - 1 + ':30';
    };
    MeetingDateComponent.prototype.printTimeString = function (date) {
        return this.getHours(date) + ':' + this.getMinutes(date);
    };
    MeetingDateComponent.prototype.getHours = function (date) {
        return (new Date(date)).getHours();
    };
    MeetingDateComponent.prototype.getMinutes = function (date) {
        var m = (new Date(date)).getMinutes();
        if (m === 0)
            return '00';
        return m;
    };
    MeetingDateComponent.prototype.resetValues = function () {
        this.mEditingPotentialTimeId = null;
        this.isEditingPotentialDate = false;
        this.timeRange = [10, 18];
    };
    MeetingDateComponent.prototype.dateToString = function (date) {
        var newDate = new Date(this.dateModel.year, this.dateModel.month - 1, this.dateModel.day);
        return this.days[newDate.getDay()] + ' ' + date.day + ' ' + this.months[newDate.getMonth()];
    };
    MeetingDateComponent.prototype.stringToDate = function (date) {
        var d = new Date(date);
        return { day: d.getDate(), month: d.getMonth() + 1, year: d.getFullYear() };
    };
    MeetingDateComponent.prototype.compareDates = function (date1, date2) {
        return (date1.year === date2.year) && (date1.month === date2.month) && (date1.day === date2.day);
    };
    MeetingDateComponent.prototype.hasPotentialDate = function (date) {
        for (var i in this.potentialDatesArray) {
            if (this.compareDates(this.stringToDate(this.potentialDatesArray[i].start_date), date)) {
                return true;
            }
        }
        return false;
    };
    MeetingDateComponent.prototype.isDisabled = function (date, current) {
        var now = new Date();
        return (date.month !== current.month || date.year < now.getFullYear() || date.month < now.getMonth() + 1 || (date.month == now.getMonth() + 1 && date.day < now.getDate()));
    };
    /**
     * Fetch from API potential times for the given meeting id.
     * @param meetingId
     */
    MeetingDateComponent.prototype.loadMeetingPotentialTimes = function (meetingId) {
        var _this = this;
        this.meetingService.getMeetingPotentialTimes(meetingId).subscribe(function (dates) {
            console.log('loadMeetingPotentialTimes : ', dates);
            if (dates != null) {
                //clear array
                _this.potentialDatesArray = new Array();
                //add received dates
                (_a = _this.potentialDatesArray).push.apply(_a, dates);
            }
            _this.potentialDates = Observable.of(dates);
            _this.cd.detectChanges();
            var _a;
        }, function (error) {
            console.log('get potentials dates error', error);
        });
    };
    /* Call this method to check if all required params are correctly set. */
    MeetingDateComponent.prototype.canFinish = function () {
        var canFinish = this.meetingGoal != null && this.meetingContext != null && this.dateModel != null;
        // console.log('canFinish : ', canFinish);
        return canFinish;
    };
    /* Save the different dates and set goal and context.
     * Navigate to the list of meetings */
    MeetingDateComponent.prototype.finish = function () {
        var _this = this;
        console.log('finish, meetingGoal : ', this.meetingGoal);
        console.log('finish, meetingContext : ', this.meetingContext);
        //save GOAL and CONTEXT
        this.meetingService.addAContextForMeeting(this.meetingId, this.meetingContext).flatMap(function (meetingReview) {
            return _this.meetingService.addAGoalToMeeting(_this.meetingId, _this.meetingGoal);
        }).subscribe(function (meetingReview) {
            var user = _this.authService.getConnectedUser();
            if (user != null) {
                _this.router.navigate(['/meetings']);
            }
        });
    };
    MeetingDateComponent.prototype.ngOnDestroy = function () {
        if (this.subscriptionConnectUser) {
            this.subscriptionConnectUser.unsubscribe();
        }
    };
    //callback when "goal" for this meeting has changed
    MeetingDateComponent.prototype.onGoalValueUpdated = function (goal) {
        console.log('onGoalUpdated goal', goal);
        this.meetingGoal = goal;
    };
    //callback when "context" for this meeting has changed
    MeetingDateComponent.prototype.onContextValueUpdated = function (context) {
        console.log('onContextValueUpdated context', context);
        this.meetingContext = context;
    };
    return MeetingDateComponent;
}());
MeetingDateComponent = __decorate([
    Component({
        selector: 'rb-meeting-date',
        templateUrl: './meeting-date.component.html',
        styleUrls: ['./meeting-date.component.css']
    }),
    __metadata("design:paramtypes", [Router, ActivatedRoute, MeetingsService, AuthService, ChangeDetectorRef])
], MeetingDateComponent);
export { MeetingDateComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/meeting/meeting-date/meeting-date.component.js.map