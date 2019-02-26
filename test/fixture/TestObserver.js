var ServiceStatus = require("../../dist/src/ServiceStatus").ServiceStatus;

class PService {
    ping() {
        return new Promise((resolve) => resolve(true));
    }
}
var serviceStatus = new ServiceStatus(new PService());
var TestObserver = serviceStatus.Observe(function () {
    this.state = 0;
    this.updateState = function () {
        this.state = 999;
        return true;
    }
}
)
/*
serviceStatus.observe(
    TestObserver
)
*/
exports.TestObserver = TestObserver;
exports.serviceStatus = serviceStatus;
exports.PService = PService;