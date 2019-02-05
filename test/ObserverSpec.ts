import {expect} from "chai";
import {SampleObserver} from "./fixture/SampleObserver";
import {ServiceStatus} from "../src/ServiceStatus";
describe("@Observer", () => {
    it("should update state of observer when state of subject changes", () => {
        let observer = new SampleObserver();
        let initial = observer.state;

        ServiceStatus.instance.goOnline();
        let result = observer.state;
        ServiceStatus.instance.goOffline();

        expect(initial).to.be.equal(0);
        expect(result).to.be.equal(999);

        ServiceStatus.instance.cancelInterval();
    });

    it("should set default value of sample observer as 0", () => {
        let observer = new SampleObserver();
        expect(observer.state).to.be.equal(0);
        ServiceStatus.instance.cancelInterval();
    });
});