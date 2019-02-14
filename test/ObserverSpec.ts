import {expect} from "chai";
import {SampleObserver} from "./fixture/SampleObserver";
import {ServiceStatus} from "../src/ServiceStatus";
import {SampleObserverOne} from "./fixture/SamleObserverOne";

describe("@Observer", () => {
    before(()=>ServiceStatus.instance.cancelInterval());
    it("should update the annotated class when service status changes", () => {
        let observer = new SampleObserver();
        let initial = observer.state;

        ServiceStatus.instance.goOnline();
        let result = observer.state;

        // ServiceStatus.instance.goOffline();

        expect(initial).to.be.equal(0);
        expect(result).to.be.equal(999);

        ServiceStatus.instance.cancelInterval();
    });

   /* it("should set default value of sample observer as 0", () => {
        let observer = new SampleObserver();
        expect(observer.state).to.be.equal(0);
        ServiceStatus.instance.cancelInterval();
    });*/

    it.only("it should update all annotated classes when service status changes", () => {
        /*let observerOne = new SampleObserver();
        let observerTwo = new SampleObserver();
        let initialStateOne = observerOne.state;
        let initialStateTwo = observerTwo.state;

        ServiceStatus.instance.goOnline();
        let resultObserverOne = observerOne.state;
        let resultObserverTwo = observerTwo.state;
        // ServiceStatus.instance.goOffline();

        expect(initialStateOne).to.be.equal(0);
        expect(resultObserverOne).to.be.equal(999);
        expect(initialStateTwo).to.be.equal(0);
        expect(resultObserverTwo).to.be.equal(999);

        ServiceStatus.instance.cancelInterval();*/
        let observer = new SampleObserverOne();
        let initial = observer.state;

        ServiceStatus.instance.goOnline();
        let result = observer.state;

        expect(initial).to.be.equal(0);
        expect(result).to.be.equal(99);

        ServiceStatus.instance.cancelInterval();
    });

});