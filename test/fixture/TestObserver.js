var ServiceStatus = require("../../dist/src/ServiceStatus").ServiceStatus;
class PService {
    async ping() {
        return true;
    }
}
var serviceStatus = new ServiceStatus(new PService());
exports.TestObserver = function () {
    this.state = 0;
    this.updateState = function () {
        console.log("Hi");
        this.state = 999;
        return true;
    }
}