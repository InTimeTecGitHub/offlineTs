import {StateType} from "../StateType";
import {OfflineDataService} from "./OfflineDataService";
import {ServiceStatus} from "../ServiceStatus";
import {defaultPingService} from "../PingService";

export enum SyncStatus {
    WAITING,
    NO_DATA,
    DATA
}

var syncServiceStatus = new ServiceStatus(defaultPingService, new Response(null, { "status" : 200 }));
var maintenanceServiceStatus = new ServiceStatus(defaultPingService, new Response(null, {   headers: new Headers({
        "deploymentstarted": "application/json",
        "servermaintenance": "application/json"
    })}));

@syncServiceStatus.Observe
export class SyncService {
    private state: number = SyncStatus.WAITING;
    private syncStatus: Promise<void>;
    constructor(private offlineDataService: OfflineDataService = new OfflineDataService(),
        private maxRetry: number = Infinity) {
    }

    get State(): number {
        return this.state;
    }

    set State(state: number) {
        this.state = state;
    }

    get SyncStatus(): Promise<SyncStatus> {
        return new Promise((resolve, reject) => {
            if (!this.syncStatus) reject(this.state);
            this.syncStatus
                .then(() => resolve(this.state))
                .catch(() => reject(this.state));
        });
    }

    async updateState(networkState: StateType) {
        if (networkState === StateType.ONLINE) {
            await this.onOnline();
        }
    }

    async retry(maxRetry?: number) {
        if (maxRetry) this.maxRetry = maxRetry;
        await this.onOnline();
    }

    private async onOnline() {
        this.syncStatus = this.sync();
        await this.syncStatus;
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
        let isSyncSuccess: boolean = false;
        while (!isSyncSuccess) {
            try {
                retry++;
                this.State = SyncStatus.DATA;

                isSyncSuccess = await this.offlineDataService.sync();

                if (isSyncSuccess) {
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

export {syncServiceStatus as SyncServiceStatus};
export {maintenanceServiceStatus as MaintenanceServiceStatus}