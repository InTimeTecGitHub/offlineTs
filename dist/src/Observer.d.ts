import { StateType } from "./ServiceStatus";
import { PingService } from "./PingService";
export interface Observer {
    updateState: (state: StateType) => Promise<any>;
    ObserverId?: number;
}
export interface ObserveConfig {
    period?: number;
    pingService?: PingService;
}
export declare function Observe(oc?: ObserveConfig): <T extends new (...args: any[]) => Observer>(constructor: T) => {
    new (...args: any[]): {
        ObserverId: number;
        updateState: (state: StateType) => Promise<any>;
    };
} & T;
