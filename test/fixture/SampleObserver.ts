import {StateType, ServiceStatus} from "../../src/ServiceStatus";
class PService {
    async ping() {
        return true;
    }
}
export var serviceStatus = new ServiceStatus(new PService());
@serviceStatus.Observe
export class SampleObserver {
    state: number = 0;
    async updateState(state: StateType) {
        this.state = 999;
        return true;
    }
    constructor() {
    }
}