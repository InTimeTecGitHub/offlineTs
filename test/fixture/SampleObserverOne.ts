import {StateType} from "../../src/ServiceStatus";
import {serviceStatus} from "./SampleObserver";
@serviceStatus.Observe
export class SampleObserverOne {
    state: number = 0;
    async updateState(state: StateType) {
        this.state = 99;
        return true;
    }
    constructor() {
    }
}