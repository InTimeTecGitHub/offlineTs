var ServiceStatus = require("../../dist/src/ServiceStatus").ServiceStatus;

class PService {
    async ping() {
        return true;
    }
}
var serviceStatus = new ServiceStatus(PService);
var TestObserverOne = serviceStatus.Observe (function () {
        this.state = 0;
        this.updateState = function () {
            this.state = 99;
            return true;
        }
    }
)
/*
serviceStatus.observe(
    TestObserverOne
)
*/

exports.TestObserverOne = TestObserverOne;
exports.serviceStatus = serviceStatus;
exports.PService = PService;