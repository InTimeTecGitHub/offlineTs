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

    constructor(private offlineDataService: OfflineDataService = new OfflineDataService(),
                private maxRetry: number = Infinity) {
    }

    get State(): number {
        return this.state;
    }

    set State(state: number) {
        this.state = state;
    }

    async updateState(state: StateType) {
        if (state === StateType.ONLINE) {
            await this.onOnline();
        }
    }

    private async onOnline() {
        await this.sync();
    }

    private async sync() {
        let hasData: boolean = await this.offlineDataService.hasData();
        if (!hasData) {
            this.transitionToNoDataState();
            return;
        }
        await this.transitionToDataState();
    }

    private transitionToNoDataState() {
        this.State = SyncStatus.NO_DATA;
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

}