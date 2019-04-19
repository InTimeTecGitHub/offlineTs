import {expect} from "chai";
import * as sinon from "sinon";
import {SinonStub} from "sinon";
import {SyncService, SyncStatus, SyncServiceStatus} from "../src/sync/SyncService";
import {StateType} from "../src/StateType";
import {OfflineDataService} from "../src/sync/OfflineDataService";

describe("@SyncService", async () => {
    let syncService: SyncService, hasData: SinonStub, sync: SinonStub;
    const MAX_SYNC_RETRY: number = 5;
    SyncServiceStatus.cancelInterval();
    beforeEach(async () => {
        syncService = new SyncService(new OfflineDataService(), MAX_SYNC_RETRY);
        hasData = sinon.stub(OfflineDataService.prototype, "hasData");
        sync = sinon.stub(OfflineDataService.prototype, "sync");
    });

    afterEach(async () => {
        hasData.restore();
        sync.restore();
    });

    //TODO: add one test that ensures, updatestate is called when service goOnline/goOffline is called.
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

        it("should sync data and transition to 'NO_DATA' state", async () => {
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

        it("should sync successfully and transition to 'NO_DATA' state after two tries", async () => {
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

        it("should retry sync manually after failing 5 times", async () => {
            stubFakes(true, false);

            await syncService.updateState(StateType.ONLINE);

            expect(syncService.State).to.equal(SyncStatus.DATA);
            sinon.assert.callCount(sync, 5);

            await syncService.retry();
            sinon.assert.callCount(sync, 10);
        });

        it("should retry sync manually 3 times after failing 5 times", async () => {
            stubFakes(true, false);

            await syncService.updateState(StateType.ONLINE);

            expect(syncService.State).to.equal(SyncStatus.DATA);
            sinon.assert.callCount(sync, 5);

            await syncService.retry(3);
            sinon.assert.callCount(sync, 8);
        });

        it("should get a sync status promise which resolves to NO_DATA when sync succeeds", async () => {
            stubFakes(true, true);
            syncService.updateState(StateType.ONLINE);
            let state = await syncService.SyncStatus;
            expect(state).to.eq(SyncStatus.NO_DATA);
        });

        it("should get a sync status promise which resolves to DATA when sync succeeds", async () => {
            stubFakes(true, false);
            syncService.updateState(StateType.ONLINE);
            let state = await syncService.SyncStatus;
            expect(state).to.eq(SyncStatus.DATA);
        });

        it("should reject sync status promise in waiting state.", async () => {
            try {
                await syncService.SyncStatus;
                expect(true).to.eq(false);
            } catch (ex) {
                expect(ex).to.eq(SyncStatus.WAITING);
            }
        });

        it("should reject sync status promise(with data) when sync fails with data.", async () => {
            stubError("Sync Failed.");
            syncService.updateState(StateType.ONLINE);
            try {
                await syncService.SyncStatus;
                expect(true).to.eq(false);
            } catch (ex) {
                expect(ex).to.eq(SyncStatus.DATA);
            }
        })
    });
});