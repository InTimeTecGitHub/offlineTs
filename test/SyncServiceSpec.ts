import {expect} from "chai";
import * as sinon from "sinon"
import {SyncService, SyncStatus} from "../src/sync/SyncService";
import {StateType} from "../src/sync/StateType";
import {OfflineDataService} from "../src/sync/OfflineDataService";

describe.only("@SyncService", async () => {
    let syncService: SyncService;

    beforeEach(async () => {
        syncService = new SyncService();
        sinon.stub(OfflineDataService);
    });

    afterEach(async () => {
        clearInterval(1000);
    });

    describe("State getter and setter", async () => {
        it("should have state with no data initially", () => {
            expect(syncService.State).to.equal(SyncStatus.NO_DATA);
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
        it("should go offline when state changes", async () => {
            let changedState = await syncService.updateState(StateType.OFFLINE);
            expect(changedState).to.equal("offline");
        });

        it("should go online when state changes", async () => {
            let changedState = await syncService.updateState(StateType.ONLINE);
            expect(changedState).to.equal("online");
        });
    });


});