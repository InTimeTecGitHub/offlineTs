import { StateType } from "../StateType";
import { OfflineDataService } from "./OfflineDataService";
import { ServiceStatus } from "../ServiceStatus";
export declare enum SyncStatus {
    WAITING = 0,
    NO_DATA = 1,
    DATA = 2
}
declare var syncServiceStatus: ServiceStatus;
export declare class SyncService {
    private offlineDataService;
    private maxRetry;
    private state;
    constructor(offlineDataService?: OfflineDataService, maxRetry?: number);
    State: number;
    updateState(networkState: StateType): Promise<void>;
    private onOnline;
    private sync;
    private transitionToNoDataState;
    private transitionToDataState;
}
export { syncServiceStatus as SyncServiceStatus };
