import {StateType} from "./ServiceStatus";

export interface Observer {
    updateState: (state: StateType) => Promise<any>;
    ObserverId?: number;
}