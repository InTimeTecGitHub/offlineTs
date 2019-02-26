import { Observer } from "./Observer";
import { PingService } from "./PingService";
export declare enum StateType {
    ONLINE = 0,
    OFFLINE = 1
}
export declare class ServiceStatus {
    private ping;
    private period?;
    private interval;
    private state;
    private observers;
    Observe: <T extends {
        new (...args: any[]): Observer;
    }>(constructor: T) => T;
    observe(funct: any): void;
    attach(observer: Observer): void;
    Ping: PingService;
    Period: number;
    State: StateType;
    goOnline(): this;
    goOffline(): this;
    notify(): void;
    private callback;
    cancelInterval(): void;
    startPing(period: number): void;
    constructor(ping: PingService);
}
