import {Observe} from "../../src/Observer";
import {StateType} from "../../src/ServiceStatus";

class TestPingService {
    async ping() {
        return true;
    }
}
export var testPingService = new TestPingService();
@Observe({
    period: 1000,
    pingService: testPingService
})
export class SampleObserverTwo {
    state: number = 0;
    async updateState(state: StateType) {
        this.state = 999;
        return true;
    }
    constructor() {
    }
}