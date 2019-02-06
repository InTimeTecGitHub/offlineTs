import { Observer } from "./Observer";
import { PingService } from "./PingService";
export declare enum StateType {
    ONLINE = 0,
    OFFLINE = 1
}
export declare class ServiceStatus {
    private period;
    static instance: ServiceStatus;
    static ping: PingService;
    private interval;
    private state;
    observers: Map<number, Observer>;
    attach(observer: Observer): void;
    State: StateType;
    goOnline(): this;
    goOffline(): this;
    notify(): void;
    private callback;
    cancelInterval(): void;
    constructor(period?: number);
}
