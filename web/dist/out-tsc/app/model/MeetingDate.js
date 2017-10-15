/**
 * Created by guillaume on 14/03/2017.
 */
var MeetingDate = (function () {
    function MeetingDate() {
    }
    MeetingDate.parseFromBE = function (json) {
        var date = new MeetingDate();
        date.id = json.id;
        // convert dates to use milliseconds ....
        date.start_date = json.start_date * 1000;
        date.end_date = json.end_date * 1000;
        return date;
    };
    return MeetingDate;
}());
export { MeetingDate };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/model/MeetingDate.js.map