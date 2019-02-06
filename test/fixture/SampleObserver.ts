import {Observe} from "../../src/Observer";
import {StateType} from "../../src/ServiceStatus";
@Observe()
export class SampleObserver {
    state: number = 0;
    async updateState(state: StateType) {
        this.state = 999;
        return true;
    }
    constructor() {
    }
}