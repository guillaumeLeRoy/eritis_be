/**
 * Created by guillaume on 02/09/2017.
 */
var Utils = (function () {
    function Utils() {
    }
    /*Dates*/
    /* Return a string displaying date from a string date */
    Utils.dateToString = function (date) {
        var ngbDate = this.stringToNgbDate(date);
        return this.ngbDateToString(ngbDate);
    };
    /* Return a string displaying date from a timestamp */
    Utils.timestampToString = function (timestamp) {
        var ngbDate = this.timestampToNgbDate(timestamp);
        return this.ngbDateToString(ngbDate);
    };
    Utils.dateToStringShort = function (date) {
        var ngbDate = this.stringToNgbDate(date);
        return this.ngbDateToStringShort(ngbDate);
    };
    /* Return a string from a ngbDateStruct */
    Utils.ngbDateToString = function (date) {
        var newDate = new Date(date.year, date.month - 1, date.day);
        return this.printDate(newDate);
    };
    Utils.ngbDateToStringShort = function (date) {
        var newDate = new Date(date.year, date.month - 1, date.day);
        return this.printDateShort(newDate);
    };
    Utils.printDate = function (date) {
        return this.days[date.getDay()] + ' ' + date.getDate() + ' ' + this.months[date.getMonth()];
    };
    Utils.printDateShort = function (date) {
        return date.getDate() + ' ' + this.months[date.getMonth()];
    };
    /* Return a NgbDateStruct from a string date */
    Utils.stringToNgbDate = function (date) {
        var d = new Date(date);
        return { day: d.getDate(), month: d.getMonth() + 1, year: d.getFullYear() };
    };
    /* Return a NgbDateStruct from a timestamp */
    Utils.timestampToNgbDate = function (timestamp) {
        var d = new Date(timestamp);
        return { day: d.getDate(), month: d.getMonth() + 1, year: d.getFullYear() };
    };
    /* Return a string displaying time from date string*/
    Utils.getHoursAndMinutesFromDate = function (date) {
        return this.getHours(date) + 'h' + this.getMinutes(date);
    };
    /* Return a string displaying time from date string*/
    Utils.getHoursAndMinutesFromTimestamp = function (timestamp) {
        return this.getHoursFromTimestamp(timestamp) + 'h' + this.getMinutesFromTimestamp(timestamp);
    };
    /* Return a string displaying time from integer*/
    Utils.timeIntToString = function (hour) {
        if (hour === Math.round(hour))
            return hour + 'h00';
        else
            return Math.round(hour) - 1 + 'h30';
    };
    Utils.getDate = function (date) {
        return (new Date(date)).getDate() + ' ' + this.months[(new Date(date)).getMonth()];
    };
    Utils.getHours = function (date) {
        return (new Date(date)).getHours();
    };
    Utils.getMinutes = function (date) {
        var m = (new Date(date)).getMinutes();
        if (m === 0)
            return '00';
        if (m < 10)
            return '0' + m;
        return m.toString();
    };
    Utils.getDayAndMonthFromTimestamp = function (timestamp) {
        return (new Date(timestamp)).getDate() + ' ' + this.months[(new Date(timestamp)).getMonth()];
    };
    Utils.getHoursFromTimestamp = function (timestamp) {
        return (new Date(timestamp)).getHours();
    };
    Utils.getMinutesFromTimestamp = function (timestamp) {
        var m = (new Date(timestamp)).getMinutes();
        if (m === 0) {
            return '00';
        }
        if (m < 10)
            return '0' + m;
        return m.toString();
    };
    Utils.months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    Utils.days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    Utils.EMAIL_REGEX = '[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&\'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?';
    return Utils;
}());
export { Utils };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/utils/Utils.js.map