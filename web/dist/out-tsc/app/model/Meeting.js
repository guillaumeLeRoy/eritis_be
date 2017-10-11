import { Coach } from "./Coach";
import { Coachee } from "./Coachee";
import { MeetingDate } from "./MeetingDate";
var Meeting = (function () {
    function Meeting() {
    }
    Meeting.parseFromBE = function (json) {
        console.log("parseFromBE, json : ", json);
        var meeting = new Meeting();
        meeting.id = json.id;
        if (json.coach != null) {
            meeting.coach = Coach.parseCoach(json.coach);
        }
        if (json.coachee != null) {
            meeting.coachee = Coachee.parseCoachee(json.coachee);
        }
        meeting.isOpen = json.isOpen;
        if (json.agreed_date != null) {
            meeting.agreed_date = MeetingDate.parseFromBE(json.agreed_date);
        }
        // convert dates to use milliseconds ....
        meeting.created_date = json.created_date * 1000; //todo convert to unix time
        console.log("parseFromBE, Meeting created: ", meeting);
        return meeting;
    };
    return Meeting;
}());
export { Meeting };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/model/Meeting.js.map