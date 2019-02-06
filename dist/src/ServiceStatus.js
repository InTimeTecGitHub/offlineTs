"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
var StateType;
(function (StateType) {
    StateType[StateType["ONLINE"] = 0] = "ONLINE";
    StateType[StateType["OFFLINE"] = 1] = "OFFLINE";
})(StateType = exports.StateType || (exports.StateType = {}));
class ServiceStatus {
    constructor(period = 1000) {
        this.period = period;
        this.observers = new Map();
        this.interval = setInterval(this.callback, this.period);
    }
    attach(observer) {
        if (observer.ObserverId)
            this.observers.set(observer.ObserverId, observer);
        else
            throw new Error("ObserverId Not Set.");
    }
    set State(state) {
        this.state = state;
        this.notify();
    }
    get State() {
        return this.state;
    }
    goOnline() {
        if (this.State !== StateType.ONLINE) {
            this.State = StateType.ONLINE;
        }
        return this;
    }
    goOffline() {
        if (this.State !== StateType.OFFLINE) {
            this.State = StateType.OFFLINE;
        }
        return this;
    }
    notify() {
        this.observers.forEach(observer => observer.updateState(this.State));
    }
    callback() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!ServiceStatus.ping)
                return;
            if (yield ServiceStatus.ping.ping())
                return this.goOnline();
            else
                return this.goOffline();
        });
    }
    cancelInterval() {
        clearInterval(this.interval);
    }
}
exports.ServiceStatus = ServiceStatus;
//# sourceMappingURL=ServiceStatus.js.map