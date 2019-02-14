import { Observer } from "./Observer";
import { PingService } from "./PingService";
export declare enum StateType {
    ONLINE = 0,
    OFFLINE = 1
}
export declare class ServiceStatus {
    private period;
    private static instance;
    static Instance: ServiceStatus;
    private static ping;
    private interval;
    private state;
    observers: Map<number, Observer>;
    attach(observer: Observer): void;
    static Ping: PingService;
    State: StateType;
    static goOnline(): typeof ServiceStatus;
    static goOffline(): typeof ServiceStatus;
    notify(): void;
    private callback;
    static cancelInterval(): void;
    constructor(period?: number);
}
