/**
 * Created by guillaume on 15/05/2017.
 */
var HR = (function () {
    function HR(id) {
        this.id = id;
    }
    HR.parseRh = function (json) {
        console.log(json);
        var rh = new HR(json.id);
        rh.email = json.email;
        rh.description = json.description;
        rh.first_name = json.first_name;
        rh.last_name = json.last_name;
        rh.start_date = json.start_date;
        rh.avatar_url = json.avatar_url;
        rh.company_name = json.company_name;
        return rh;
    };
    return HR;
}());
export { HR };
//# sourceMappingURL=/Users/guillaume/angular/eritis_fe/src/app/model/HR.js.map