var ServiceStatus = require("../../dist/src/ServiceStatus").ServiceStatus;
class PService {
    async ping() {
        return true;
    }
}
var serviceStatus = new ServiceStatus(new PService());
module.exports = function () {
    this.state = 0;
    this.updateState = function () {
        this.state = 999;
        return true;
    }
}
