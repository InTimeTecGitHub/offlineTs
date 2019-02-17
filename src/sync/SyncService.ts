import {StateType} from "../StateType";
import {OfflineDataService} from "./OfflineDataService";
import {ServiceStatus} from "../ServiceStatus";
import {defaultPingService} from "../PingService";

export enum SyncStatus {
    WAITING,
    NO_DATA,
    DATA
}

var sss = new ServiceStatus(defaultPingService);
sss.Observe();

export class SyncService {
    private state: number = SyncStatus.WAITING;
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

    async updateState(networkState: StateType) {
        if (networkState === StateType.ONLINE) {
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
                    throw (new Error(ex));
                }
            }
        }
    }

}
export {sss as SyncServiceStatus};