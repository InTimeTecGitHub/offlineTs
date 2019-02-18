import {expect} from "chai";
import {SampleObserver, serviceStatus} from "./fixture/SampleObserver";
import {StateType} from "../src/ServiceStatus";
import {SampleObserverOne} from "./fixture/SampleObserverOne";
describe("@Observer", () => {
    before(() => {
        serviceStatus.cancelInterval();
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
        let newObserver = new SampleObserverOne();
        newObserver.state = 0;

        serviceStatus.goOnline();
        serviceStatus.goOffline();

        expect(newObserver.state).to.be.equal(99);
    });

    //TODO: add tests for related scenarios.
    it("should accept user defined pingservice. ", () => {
        //create in instance of an observer.
        //set ping service as a dummy and period=50.
        //verify updateState has been called once.
        //verify ping service has been called.
        //cancelinterval.
        throw new Error("To be implemented.");
    });

});