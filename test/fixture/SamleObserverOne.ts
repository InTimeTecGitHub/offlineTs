import {Observe} from "../../src/Observer";
import {StateType} from "../../src/ServiceStatus";
class PService {
    async ping() {
        return true;
    }
}
@Observe({
    period: 100,
    pingService: new PService()
})
export class SampleObserverOne {
    state: number = 0;
    async updateState(state: StateType) {
        this.state = 99;
        return true;
    }
    constructor() {
    }
}