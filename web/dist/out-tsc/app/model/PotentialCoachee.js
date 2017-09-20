/**
 * Created by guillaume on 18/05/2017.
 */
var PotentialCoachee = (function () {
    function PotentialCoachee(id) {
        this.id = id;
    }
    PotentialCoachee.parsePotentialCoachee = function (json) {
        var potentialCoachee = new PotentialCoachee(json.id);
        potentialCoachee.email = json.email;
        potentialCoachee.start_date = json.create_date;
        potentialCoachee.plan = json.plan;
        return potentialCoachee;
    };
    return PotentialCoachee;
}());
export { PotentialCoachee };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/model/PotentialCoachee.js.map