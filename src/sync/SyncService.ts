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
    private isSyncSuccess: boolean;

    // private promise: Promise<boolean>;

    get State(): number {
        return this.state;
    }

    //TODO: Use this in onOnline function
    set State(state: number) {
        this.state = state;
    }

    // get SyncPromise(): Promise<boolean> {
    //     return new Promise(()=>{
    //
    //     });
    //     return this.promise;
    // }
    //
    // set SyncPromise(promise: Promise<boolean>) {
    //     this.promise = promise;
    // }

    constructor(private offlineDataService: OfflineDataService = new OfflineDataService(),
                private maxRetry: number = Infinity) {
        //this.state = SyncStatus.NO_DATA;
    }

    private async onOnline() {
        await this.sync();
    }

    // private onOffline() {
    //     //TODO: Do nothing
    //     return "nothing to do";
    // }

    async updateState(state: StateType) {
        if (state === StateType.ONLINE) {
            await this.onOnline();
        }
        // if (state === StateType.OFFLINE) {
        //     this.onOffline();
        // }
    }

    private async transitionToDataState() {
        let retry: number = 0;
        while (!this.isSyncSuccess) {
            try {
                retry++;
                this.State = SyncStatus.DATA;

                this.isSyncSuccess = await this.offlineDataService.sync();

                if (this.isSyncSuccess) {
                    this.transitionToNoDataState();
                } else if (retry === this.maxRetry) {
                    return;
                }
            } catch (ex) {
                if (retry === this.maxRetry) {
                    throw(new Error(ex));
                }
            }
        }
    }

    private transitionToNoDataState() {
        this.State = SyncStatus.NO_DATA;
    }

    private async sync() {
        let hasData: boolean = await this.offlineDataService.hasData();
        if (!hasData) {
            this.transitionToNoDataState();
            return;
        }
        await this.transitionToDataState();
    }
}