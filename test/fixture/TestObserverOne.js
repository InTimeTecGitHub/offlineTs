var serviceStatus = require("./TestObserver").serviceStatus;

var TestObserverOne = serviceStatus.Observe(function () {
    this.state = 0;
    this.updateState = function () {
        this.state = 99;
        return true;
    }
}
)

exports.TestObserverOne = TestObserverOne;