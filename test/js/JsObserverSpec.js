var chai = require("chai");
var TestObserver, serviceStatus = require("../fixture/TestObserver");
var StateType = require("../../src/ServiceStatus");
var TestObserverOne = require( "./fixture/TestObserverOne");
var PingService= require( "../../src/PingService");
var SinonStub = require("sinon");
var PService = require( "../fixture/TestObserver");

describe("Observer", ()=>{
    before(() => {
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
        expect(observer.state).to.be.equal(1);
    });
    it("should update all annotated classes when service status changes - Two observers from same class", () => {
        var observerOne = new TestObserver();
        observerOne.state = 0;
        var observerTwo = new TestObserver();
        observerTwo.state = 2;
        expect(observerOne.state).to.be.equal(1);
        expect(observerTwo.state).to.be.equal(1);
    });
    it("should update all annotated classes when service status changes - observer from a different class", () => {
        var newObserver = new TestObserverOne();
        newObserver.state = 0;
        serviceStatus.goOnline();
        serviceStatus.goOffline();
        expect(newObserver.state).to.be.equal(1);
    });
    describe("Ping", async () => {

        var observer;
        var pingService, ping;

        before(async () => {
            //create in instance of an observer.
            observer = new TestObserver();

            //setting ping service as a dummy.
            pingService = new PService();
            ping = sinon.stub(PService.prototype, "ping");
        });

       /* describe("@verifying ping service", async () => {

            it("should accept user defined pingservice", async () => {

            });
        });*/
    });

});