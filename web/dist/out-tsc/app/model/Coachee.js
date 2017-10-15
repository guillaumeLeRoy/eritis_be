var Coachee = (function () {
    function Coachee(id) {
        this.id = id;
    }
    Coachee.parseCoachee = function (json) {
        // TODO : don't really need to manually parse the received Json
        var coachee = new Coachee(json.id);
        coachee.id = json.id;
        coachee.email = json.email;
        coachee.first_name = json.first_name;
        coachee.last_name = json.last_name;
        coachee.avatar_url = json.avatar_url;
        coachee.start_date = json.start_date;
        coachee.selectedCoach = json.selectedCoach;
        coachee.contractPlan = json.plan;
        coachee.availableSessionsCount = json.available_sessions_count;
        coachee.updateAvailableSessionCountDate = json.update_sessions_count_date;
        coachee.sessionsDoneMonthCount = json.sessions_done_month_count;
        coachee.sessionsDoneTotalCount = json.sessions_done_total_count;
        coachee.associatedRh = json.associatedRh;
        coachee.last_objective = json.last_objective;
        coachee.plan = json.plan;
        return coachee;
    };
    return Coachee;
}());
export { Coachee };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/model/Coachee.js.map