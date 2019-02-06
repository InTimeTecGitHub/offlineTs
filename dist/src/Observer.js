"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceStatus_1 = require("./ServiceStatus");
const PingService_1 = require("./PingService");
function Observe(oc = {
    pingService: PingService_1.defaultPingService
}) {
    if (oc.pingService)
        ServiceStatus_1.ServiceStatus.ping = oc.pingService;
    if (!ServiceStatus_1.ServiceStatus.instance)
        ServiceStatus_1.ServiceStatus.instance = new ServiceStatus_1.ServiceStatus(oc.period);
    return function (constructor) {
        return class extends constructor {
            constructor(...args) {
                super(...args);
                this.ObserverId = Date.now() * Math.random() * 1000;
                ServiceStatus_1.ServiceStatus.instance.attach(this);
            }
        };
    };
}
exports.Observe = Observe;
//# sourceMappingURL=Observer.js.map