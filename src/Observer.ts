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
    if (oc.pingService) ServiceStatus.Ping = oc.pingService;
    if (!ServiceStatus.Instance) ServiceStatus.Instance = new ServiceStatus(oc.period);
    return function <T extends {new(...args: any[]): Observer}>(constructor: T) {
        return class extends constructor {
            ObserverId = Date.now() * Math.random() * 1000;
            constructor(...args: any[]) {
                super(...args);
                ServiceStatus.Instance.attach(this);
            }
        }
    }
}