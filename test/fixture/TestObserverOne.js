var serviceStatus = require("./TestObserver").serviceStatus;

var TestObserverOne = serviceStatus.Observe(function () {
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