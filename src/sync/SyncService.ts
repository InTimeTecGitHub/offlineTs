import {StateType} from "./StateType";
import {Observe} from "../Observer";
import {OfflineDataService} from "./OfflineDataService";

export enum SyncStatus {
    NO_DATA,
    DATA
}

@Observe()
export class SyncService {
    private state: number;

    get State() {
        return this.state;
    }

    //TODO: Use this in onOnline function
    set State(state: number) {
        this.state = state;
    }

    constructor(private offlineDataService: OfflineDataService = new OfflineDataService()) {
        this.state = SyncStatus.NO_DATA;
    }

    private onOnline() {
        this.sync();
    }

    private onOffline() {
        //TODO: Do nothing
        return "nothing to do";
    }

    async updateState(state: StateType) {
        if (state === StateType.ONLINE) {
            this.onOnline();
        }
        if (state === StateType.OFFLINE) {
            this.onOffline();
        }
    }

    private async sync() {
        //TODO: Call sync API of OfflineDataService
        //TODO: Plan error handling
    }
}