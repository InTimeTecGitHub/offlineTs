import {expect} from "chai";
import {SampleObserver, serviceStatus, PService} from "./fixture/SampleObserver";
import {StateType} from "../src/ServiceStatus";
import {SampleObserverOne} from "./fixture/SampleObserverOne";
import {SyncService, SyncServiceStatus} from "../src/sync/SyncService";
import * as sinon from "sinon";
import {PingService} from "../src/PingService";
import {SinonStub} from "sinon";

describe("@Observer", () => {
    let updateState: SinonStub;
    before(() => {
        serviceStatus.cancelInterval();
    });

    beforeEach(() => {
        updateState = sinon.stub(SyncService.prototype, "updateState");
    });

    afterEach(() => {
        updateState.restore();
    });

    it("should set the initial value of ServiceStatus as online", () => {
        expect(serviceStatus.State).to.eq(StateType.ONLINE);
    });

    it("should set default value of sample observer as 0", () => {
        let observer = new SampleObserver();
        expect(observer.state).to.be.equal(0);
    });


    it("should update the annotated class when service status changes", () => {
        let observer = new SampleObserver();
        observer.state = 0;

        serviceStatus.goOffline();

        expect(observer.state).to.be.equal(999);
    });

    it("should call updateState function of syncService observer whenever state changes", () => {
        let observer = new SyncService();

        SyncServiceStatus.goOffline();
        sinon.assert.calledWith(updateState, StateType.OFFLINE);
        SyncServiceStatus.goOnline();
        sinon.assert.calledWith(updateState, StateType.ONLINE);
    });

    it("should update all annotated classes when service status changes - Two observers from same class", () => {
        let observerOne = new SampleObserver();
        observerOne.state = 0;

        let observerTwo = new SampleObserver();
        observerTwo.state = 100;

        serviceStatus.goOnline();
        serviceStatus.goOffline();

        expect(observerOne.state).to.be.equal(999);
        expect(observerTwo.state).to.be.equal(999);
    });

    it("should update all annotated classes when service status changes - observer from a different class", () => {
        let observerOne = new SampleObserver();
        observerOne.state = 0;
        let newObserver = new SampleObserverOne();
        newObserver.state = 0;

        serviceStatus.goOnline();
        serviceStatus.goOffline();

        expect(newObserver.state).to.be.equal(99);
        expect(observerOne.state).to.be.equal(999);
    });

    describe("@Ping", async () => {

        let observer: any;
        let pingService: PingService, ping: SinonStub;

        before(async () => {
            //create in instance of an observer.
            observer = new SampleObserver();

            //setting ping service as a dummy.
            pingService = new PService();
            ping = sinon.stub(PService.prototype, "ping");
        });

        describe("@verifying ping service and ping interval", async () => {

            var stubPingService = (hasPingService: boolean) => {
                ping.returns(new Promise((resolve => resolve(hasPingService))));
            };

            it("should accept user defined pingservice - verify PingService ", async () => {
                observer.state = 0;
                stubPingService(true);
                serviceStatus.startPing(1);
                await new Promise(resolve => {
                    setTimeout(resolve, 10);
                });
                //verify ping service has been called.
                sinon.assert.called(ping);
                //verify status was updated.
                expect(observer.state).to.eq(999);
                serviceStatus.cancelInterval();
            });
        });
    });
});