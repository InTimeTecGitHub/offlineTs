import {ServiceStatus, StateType} from "./ServiceStatus";
import {PingService, defaultPingService} from "./PingService";

export interface Observer {
    updateState: (state: StateType) => Promise<any>;
    ObserverId?: number;
}

export interface ObserveConfig {
    period?: number;
    pingService?: PingService;
}

export function Observe(oc: ObserveConfig = {
    pingService: defaultPingService
}) {
    if (oc.pingService) ServiceStatus.ping = oc.pingService;
    if (!ServiceStatus.instance) ServiceStatus.instance = new ServiceStatus(oc.period);
    return function <T extends {new(...args: any[]): Observer}>(constructor: T) {
        return class extends constructor {
            ObserverId = Date.now() * Math.random() * 1000;
            constructor(...args: any[]) {
                super(...args);
                ServiceStatus.instance.attach(this);
            }
        }
    }
}