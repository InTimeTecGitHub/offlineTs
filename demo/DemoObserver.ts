import {ServiceStatus, StateType} from "../src/ServiceStatus";
import {defaultPingService} from "../dist/src/PingService";

let serviceStatus = new ServiceStatus(defaultPingService);

@serviceStatus.Observe
class DemoObserver {
    async updateState(state: StateType) {
        if (state === StateType.ONLINE) {
            document.body.setAttribute("bgColor", "green");
            let el = document.getElementById("statusHeader");
            el && (el.innerText = "ONLINE")
        } else if (state === StateType.OFFLINE) {
            document.body.setAttribute("bgColor", "red");
            let el = document.getElementById("statusHeader");
            el && (el.innerText = "OFFLINE");
        }
    }
    constructor() {
        document.body.setAttribute("bgColor", "green");
        let el = document.getElementById("statusHeader");
        el && (el.innerText = "ONLINE");
    }
}

var demo = new DemoObserver();
serviceStatus.startPing(1000);
console.log(demo);