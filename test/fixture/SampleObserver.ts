import {StateType, ServiceStatus} from "../../src/ServiceStatus";

export class PService {
    async ping() {
        return new Response();
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