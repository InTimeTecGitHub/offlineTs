import {StateType} from "./ServiceStatus";

export interface Observer {
    updateState: (state: StateType, response?: Response | Error) => Promise<any>;
    ObserverId?: number;
}