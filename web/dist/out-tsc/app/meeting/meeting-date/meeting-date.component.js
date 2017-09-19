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
import { ChangeDetectorRef, Component, Injectable } from "@angular/core";
import { NgbDatepickerI18n } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "../../service/auth.service";
import { Observable } from "rxjs";
import { MeetingDate } from "../../model/MeetingDate";
import { ActivatedRoute, Router } from "@angular/router";
import { MeetingsService } from "../../service/meetings.service";
import { Utils } from "../../utils/Utils";
var I18N_VALUES = {
    'fr': {
        weekdays: ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'],
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
        window.scrollTo(0, 0);
        console.log("MeetingDateComponent onInit");
        // meetingId should be in the router
        this.route.params.subscribe(function (params) {
            _this.meetingId = params['meetingId'];
            console.log("route param, meetingId : " + _this.meetingId);
            if (_this.meetingId != undefined) {
                _this.loadMeetingPotentialTimes(_this.meetingId);
            }
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
    MeetingDateComponent.prototype.getOrCreateMeeting = function () {
        var _this = this;
        if (this.meetingId != null) {
            return Observable.of(this.meetingId);
        }
        return this.connectedUser
            .take(1)
            .flatMap(function (user) {
            return _this.meetingService
                .createMeeting(user.id)
                .map(function (meeting) {
                console.log('meeting created');
                return meeting.id;
            });
        });
    };
    MeetingDateComponent.prototype.onConnectedUserReceived = function (user) {
        this.connectedUser = Observable.of(user);
        this.cd.detectChanges();
    };
    MeetingDateComponent.prototype.bookOrUpdateADate = function () {
        console.log('bookADate, dateModel : ', this.dateModel);
        // console.log('bookADate, timeModel : ', this.timeModel);
        var minDate = new Date(this.dateModel.year, this.dateModel.month - 1, this.dateModel.day, this.timeRange[0], 0);
        var maxDate = new Date(this.dateModel.year, this.dateModel.month - 1, this.dateModel.day, this.timeRange[1], 0);
        // let timestampMin: number = +minDate.getTime().toFixed(0) / 1000;
        // let timestampMax: number = +maxDate.getTime().toFixed(0) / 1000;
        if (this.isEditingPotentialDate) {
            // this.mEditingPotentialTime.start_date = minDate.valueOf().toString();//TODO verify getTime et valueOf return the same value
            // this.mEditingPotentialTime.end_date = maxDate.valueOf().toString();
            this.mEditingPotentialTime.start_date = minDate.valueOf();
            this.mEditingPotentialTime.end_date = maxDate.valueOf();
            this.potentialDates = Observable.of(this.potentialDatesArray);
            this.cd.detectChanges();
            //reset progress bar values
            this.resetValues();
            Materialize.toast('Plage modifiée !', 3000, 'rounded');
            //   // just update potential date
            //   this.meetingService.updatePotentialTime(this.mEditingPotentialTimeId, timestampMin, timestampMax).subscribe(
            //     (meetingDate: MeetingDate) => {
            //       console.log('updatePotentialTime, meetingDate : ', meetingDate);
            //       // Reload potential times
            //       this.loadMeetingPotentialTimes(this.meetingId);
            //       //reset progress bar values
            //       this.resetValues();
            //       Materialize.toast('Plage modifiée !', 3000, 'rounded')
            //     },
            //     (error) => {
            //       console.log('updatePotentialTime error', error);
            //       this.displayErrorBookingDate = true;
            //       Materialize.toast('Erreur lors de la modification', 3000, 'rounded')
            //     }
            //   );
            //
        }
        else {
            var dateToSave = new MeetingDate();
            // dateToSave.start_date = minDate.valueOf().toString();//TODO verify getTime et valueOf return the same value
            // dateToSave.end_date = maxDate.valueOf().toString();
            dateToSave.start_date = minDate.valueOf(); //TODO verify getTime et valueOf return the same value
            dateToSave.end_date = maxDate.valueOf();
            // dateToSave.start_date = timestampMin.toString();//TODO verify getTime et valueOf return the same value
            // dateToSave.end_date = timestampMax.toString();
            // console.log('bookOrUpdateADate, timestampMin : ', timestampMin);
            // console.log('bookOrUpdateADate,  dateToSave.start_date : ', dateToSave.start_date);
            //
            // let date = new Date(timestampMin);
            // console.log('bookOrUpdateADate, date min : ', date);
            //
            // date = new Date(minDate.valueOf());
            // console.log('bookOrUpdateADate, date min : ', date);
            // dateToSave.start_date = minDate.toDateString();//TODO verify getTime et valueOf return the same value
            // dateToSave.end_date = maxDate.toDateString();
            this.addPotentialDate(dateToSave);
            //   // create new date
            //   this.meetingService.addPotentialDateToMeeting(this.meetingId, timestampMin, timestampMax).subscribe(
            //     (meetingDate: MeetingDate) => {
            //       console.log('addPotentialDateToMeeting, meetingDate : ', meetingDate);
            //       this.potentialDatesArray.push(meetingDate);
            //       // Reload potential times
            //       console.log('reload potential times');
            //       // Reload potential times
            //       this.loadMeetingPotentialTimes(this.meetingId);
            //       //reset progress bar values
            //       this.resetValues();
            //       Materialize.toast('Plage ajoutée !', 3000, 'rounded')
            //     },
            //     (error) => {
            //       console.log('addPotentialDateToMeeting error', error);
            //       this.displayErrorBookingDate = true;
            //       Materialize.toast("Erreur lors de l'ajout", 3000, 'rounded')
            //     }
            //   );
        }
    };
    MeetingDateComponent.prototype.unbookAdate = function (meetingDate) {
        // console.log('unbookAdate');
        // this.meetingService.removePotentialTime(potentialDateId).subscribe(
        //   (response) => {
        //     console.log('unbookAdate, response', response);
        //     //reset progress bar values
        //     this.resetValues();
        //     // Reload potential times
        //     this.loadMeetingPotentialTimes(this.meetingId);
        //   }, (error) => {
        //     console.log('unbookAdate, error', error);
        //   }
        // );
        this.potentialDatesArray.splice(this.potentialDatesArray.indexOf(meetingDate), 1);
        this.potentialDates = Observable.of(this.potentialDatesArray);
        this.cd.detectChanges();
    };
    MeetingDateComponent.prototype.modifyPotentialDate = function (meetingDate) {
        console.log('modifyPotentialDate, meetingDate', meetingDate);
        //switch to edit mode
        this.isEditingPotentialDate = true;
        this.mEditingPotentialTime = meetingDate;
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
    MeetingDateComponent.prototype.timestampToNgbDateStruct = function (timestamp) {
        return Utils.timestampToNgbDate(timestamp);
    };
    MeetingDateComponent.prototype.compareDates = function (date1, date2) {
        return (date1.year === date2.year) && (date1.month === date2.month) && (date1.day === date2.day);
    };
    MeetingDateComponent.prototype.hasPotentialDate = function (date) {
        for (var i in this.potentialDatesArray) {
            if (this.compareDates(this.timestampToNgbDateStruct(this.potentialDatesArray[i].start_date), date)) {
                return true;
            }
        }
        return false;
    };
    MeetingDateComponent.prototype.isDisabled = function (date, current) {
        var now = new Date();
        var newDate = new Date(date.year, date.month - 1, date.day);
        // TODO add this to block next month days
        // TODO date.month !== current.month ||
        return (newDate.getDay() === 6 || newDate.getDay() === 0 || date.year < now.getFullYear() || (date.month < now.getMonth() + 1 && date.year <= now.getFullYear()) || (date.year <= now.getFullYear() && date.month == now.getMonth() + 1 && date.day < now.getDate()));
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
    MeetingDateComponent.prototype.addPotentialDate = function (date) {
        //add received dates
        this.potentialDatesArray.push(date);
        this.potentialDates = Observable.of(this.potentialDatesArray);
        this.cd.detectChanges();
    };
    /* Call this method to check if all required params are correctly set. */
    MeetingDateComponent.prototype.canFinish = function () {
        var canFinish = this.meetingGoal != null && this.meetingContext != null && this.potentialDatesArray.length > 0;
        return canFinish;
    };
    /* Save the different dates and set goal and context.
     * Navigate to the list of meetings */
    MeetingDateComponent.prototype.finish = function () {
        var _this = this;
        console.log('finish, meetingGoal : ', this.meetingGoal);
        console.log('finish, meetingContext : ', this.meetingContext);
        // create meeting
        // save GOAL and CONTEXT
        // save meeting dates
        this.getOrCreateMeeting()
            .flatMap(function (meetingId) {
            return _this.meetingService.addAContextForMeeting(meetingId, _this.meetingContext)
                .flatMap(function (meetingReview) {
                return _this.meetingService.addAGoalToMeeting(meetingId, _this.meetingGoal);
            })
                .flatMap(function (meetingReview) {
                return _this.addMeetingDatesToMeeting(meetingId, _this.potentialDatesArray);
            });
        }).subscribe(function (res) {
            window.scrollTo(0, 0);
            _this.router.navigate(['/meetings']);
            Materialize.toast('Vos disponibilités on été enregitrées !', 3000, 'rounded');
        }, function (error) {
            console.log('getOrCreateMeeting error', error);
            Materialize.toast("Impossible d'enregistrer vos disponibilités", 3000, 'rounded');
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
    MeetingDateComponent.prototype.addMeetingDatesToMeeting = function (meetingId, meetingDates) {
        return this.meetingService.addPotentialDatesToMeeting(meetingId, meetingDates);
    };
    MeetingDateComponent = __decorate([
        Component({
            selector: 'rb-meeting-date',
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