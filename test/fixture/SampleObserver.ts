import {Observe} from "../../src/Observer";
@Observe()
export class SampleObserver {
    state: number = 0;
    async updateState() {
        this.state = 999;
        return true;
    }
    constructor() {
    }
}