import {Observe} from "../../src/Observer";
import {StateType} from "../../src/ServiceStatus";
class PService {
    async ping() {
        return true;
    }
}
@Observe({
    period: 1000,
    pingService: new PService()
})
export class SampleObserver {
    state: number = 0;
    async updateState(state: StateType) {
        this.state = 999;
        return true;
    }
    constructor() {
    }
}