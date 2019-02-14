import {expect} from "chai";
import {SampleObserver} from "./fixture/SampleObserver";
import {ServiceStatus, StateType} from "../src/ServiceStatus";
import {SampleObserverOne} from "./fixture/SamleObserverOne";

describe("@Observer", () => {
    before(() => {
        ServiceStatus.cancelInterval();
    });

    it("should set the initial value of ServiceStatus as online", () => {
        expect(ServiceStatus.Instance.State).to.eq(StateType.ONLINE);
    });

    it("should set default value of sample observer as 0", () => {
        let observer = new SampleObserver();
        expect(observer.state).to.be.equal(0);
    });


    it("should update the annotated class when service status changes", () => {
        let observer = new SampleObserver();
        observer.state = 0;

        ServiceStatus.goOffline();

        expect(observer.state).to.be.equal(999);
    });

    it("should update all annotated classes when service status changes - Two observers from same class", () => {
        let observerOne = new SampleObserver();
        observerOne.state = 0;

        let observerTwo = new SampleObserver();
        observerTwo.state = 100;

        ServiceStatus.goOnline();
        ServiceStatus.goOffline();

        expect(observerOne.state).to.be.equal(999);
        expect(observerTwo.state).to.be.equal(999);
    });

    it("should update all annotated classes when service status changes - observer from a different class", () => {
        let newObserver = new SampleObserverOne();
        newObserver.state = 0;

        ServiceStatus.goOnline();
        ServiceStatus.goOffline();

        expect(newObserver.state).to.be.equal(99);
    });

});