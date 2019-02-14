import {expect} from "chai";
import {SampleObserver} from "./fixture/SampleObserver";
import {ServiceStatus} from "../src/ServiceStatus";
import {SampleObserverOne} from "./fixture/SamleObserverOne";

describe("@ObserverStatusForOneClass", () => {
    afterEach(() => ServiceStatus.instance.cancelInterval());

    it("should update the annotated class when service status changes", () => {
        let observer = new SampleObserver();
        let initial = observer.state;

        ServiceStatus.instance.goOnline();
        let result = observer.state;
        ServiceStatus.instance.goOffline();

        expect(initial).to.be.equal(0);
        expect(result).to.be.equal(999);
    });

    it("should set default value of sample observer as 0", () => {
        let observer = new SampleObserver();
        expect(observer.state).to.be.equal(0);
    });
});

describe("@ObserverStatusForAllClasses", () => {
    afterEach(async () => ServiceStatus.instance.cancelInterval());

    it("should update all annotated classes when service status changes - Two observers from same class", () => {
        let observerOne = new SampleObserver();
        let observerTwo = new SampleObserver();
        let initialStateOne = observerOne.state;
        let initialStateTwo = observerTwo.state;

        ServiceStatus.instance.goOnline();
        let resultObserverOne = observerOne.state;
        let resultObserverTwo = observerTwo.state;
        ServiceStatus.instance.goOffline();

        expect(initialStateOne).to.be.equal(0);
        expect(resultObserverOne).to.be.equal(999);
        expect(initialStateTwo).to.be.equal(0);
        expect(resultObserverTwo).to.be.equal(999);
    });

    it("should update all annotated classes when service status changes - observer from a different class", () => {
        let newObserver = new SampleObserverOne();
        let initialState = newObserver.state;

        ServiceStatus.instance.goOnline();
        let resultingState= newObserver.state;
        ServiceStatus.instance.goOffline();

        expect(initialState).to.be.equal(0);
        expect(resultingState).to.be.equal(99);
    });

});