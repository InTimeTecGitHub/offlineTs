import {Observer} from "./Observer";
import {PingService} from "./PingService";


export enum StateType {
    ONLINE,
    OFFLINE
}

export class ServiceStatus {
    static instance: ServiceStatus;
    static ping: PingService;
    private interval: any;
    private state: StateType;
    observers: Map<number, Observer> = new Map<number, any>();

    attach(observer: Observer) {
        if (observer.ObserverId)
            this.observers.set(observer.ObserverId, observer);
        else throw new Error("ObserverId Not Set.");
    }

    set State(state: StateType) {
        this.state = state;
        this.notify();
    }

    get State(): StateType {
        return this.state;
    }

    static goOnline() {
        if (ServiceStatus.instance.State !== StateType.ONLINE) {
            ServiceStatus.instance.State = StateType.ONLINE;
        }
        return this;
    }

    static goOffline() {
        if (ServiceStatus.instance.State !== StateType.OFFLINE) {
            ServiceStatus.instance.State = StateType.OFFLINE;
        }
        return this;
    }
    notify() {
        this.observers.forEach(observer => observer.updateState(this.State));
    }

    private async callback() {
        if (!ServiceStatus.ping) return;
        if (await ServiceStatus.ping.ping()) return ServiceStatus.goOnline();
        else return ServiceStatus.goOffline();
    }

    static cancelInterval() {
        clearInterval(ServiceStatus.instance.interval);
    }

    constructor(private period: number = 1000) {
        this.interval = setInterval(() => this.callback(), this.period);
    }
}