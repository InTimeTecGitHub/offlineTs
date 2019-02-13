import {expect} from "chai";
import * as sinon from "sinon";
import {SinonStub} from "sinon";
import {SyncService, SyncStatus} from "../src/sync/SyncService";
import {StateType} from "../src/sync/StateType";
import {OfflineDataService} from "../src/sync/OfflineDataService";

describe("@SyncService", async () => {
    let syncService: SyncService, hasData: SinonStub, sync: SinonStub;
    const MAX_SYNC_RETRY: number = 5;

    beforeEach(async () => {
        syncService = new SyncService(new OfflineDataService(), MAX_SYNC_RETRY);
        hasData = sinon.stub(OfflineDataService.prototype, "hasData");
        sync = sinon.stub(OfflineDataService.prototype, "sync");
    });

    afterEach(async () => {
        hasData.restore();
        sync.restore();
    });

    describe("State initialization", async () => {
        it("should have undefined state", () => {
            expect(syncService.State).to.be.undefined;
        });

        it("should set state to have data", async () => {
            syncService.State = SyncStatus.DATA;
            expect(syncService.State).to.equal(SyncStatus.DATA);
        });

        it("should set state to have no data", async () => {
            syncService.State = SyncStatus.NO_DATA;
            expect(syncService.State).to.equal(SyncStatus.NO_DATA);
        });
    });

    describe("UpdateState", async () => {
        var stubFakes = (hasDataReturnValue: boolean, syncServiceReturnValue: boolean) => {
            hasData.returns(new Promise((resolve) => resolve(hasDataReturnValue)));
            sync.returns(new Promise((resolve) => resolve(syncServiceReturnValue)));
        };

        var stubError = (errorMsg: string) => {
            hasData.returns(new Promise((resolve) => resolve(true)));
            sync.throws(errorMsg);
        };

        it("should transition to 'NO_DATA' state when there is no data to sync", async () => {
            stubFakes(false, false);

            await syncService.updateState(StateType.ONLINE);
            expect(syncService.State).to.equal(SyncStatus.NO_DATA);
        });

        it("should sync data and transition to NO_DATA state", async () => {
            stubFakes(true, true);

            await syncService.updateState(StateType.ONLINE);
            expect(syncService.State).to.equal(SyncStatus.NO_DATA);
        });

        it("should retry syncing 5 times when sync throws an exception", async () => {
            try {
                stubError("Sync Failed");
                await syncService.updateState(StateType.ONLINE);
                expect(true).to.be.false;
            } catch (e) {
                expect(syncService.State).to.equal(SyncStatus.DATA);
                sinon.assert.callCount(sync, 5);
                expect(e.message).to.equal("Sync Failed");
            }
        });

        it("should retry syncing 5 times when sync fails", async () => {
            stubFakes(true, false);

            await syncService.updateState(StateType.ONLINE);

            expect(syncService.State).to.equal(SyncStatus.DATA);
            sinon.assert.callCount(sync, 5);
        });
    });
});