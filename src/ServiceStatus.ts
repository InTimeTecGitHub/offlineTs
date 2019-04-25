import {Observer} from "./Observer";
import {PingService} from "./PingService";


export enum StateType {
    ONLINE,
    OFFLINE
}

export class ServiceStatus {
    private period?: number;
    private interval: any;
    private state: StateType;
    private observers: Map<number, Observer> = new Map<number, any>();
    private response: Response | Error;

    Observe: <T extends {new(...args: any[]): Observer}>(constructor: T) => T;

    attach(observer: Observer) {
        if (observer.ObserverId)
            this.observers.set(observer.ObserverId, observer);
        else throw new Error("ObserverId Not Set.");
    }

    set Ping(ping: PingService) {
        this.ping = ping;
    }

    set Period(period: number) {
        this.cancelInterval();
        this.period = period;
        this.interval = setInterval(() => this.callback(), this.period);
    }

    set State(state: StateType) {
        this.state = state;
        this.notify();
    }

    get State(): StateType {
        return this.state;
    }

    get Response(): Response | Error {
        return this.response || new Response();
    }

    goOnline() {
        if (this.State !== StateType.ONLINE) {
            this.State = StateType.ONLINE;
        }
        return this;
    }

    goOffline() {
        if (this.State !== StateType.OFFLINE) {
            this.State = StateType.OFFLINE;
        }
        return this;
    }
    notify() {
        this.observers.forEach(observer => observer.updateState(this.State, this.response));
    }

    private async callback() {
        if (!this.ping) return;
        await this.ping.ping()
            .then(async (response: Response) => {
                this.response = response;
                if (this.response.status === 200) return this.goOnline();
                else return this.goOffline();        
            }).catch(async (error: Error) => {
                this.response = error;
                this.goOffline();
            });
    }

    cancelInterval() {
        this.interval && (clearInterval(this.interval));
    }

    startPing(period: number) {
        if (!period) throw new Error("Cannot start ping without interval time.");
        if (!this.ping) throw new Error("No Ping service set.");
        this.Period = period;
    }

    constructor(private ping: PingService) {
        this.state = StateType.ONLINE;
        this.Observe = <T extends {new(...args: any[]): Observer}>(constructor: T) => {
            var serviceStatus = this;
            return class extends constructor {
                ObserverId = Date.now() * Math.random() * 1000;
                constructor(...args: any[]) {
                    super(...args);
                    serviceStatus.attach(this);
                }
            }
        };
    }
}