var chai = require('chai'),
    expect = chai.expect,
    TestObserver = require("../fixture/TestObserver").TestObserver,
    PService = require("../fixture/TestObserver").PService,
    serviceStatus = require("../fixture/TestObserver").serviceStatus,
    TestObserverOne = require( "../fixture/TestObserverOne").TestObserverOne,
    StateType = require("../../dist/src/ServiceStatus").StateType,
    SinonStub = require("sinon"),
    sinon = require("sinon");


describe("Observer", ()=>{

    before(() => {

        //serviceStatus = new ServiceStatus(PingService);
        serviceStatus.cancelInterval();
    });

    it("should set value of the ServiceStatus as Online initially", () => {
        expect(serviceStatus.State).to.be.equal(StateType.ONLINE);
    });

    it("should set default value of sample observer as 0", () => {
        var observer = new TestObserver();

        expect(observer.state).to.be.equal(0);
    });

    it("should update the annotated class when service status changes", () => {
        var observer = new TestObserver();
        observer.state = 0;
        serviceStatus.goOffline();
        expect(observer.state).to.be.equal(999);
    });
    it("should update all annotated classes when service status changes - Two observers from same class", () => {
        var observerOne = new TestObserver();
        observerOne.state = 0;
        var observerTwo = new TestObserver();
        observerTwo.state = 100;
        //serviceStatus.goOnline();
        serviceStatus.goOffline();

        expect(observerOne.state).to.be.equal(999);
        expect(observerTwo.state).to.be.equal(999);
    });
    it("should update all annotated classes when service status changes - observer from a different class", () => {
        var newObserver = new TestObserverOne();
        newObserver.state = 0;

        //serviceStatus.goOnline();
        serviceStatus.goOffline();

        expect(newObserver.state).to.be.equal(999);
    });
    describe("Ping", async () => {

        var observer, pingService, ping;

        before(async () => {

            //create in instance of an observer.
            observer = new TestObserver();

            //setting ping service as a dummy.
            pingService = new PService();
            ping = sinon.stub(PService.prototype, "ping");
        });

        describe("@verifying ping service", async () => {

            var stubPingService = (hasPingService) => {
                ping.returns(new Promise((resolve => resolve(hasPingService))));
            };

            it("should accept user defined pingservice", async () => {
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