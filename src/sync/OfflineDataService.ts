import {SyncReport} from "./SyncReport";

export class OfflineDataService {
    sync(): Promise<SyncReport> {
        throw new Error("not imlepemented");
    }

    hasData(): Promise<boolean> {
        throw new Error("not imlepemented");
    }

    getOfflineData(): Promise<any> {
        throw new Error("not imlepemented");
    }
}