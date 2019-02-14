"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceStatus_1 = require("./ServiceStatus");
const PingService_1 = require("./PingService");
function Observe(oc = {
    pingService: PingService_1.defaultPingService
}) {
    if (oc.pingService)
        ServiceStatus_1.ServiceStatus.Ping = oc.pingService;
    if (!ServiceStatus_1.ServiceStatus.Instance)
        ServiceStatus_1.ServiceStatus.Instance = new ServiceStatus_1.ServiceStatus(oc.period);
    return function (constructor) {
        return class extends constructor {
            constructor(...args) {
                super(...args);
                this.ObserverId = Date.now() * Math.random() * 1000;
                ServiceStatus_1.ServiceStatus.Instance.attach(this);
            }
        };
    };
}
exports.Observe = Observe;
