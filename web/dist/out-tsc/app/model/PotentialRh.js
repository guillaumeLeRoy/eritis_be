/**
 * Created by guillaume on 29/05/2017.
 */
var PotentialRh = (function () {
    function PotentialRh(id) {
        this.id = id;
    }
    PotentialRh.parsePotentialRh = function (json) {
        var potentialRh = new PotentialRh(json.id);
        potentialRh.email = json.email;
        potentialRh.firstName = json.first_name;
        potentialRh.lastName = json.last_name;
        potentialRh.start_date = json.create_date;
        return potentialRh;
    };
    return PotentialRh;
}());
export { PotentialRh };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/model/PotentialRh.js.map