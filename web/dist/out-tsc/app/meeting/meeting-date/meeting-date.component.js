var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ChangeDetectorRef, Component, Injectable } from '@angular/core';
import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../service/auth.service';
import { Observable } from 'rxjs';
import { MeetingDate } from '../../model/MeetingDate';
import { ActivatedRoute, Router } from '@angular/router';
import { MeetingsService } from '../../service/meetings.service';
import { Utils } from '../../utils/Utils';
var I18N_VALUES = {
    'fr': {
        weekdays: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
        months: Utils.months
    }
    // other languages you would support
};
// Define a service holding the language. You probably already have one if your app is i18ned. Or you could also
// use the Angular LOCALE_ID value
var I18n = (function () {
    function I18n() {
        this.language = 'fr';
    }
    I18n = __decorate([
        Injectable()
    ], I18n);
    return I18n;
}());
export { I18n };
// Define custom service providing the months and weekdays translations
var CustomDatepickerI18n = (function (_super) {
    __extends(CustomDatepickerI18n, _super);
    function CustomDatepickerI18n(_i18n) {
        var _this = _super.call(this) || this;
        _this._i18n = _i18n;
        return _this;
    }
    CustomDatepickerI18n.prototype.getWeekdayShortName = function (weekday) {
        return I18N_VALUES[this._i18n.language].weekdays[weekday - 1];
    };
    CustomDatepickerI18n.prototype.getMonthShortName = function (month) {
        return I18N_VALUES[this._i18n.language].months[month - 1];
    };
    CustomDatepickerI18n.prototype.getMonthFullName = function (month) {
        return this.getMonthShortName(month);
    };
    CustomDatepickerI18n = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [I18n])
    ], CustomDatepickerI18n);
    return CustomDatepickerI18n;
}(NgbDatepickerI18n));
export { CustomDatepickerI18n };
var MeetingDateComponent = (function () {
    function MeetingDateComponent(router, route, meetingService, authService, cd) {
        this.router = router;
        this.route = route;
        this.meetingService = meetingService;
        this.authService = authService;
        this.cd = cd;
        this.loading = false;
        this.now = Utils.timestampToNgbDate((new Date()).valueOf());
        this.dateModel = null;
        this.timeRange = [10, 18];
        this.isEditingPotentialDate = false;
        this.loadingMeetings = false;
        this.potentialDatesArray = new Array();
    }
    MeetingDateComponent.prototype.ngOnInit = function () {
        console.log("ngOnInit", this.now);
        this.loadingMeetings = true;
    };
    MeetingDateComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        // meetingId should be in the router
        this.route.params.subscribe(function (params) {
            _this.meetingId = params['meetingId'];
            console.log('route param, meetingId : ' + _this.meetingId);
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
    MeetingDateComponent.prototype.ngOnDestroy = function () {
        if (this.subscriptionConnectUser) {
            this.subscriptionConnectUser.unsubscribe();
        }
        if (this.getAllMeetingsForCoacheeIdSubscription) {
            this.getAllMeetingsForCoacheeIdSubscription.unsubscribe();
        }
    };
    MeetingDateComponent.prototype.onConnectedUserReceived = function (user) {
        this.connectedUser = Observable.of(user);
        if (user) {
            this.getAllMeetingsForCoachee(user.id);
            if (this.meetingId)
                this.loadMeetingPotentialTimes(this.meetingId);
        }
        this.cd.detectChanges();
    };
    /**
     * Fetch from API potential times for the given meeting id.
     * @param meetingId
     */
    MeetingDateComponent.prototype.loadMeetingPotentialTimes = function (meetingId) {
        var _this = this;
        this.meetingService.getMeetingPotentialTimes(meetingId).subscribe(function (dates) {
            console.log('loadMeetingPotentialTimes success', dates);
            if (dates != null) {
                // clear array
                _this.potentialDatesArray = new Array();
                // add received dates
                (_a = _this.potentialDatesArray).push.apply(_a, dates);
            }
            _this.potentialDates = Observable.of(dates);
            _this.cd.detectChanges();
            var _a;
        }, function (error) {
            console.log('loadMotentialTimes error', error);
        });
    };
    MeetingDateComponent.prototype.getAllMeetingsForCoachee = function (coacheeId) {
        var _this = this;
        this.loadingMeetings = true;
        this.getAllMeetingsForCoacheeIdSubscription = this.meetingService.getAllMeetingsForCoacheeId(coacheeId)
            .subscribe(function (meetings) {
            console.log('got meetings for coachee', meetings);
            _this.onMeetingsObtained(meetings);
        }, function (error) {
            console.log('got meetings for coachee ERROR', error);
            _this.loadingMeetings = false;
        });
    };
    MeetingDateComponent.prototype.onMeetingsObtained = function (meetings) {
        console.log('got meetings for coachee', meetings);
        if (meetings)
            this.getAgreedMeetings(meetings);
        this.loadingMeetings = false;
        this.cd.detectChanges();
    };
    MeetingDateComponent.prototype.getAgreedMeetings = function (meetings) {
        console.log('getAgreedMeetings');
        if (meetings) {
            this.bookedMeetings = new Array();
            for (var _i = 0, meetings_1 = meetings; _i < meetings_1.length; _i++) {
                var meeting = meetings_1[_i];
                if (meeting.isOpen && meeting.coach) {
                    console.log('getAgreedMeetings, add open meeting', meeting);
                    this.bookedMeetings.push(meeting);
                }
            }
        }
    };
    MeetingDateComponent.prototype.bookOrUpdateADate = function () {
        console.log('bookADate, dateModel : ', this.dateModel);
        var minDate = new Date(this.dateModel.year, this.dateModel.month - 1, this.dateModel.day, this.timeRange[0], 0);
        var maxDate = new Date(this.dateModel.year, this.dateModel.month - 1, this.dateModel.day, this.timeRange[1], 0);
        if (this.isEditingPotentialDate) {
            if (this.isPotentialDateOk(new MeetingDate(minDate.valueOf(), maxDate.valueOf()))) {
                this.mEditingPotentialTime.start_date = minDate.valueOf();
                this.mEditingPotentialTime.end_date = maxDate.valueOf();
                this.potentialDates = Observable.of(this.potentialDatesArray);
                this.cd.detectChanges();
                // reset progress bar values
                this.resetValues();
                Materialize.toast('Plage modifiée !', 3000, 'rounded');
            }
        }
        else {
            var dateToSave = new MeetingDate(minDate.valueOf(), maxDate.valueOf());
            // add received dates if no interference
            if (this.isPotentialDateOk(dateToSave))
                this.addPotentialDate(dateToSave);
        }
    };
    MeetingDateComponent.prototype.unbookAdate = function (meetingDate) {
        this.potentialDatesArray.splice(this.potentialDatesArray.indexOf(meetingDate), 1);
        this.potentialDates = Observable.of(this.potentialDatesArray);
        this.cd.detectChanges();
        Materialize.toast('Plage supprimée !', 3000, 'rounded');
    };
    MeetingDateComponent.prototype.modifyPotentialDate = function (meetingDate) {
        console.log('modifyPotentialDate, meetingDate', meetingDate);
        // switch to edit mode
        this.isEditingPotentialDate = true;
        this.mEditingPotentialTime = meetingDate;
        this.modifiedPotentialIndex = this.potentialDatesArray.indexOf(meetingDate);
        // position time selector
        var startTime = Utils.getHoursFromTimestamp(meetingDate.start_date);
        var endTime = Utils.getHoursFromTimestamp(meetingDate.end_date);
        this.updateTimeSelector(startTime, endTime);
        // correctly position the date on the calendar
        this.dateModel = Utils.timestampToNgbDate(meetingDate.start_date);
    };
    MeetingDateComponent.prototype.updateTimeSelector = function (minHour, maxHour) {
        this.timeRange = [minHour, maxHour];
    };
    MeetingDateComponent.prototype.resetValues = function () {
        this.mEditingPotentialTime = null;
        this.isEditingPotentialDate = false;
        this.modifiedPotentialIndex = null;
        this.updateTimeSelector(10, 18);
    };
    MeetingDateComponent.prototype.getHoursAndMinutesFromTimestamp = function (timestamp) {
        return Utils.getHoursAndMinutesFromTimestamp(timestamp);
    };
    MeetingDateComponent.prototype.timeIntToString = function (hour) {
        return Utils.timeIntToString(hour);
    };
    MeetingDateComponent.prototype.timestampToString = function (timestamp) {
        return Utils.timestampToString(timestamp);
    };
    MeetingDateComponent.prototype.ngbDateToString = function (date) {
        return Utils.ngbDateToString(date);
    };
    MeetingDateComponent.prototype.hasPotentialDate = function (date) {
        for (var _i = 0, _a = this.potentialDatesArray; _i < _a.length; _i++) {
            var potential = _a[_i];
            if (Utils.datesEqual(Utils.timestampToNgbDate(potential.start_date), date)) {
                return true;
            }
        }
        return false;
    };
    MeetingDateComponent.prototype.hasMeeting = function (date) {
        if (this.bookedMeetings) {
            for (var _i = 0, _a = this.bookedMeetings; _i < _a.length; _i++) {
                var meeting = _a[_i];
                if (Utils.datesEqual(Utils.timestampToNgbDate(meeting.agreed_date.start_date), date)) {
                    return true;
                }
            }
        }
        return false;
    };
    MeetingDateComponent.prototype.isDisabled = function (date, current) {
        var now = new Date();
        var newDate = new Date(date.year, date.month - 1, date.day);
        // TODO add this to block next month days
        // TODO date.month !== current.month ||
        return (newDate.getDay() === 6 // Samedi
            || newDate.getDay() === 0 // Dimanche
            || date.year < now.getFullYear()
            || (date.month < now.getMonth() + 1 && date.year <= now.getFullYear())
            || (date.year <= now.getFullYear() && date.month === now.getMonth() + 1 && date.day < now.getDate())
            || (date.year === now.getFullYear() && date.month === now.getMonth() + 1 && date.day < now.getDate() + 3));
    };
    MeetingDateComponent.prototype.addPotentialDate = function (date) {
        this.potentialDatesArray.push(date);
        this.potentialDates = Observable.of(this.potentialDatesArray);
        this.cd.detectChanges();
        Materialize.toast('Plage ajoutée !', 3000, 'rounded');
    };
    /* Call this method to check if all required params are correctly set. */
    MeetingDateComponent.prototype.canFinish = function () {
        var canFinish = this.meetingGoal != null
            && this.meetingContext != null
            && this.potentialDatesArray.length > 2;
        return canFinish;
    };
    /* Save the different dates and set goal and context.
     * Navigate to the list of meetings */
    MeetingDateComponent.prototype.finish = function () {
        var _this = this;
        console.log('finish, meetingGoal : ', this.meetingGoal);
        console.log('finish, meetingContext : ', this.meetingContext);
        this.loading = true;
        // create or update meeting
        // save GOAL and CONTEXT
        // save meeting dates
        this.connectedUser
            .take(1)
            .flatMap(function (user) {
            if (_this.meetingId != null) {
                return _this.meetingService
                    .updateMeeting(user.id, _this.meetingId, _this.meetingContext, _this.meetingGoal, _this.potentialDatesArray);
            }
            else {
                return _this.meetingService
                    .createMeeting(user.id, _this.meetingContext, _this.meetingGoal, _this.potentialDatesArray);
            }
        })
            .flatMap(function (meeting) {
            return _this.authService.refreshConnectedUserAsObservable();
        })
            .subscribe(function (user) {
            _this.router.navigate(['/meetings']);
            _this.loading = false;
            Materialize.toast('Vos disponibilités ont été enregitrées !', 3000, 'rounded');
            _this.router.navigate(['dashboard/meetings']);
        }, function (error) {
            console.log('getOrCreateMeeting error', error);
            _this.loading = false;
            Materialize.toast('Impossible d\'enregistrer vos disponibilités', 3000, 'rounded');
        });
    };
    // callback when "goal" for this meeting has changed
    MeetingDateComponent.prototype.onGoalValueUpdated = function (goal) {
        console.log('onGoalUpdated goal', goal);
        this.meetingGoal = goal;
    };
    // callback when "context" for this meeting has changed
    MeetingDateComponent.prototype.onContextValueUpdated = function (context) {
        console.log('onContextValueUpdated context', context);
        this.meetingContext = context;
    };
    // check if no other potential date interferes
    MeetingDateComponent.prototype.isPotentialDateOk = function (meeting) {
        /*    if (this.bookedMeetings) {
              for (let booked of this.bookedMeetings) {
                if ( Utils.sameDay(new Date(booked.agreed_date.start_date), new Date(meeting.start_date)) ) {
                  Materialize.toast('Vous avez déjà un meeting prévu ce jour là', 3000, 'rounded');
                  return false;
                }
              }
            }*/
        if (this.hasMeeting(Utils.timestampToNgbDate(meeting.start_date))) {
            Materialize.toast('Vous avez déjà un meeting prévu ce jour là', 3000, 'rounded');
            return false;
        }
        for (var _i = 0, _a = this.potentialDatesArray; _i < _a.length; _i++) {
            var potential = _a[_i];
            var start = new Date(meeting.start_date);
            var end = new Date(meeting.end_date);
            var startPotential = new Date(potential.start_date);
            var endPotential = new Date(potential.end_date);
            if (!this.isEditingPotentialDate || potential !== this.potentialDatesArray[this.modifiedPotentialIndex]) {
                // Ignores if potential corresponds to the modified timeslot
                if (Utils.sameDay(startPotential, start)) {
                    if (!(start.getHours() < startPotential.getHours() && end.getHours() <= startPotential.getHours()) &&
                        !(start.getHours() >= endPotential.getHours() && end.getHours() > endPotential.getHours())) {
                        Materialize.toast('Cette plage horaire interfère avec une autre', 3000, 'rounded');
                        return false;
                    }
                }
            }
        }
        return true;
    };
    MeetingDateComponent = __decorate([
        Component({
            selector: 'er-meeting-date',
            templateUrl: './meeting-date.component.html',
            styleUrls: ['./meeting-date.component.scss'],
            providers: [I18n, { provide: NgbDatepickerI18n, useClass: CustomDatepickerI18n }] // define custom NgbDatepickerI18n provider
        }),
        __metadata("design:paramtypes", [Router, ActivatedRoute, MeetingsService, AuthService, ChangeDetectorRef])
    ], MeetingDateComponent);
    return MeetingDateComponent;
}());
export { MeetingDateComponent };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/meeting/meeting-date/meeting-date.component.js.map