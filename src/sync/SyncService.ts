// import {StateType} from "./StateType";
//
import {StateType} from "./StateType";
import {Observe} from "../Observer";

export enum SyncStatus {
    NO_DATA,
    DATA
}

@Observe()
export class SyncService {
    private state: number = SyncStatus.NO_DATA;

    get State() {
        return this.state;
    }

    set State(state: number) {
        this.state = state;
    }

//     constructor() {
//
//     }
//
    private onOnline() {
        //TODO: Check if data exists
        //TODO: then sync
        this.sync();
    }

    private onOffline() {
        //TODO: Do nothing
    }

    async updateState(state: StateType): Promise<string> {
        if (state === StateType.ONLINE) {
            //TODO
            this.onOnline();
            return "online";
        }
        if (state === StateType.OFFLINE) {
            //TODO
            this.onOffline();
            return "offline";
        }
        return "";
    }


    async sync() {
       //TODO: Check for data
    }
}