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

    describe("UpdateState", async () => {
        var stubFakes = (hasDataReturnValue: boolean, syncServiceReturnValue: boolean) => {
            hasData.returns(new Promise((resolve) => resolve(hasDataReturnValue)));
            sync.returns(new Promise((resolve) => resolve(syncServiceReturnValue)));
        };

        var stubError = (errorMsg: string) => {
            hasData.returns(new Promise((resolve) => resolve(true)));
            sync.throws(errorMsg);
        };

        var stubResolveAfterTwoTry = (errorMsg: string) => {
            hasData.returns(new Promise((resolve) => resolve(true)));
            sync.onFirstCall().throws(errorMsg)
                .onSecondCall().returns(new Promise((resolve) => resolve(true)));
        };

        var stubConsecutiveCalls = (hasDataReturnValue: boolean) => {
            hasData.returns(new Promise((resolve) => resolve(hasDataReturnValue)));
            sync.onFirstCall().returns(new Promise(() => {
            }))
                .onSecondCall().returns(new Promise((resolve) => resolve(true)));
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

        it("should retry syncing once and fail", async () => {
            syncService = new SyncService(new OfflineDataService(), 1);
            try {
                stubError("Sync Failed");
                await syncService.updateState(StateType.ONLINE);
                expect(true).to.be.false;
            } catch (e) {
                expect(syncService.State).to.equal(SyncStatus.DATA);
                sinon.assert.callCount(sync, 1);
                expect(e.message).to.equal("Sync Failed");
            }
        });

        it("should transition to 'NO_DATA' state after trying sync twice successfully", async () => {
            try {
                stubResolveAfterTwoTry("Sync Failed");
                await syncService.updateState(StateType.ONLINE);
                expect(true).to.be.false;
            } catch (e) {
                expect(syncService.State).to.equal(SyncStatus.NO_DATA);
                sinon.assert.callCount(sync, 2);
            }
        });


        it("should stay in 'DATA' state after trying 5 times when sync fails", async () => {
            stubFakes(true, false);

            await syncService.updateState(StateType.ONLINE);

            expect(syncService.State).to.equal(SyncStatus.DATA);
            sinon.assert.callCount(sync, 5);
        });


        it("should sync successfully even after network interruption", async () => {
            stubConsecutiveCalls(true);

            syncService.updateState(StateType.ONLINE);
            expect(syncService.State).to.equal(SyncStatus.WAITING);

            await syncService.updateState(StateType.OFFLINE);
            expect(syncService.State).to.equal(SyncStatus.DATA);

            await syncService.updateState(StateType.ONLINE);
            expect(syncService.State).to.equal(SyncStatus.NO_DATA);
        });
    });
});