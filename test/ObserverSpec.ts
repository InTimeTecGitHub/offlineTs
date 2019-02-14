import {expect} from "chai";
import {SampleObserver} from "./fixture/SampleObserver";
import {ServiceStatus} from "../src/ServiceStatus";
import {SampleObserverOne} from "./fixture/SamleObserverOne";

describe("@ObserverStatusForOneClass", () => {
    before(() => {
        ServiceStatus.cancelInterval();
    });

    it("should update the annotated class when service status changes", () => {
        let observer = new SampleObserver();
        observer.state = 0;
        let initial = observer.state;

        ServiceStatus.goOnline();
        let result = observer.state;
        ServiceStatus.goOffline();

        expect(result).to.be.equal(999);
    });

    it("should set default value of sample observer as 0", () => {
        let observer = new SampleObserver();
        expect(observer.state).to.be.equal(0);
    });
});

describe("@ObserverStatusForAllClasses", () => {
    before(() => {
        ServiceStatus.cancelInterval();
    });
    it("should update all annotated classes when service status changes - Two observers from same class", () => {
        let observerOne = new SampleObserver();
        observerOne.state = 0;

        let observerTwo = new SampleObserver();
        observerTwo.state = 100;

        let initialStateOne = observerOne.state;
        let initialStateTwo = observerTwo.state;

        ServiceStatus.goOnline();
        let resultObserverOne = observerOne.state;
        let resultObserverTwo = observerTwo.state;
        ServiceStatus.goOffline();

        expect(resultObserverOne).to.be.equal(999);
        expect(resultObserverTwo).to.be.equal(999);
    });

    it("should update all annotated classes when service status changes - observer from a different class", () => {
        let newObserver = new SampleObserverOne();
        newObserver.state = 0;

        let initialState = newObserver.state;

        ServiceStatus.goOnline();
        let resultingState = newObserver.state;
        ServiceStatus.goOffline();

        expect(resultingState).to.be.equal(99);
    });

});