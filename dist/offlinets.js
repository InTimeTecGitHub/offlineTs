(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ServiceStatus_1 = require("./src/ServiceStatus");
exports.StateType = ServiceStatus_1.StateType;
exports.ServiceStatus = ServiceStatus_1.ServiceStatus;
const sync = require("./src/sync/sync");
exports.sync = sync;

},{"./src/ServiceStatus":3,"./src/sync/sync":7}],2:[function(require,module,exports){
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
class DefaultPingService {
    ping() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                fetch(new Request("/favico.ico?_=" + new Date().getTime()), {
                    method: "HEAD",
                    headers: new Headers({
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    }),
                    mode: "cors",
                    cache: "default",
                    credentials: "same-origin"
                })
                    .then(response => {
                    if (response.status === 200)
                        resolve(true);
                    else
                        resolve(false);
                })
                    .catch(error => {
                    resolve(false);
                });
            });
        });
    }
}
exports.defaultPingService = new DefaultPingService();

},{}],3:[function(require,module,exports){
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
    constructor(ping) {
        this.ping = ping;
        this.observers = new Map();
        this.state = StateType.ONLINE;
        this.Observe = (constructor) => {
            var serviceStatus = this;
            return class extends constructor {
                constructor(...args) {
                    super(...args);
                    this.ObserverId = Date.now() * Math.random() * 1000;
                    serviceStatus.attach(this);
                }
            };
        };
    }
    attach(observer) {
        if (observer.ObserverId)
            this.observers.set(observer.ObserverId, observer);
        else
            throw new Error("ObserverId Not Set.");
    }
    set Ping(ping) {
        this.ping = ping;
    }
    set Period(period) {
        this.cancelInterval();
        this.period = period;
        this.interval = setInterval(() => this.callback(), this.period);
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
            if (!this.ping)
                return;
            if (yield this.ping.ping())
                return this.goOnline();
            else
                return this.goOffline();
        });
    }
    cancelInterval() {
        this.interval && (clearInterval(this.interval));
    }
    startPing(period) {
        if (!period)
            throw new Error("Cannot start ping without interval time.");
        if (!this.ping)
            throw new Error("No Ping service set.");
        this.Period = period;
    }
}
exports.ServiceStatus = ServiceStatus;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StateType;
(function (StateType) {
    StateType[StateType["ONLINE"] = 0] = "ONLINE";
    StateType[StateType["OFFLINE"] = 1] = "OFFLINE";
})(StateType = exports.StateType || (exports.StateType = {}));

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class OfflineDataService {
    sync() {
        throw new Error("Not yet Implemented");
    }
    hasData() {
        throw new Error("Not yet Implemented");
    }
}
exports.OfflineDataService = OfflineDataService;

},{}],6:[function(require,module,exports){
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const StateType_1 = require("../StateType");
const OfflineDataService_1 = require("./OfflineDataService");
const ServiceStatus_1 = require("../ServiceStatus");
const PingService_1 = require("../PingService");
var SyncStatus;
(function (SyncStatus) {
    SyncStatus[SyncStatus["WAITING"] = 0] = "WAITING";
    SyncStatus[SyncStatus["NO_DATA"] = 1] = "NO_DATA";
    SyncStatus[SyncStatus["DATA"] = 2] = "DATA";
})(SyncStatus = exports.SyncStatus || (exports.SyncStatus = {}));
var syncServiceStatus = new ServiceStatus_1.ServiceStatus(PingService_1.defaultPingService);
exports.SyncServiceStatus = syncServiceStatus;
let SyncService = class SyncService {
    constructor(offlineDataService = new OfflineDataService_1.OfflineDataService(), maxRetry = Infinity) {
        this.offlineDataService = offlineDataService;
        this.maxRetry = maxRetry;
        this.state = SyncStatus.WAITING;
    }
    get State() {
        return this.state;
    }
    set State(state) {
        this.state = state;
    }
    updateState(networkState) {
        return __awaiter(this, void 0, void 0, function* () {
            if (networkState === StateType_1.StateType.ONLINE) {
                yield this.onOnline();
            }
        });
    }
    onOnline() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.sync();
        });
    }
    sync() {
        return __awaiter(this, void 0, void 0, function* () {
            let hasData = yield this.offlineDataService.hasData();
            if (!hasData) {
                this.transitionToNoDataState();
                return;
            }
            yield this.transitionToDataState();
        });
    }
    transitionToNoDataState() {
        this.State = SyncStatus.NO_DATA;
    }
    transitionToDataState() {
        return __awaiter(this, void 0, void 0, function* () {
            let retry = 0;
            while (!this.isSyncSuccess) {
                try {
                    retry++;
                    this.State = SyncStatus.DATA;
                    this.isSyncSuccess = yield this.offlineDataService.sync();
                    if (this.isSyncSuccess) {
                        this.transitionToNoDataState();
                    }
                    else if (retry === this.maxRetry) {
                        return;
                    }
                }
                catch (ex) {
                    if (retry === this.maxRetry) {
                        throw (new Error(ex));
                    }
                }
            }
        });
    }
};
SyncService = __decorate([
    syncServiceStatus.Observe
], SyncService);
exports.SyncService = SyncService;

},{"../PingService":2,"../ServiceStatus":3,"../StateType":4,"./OfflineDataService":5}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OfflineDataService_1 = require("./OfflineDataService");
exports.OfflineDataService = OfflineDataService_1.OfflineDataService;
var SyncService_1 = require("./SyncService");
exports.SyncService = SyncService_1.SyncService;
exports.SyncServiceStatus = SyncService_1.SyncServiceStatus;
exports.SyncStatus = SyncService_1.SyncStatus;

},{"./OfflineDataService":5,"./SyncService":6}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2luZGV4LmpzIiwiZGlzdC9zcmMvUGluZ1NlcnZpY2UuanMiLCJkaXN0L3NyYy9TZXJ2aWNlU3RhdHVzLmpzIiwiZGlzdC9zcmMvU3RhdGVUeXBlLmpzIiwiZGlzdC9zcmMvc3luYy9PZmZsaW5lRGF0YVNlcnZpY2UuanMiLCJkaXN0L3NyYy9zeW5jL1N5bmNTZXJ2aWNlLmpzIiwiZGlzdC9zcmMvc3luYy9zeW5jLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIFNlcnZpY2VTdGF0dXNfMSA9IHJlcXVpcmUoXCIuL3NyYy9TZXJ2aWNlU3RhdHVzXCIpO1xuZXhwb3J0cy5TdGF0ZVR5cGUgPSBTZXJ2aWNlU3RhdHVzXzEuU3RhdGVUeXBlO1xuZXhwb3J0cy5TZXJ2aWNlU3RhdHVzID0gU2VydmljZVN0YXR1c18xLlNlcnZpY2VTdGF0dXM7XG5jb25zdCBzeW5jID0gcmVxdWlyZShcIi4vc3JjL3N5bmMvc3luY1wiKTtcbmV4cG9ydHMuc3luYyA9IHN5bmM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgRGVmYXVsdFBpbmdTZXJ2aWNlIHtcbiAgICBwaW5nKCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICAgICAgZmV0Y2gobmV3IFJlcXVlc3QoXCIvZmF2aWNvLmljbz9fPVwiICsgbmV3IERhdGUoKS5nZXRUaW1lKCkpLCB7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJIRUFEXCIsXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IG5ldyBIZWFkZXJzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiQWNjZXB0XCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJcbiAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgIG1vZGU6IFwiY29yc1wiLFxuICAgICAgICAgICAgICAgICAgICBjYWNoZTogXCJkZWZhdWx0XCIsXG4gICAgICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiBcInNhbWUtb3JpZ2luXCJcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDIwMClcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdFBpbmdTZXJ2aWNlID0gbmV3IERlZmF1bHRQaW5nU2VydmljZSgpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBTdGF0ZVR5cGU7XG4oZnVuY3Rpb24gKFN0YXRlVHlwZSkge1xuICAgIFN0YXRlVHlwZVtTdGF0ZVR5cGVbXCJPTkxJTkVcIl0gPSAwXSA9IFwiT05MSU5FXCI7XG4gICAgU3RhdGVUeXBlW1N0YXRlVHlwZVtcIk9GRkxJTkVcIl0gPSAxXSA9IFwiT0ZGTElORVwiO1xufSkoU3RhdGVUeXBlID0gZXhwb3J0cy5TdGF0ZVR5cGUgfHwgKGV4cG9ydHMuU3RhdGVUeXBlID0ge30pKTtcbmNsYXNzIFNlcnZpY2VTdGF0dXMge1xuICAgIGNvbnN0cnVjdG9yKHBpbmcpIHtcbiAgICAgICAgdGhpcy5waW5nID0gcGluZztcbiAgICAgICAgdGhpcy5vYnNlcnZlcnMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBTdGF0ZVR5cGUuT05MSU5FO1xuICAgICAgICB0aGlzLk9ic2VydmUgPSAoY29uc3RydWN0b3IpID0+IHtcbiAgICAgICAgICAgIHZhciBzZXJ2aWNlU3RhdHVzID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiBjbGFzcyBleHRlbmRzIGNvbnN0cnVjdG9yIHtcbiAgICAgICAgICAgICAgICBjb25zdHJ1Y3RvciguLi5hcmdzKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1cGVyKC4uLmFyZ3MpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLk9ic2VydmVySWQgPSBEYXRlLm5vdygpICogTWF0aC5yYW5kb20oKSAqIDEwMDA7XG4gICAgICAgICAgICAgICAgICAgIHNlcnZpY2VTdGF0dXMuYXR0YWNoKHRoaXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgIH07XG4gICAgfVxuICAgIGF0dGFjaChvYnNlcnZlcikge1xuICAgICAgICBpZiAob2JzZXJ2ZXIuT2JzZXJ2ZXJJZClcbiAgICAgICAgICAgIHRoaXMub2JzZXJ2ZXJzLnNldChvYnNlcnZlci5PYnNlcnZlcklkLCBvYnNlcnZlcik7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk9ic2VydmVySWQgTm90IFNldC5cIik7XG4gICAgfVxuICAgIHNldCBQaW5nKHBpbmcpIHtcbiAgICAgICAgdGhpcy5waW5nID0gcGluZztcbiAgICB9XG4gICAgc2V0IFBlcmlvZChwZXJpb2QpIHtcbiAgICAgICAgdGhpcy5jYW5jZWxJbnRlcnZhbCgpO1xuICAgICAgICB0aGlzLnBlcmlvZCA9IHBlcmlvZDtcbiAgICAgICAgdGhpcy5pbnRlcnZhbCA9IHNldEludGVydmFsKCgpID0+IHRoaXMuY2FsbGJhY2soKSwgdGhpcy5wZXJpb2QpO1xuICAgIH1cbiAgICBzZXQgU3RhdGUoc3RhdGUpIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICAgICAgICB0aGlzLm5vdGlmeSgpO1xuICAgIH1cbiAgICBnZXQgU3RhdGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRlO1xuICAgIH1cbiAgICBnb09ubGluZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuU3RhdGUgIT09IFN0YXRlVHlwZS5PTkxJTkUpIHtcbiAgICAgICAgICAgIHRoaXMuU3RhdGUgPSBTdGF0ZVR5cGUuT05MSU5FO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBnb09mZmxpbmUoKSB7XG4gICAgICAgIGlmICh0aGlzLlN0YXRlICE9PSBTdGF0ZVR5cGUuT0ZGTElORSkge1xuICAgICAgICAgICAgdGhpcy5TdGF0ZSA9IFN0YXRlVHlwZS5PRkZMSU5FO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBub3RpZnkoKSB7XG4gICAgICAgIHRoaXMub2JzZXJ2ZXJzLmZvckVhY2gob2JzZXJ2ZXIgPT4gb2JzZXJ2ZXIudXBkYXRlU3RhdGUodGhpcy5TdGF0ZSkpO1xuICAgIH1cbiAgICBjYWxsYmFjaygpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGlmICghdGhpcy5waW5nKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGlmICh5aWVsZCB0aGlzLnBpbmcucGluZygpKVxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdvT25saW5lKCk7XG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ29PZmZsaW5lKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBjYW5jZWxJbnRlcnZhbCgpIHtcbiAgICAgICAgdGhpcy5pbnRlcnZhbCAmJiAoY2xlYXJJbnRlcnZhbCh0aGlzLmludGVydmFsKSk7XG4gICAgfVxuICAgIHN0YXJ0UGluZyhwZXJpb2QpIHtcbiAgICAgICAgaWYgKCFwZXJpb2QpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3Qgc3RhcnQgcGluZyB3aXRob3V0IGludGVydmFsIHRpbWUuXCIpO1xuICAgICAgICBpZiAoIXRoaXMucGluZylcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIFBpbmcgc2VydmljZSBzZXQuXCIpO1xuICAgICAgICB0aGlzLlBlcmlvZCA9IHBlcmlvZDtcbiAgICB9XG59XG5leHBvcnRzLlNlcnZpY2VTdGF0dXMgPSBTZXJ2aWNlU3RhdHVzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgU3RhdGVUeXBlO1xuKGZ1bmN0aW9uIChTdGF0ZVR5cGUpIHtcbiAgICBTdGF0ZVR5cGVbU3RhdGVUeXBlW1wiT05MSU5FXCJdID0gMF0gPSBcIk9OTElORVwiO1xuICAgIFN0YXRlVHlwZVtTdGF0ZVR5cGVbXCJPRkZMSU5FXCJdID0gMV0gPSBcIk9GRkxJTkVcIjtcbn0pKFN0YXRlVHlwZSA9IGV4cG9ydHMuU3RhdGVUeXBlIHx8IChleHBvcnRzLlN0YXRlVHlwZSA9IHt9KSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIE9mZmxpbmVEYXRhU2VydmljZSB7XG4gICAgc3luYygpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IHlldCBJbXBsZW1lbnRlZFwiKTtcbiAgICB9XG4gICAgaGFzRGF0YSgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IHlldCBJbXBsZW1lbnRlZFwiKTtcbiAgICB9XG59XG5leHBvcnRzLk9mZmxpbmVEYXRhU2VydmljZSA9IE9mZmxpbmVEYXRhU2VydmljZTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZGVjb3JhdGUgPSAodGhpcyAmJiB0aGlzLl9fZGVjb3JhdGUpIHx8IGZ1bmN0aW9uIChkZWNvcmF0b3JzLCB0YXJnZXQsIGtleSwgZGVzYykge1xuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcbiAgICBlbHNlIGZvciAodmFyIGkgPSBkZWNvcmF0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSBpZiAoZCA9IGRlY29yYXRvcnNbaV0pIHIgPSAoYyA8IDMgPyBkKHIpIDogYyA+IDMgPyBkKHRhcmdldCwga2V5LCByKSA6IGQodGFyZ2V0LCBrZXkpKSB8fCByO1xuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XG59O1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBTdGF0ZVR5cGVfMSA9IHJlcXVpcmUoXCIuLi9TdGF0ZVR5cGVcIik7XG5jb25zdCBPZmZsaW5lRGF0YVNlcnZpY2VfMSA9IHJlcXVpcmUoXCIuL09mZmxpbmVEYXRhU2VydmljZVwiKTtcbmNvbnN0IFNlcnZpY2VTdGF0dXNfMSA9IHJlcXVpcmUoXCIuLi9TZXJ2aWNlU3RhdHVzXCIpO1xuY29uc3QgUGluZ1NlcnZpY2VfMSA9IHJlcXVpcmUoXCIuLi9QaW5nU2VydmljZVwiKTtcbnZhciBTeW5jU3RhdHVzO1xuKGZ1bmN0aW9uIChTeW5jU3RhdHVzKSB7XG4gICAgU3luY1N0YXR1c1tTeW5jU3RhdHVzW1wiV0FJVElOR1wiXSA9IDBdID0gXCJXQUlUSU5HXCI7XG4gICAgU3luY1N0YXR1c1tTeW5jU3RhdHVzW1wiTk9fREFUQVwiXSA9IDFdID0gXCJOT19EQVRBXCI7XG4gICAgU3luY1N0YXR1c1tTeW5jU3RhdHVzW1wiREFUQVwiXSA9IDJdID0gXCJEQVRBXCI7XG59KShTeW5jU3RhdHVzID0gZXhwb3J0cy5TeW5jU3RhdHVzIHx8IChleHBvcnRzLlN5bmNTdGF0dXMgPSB7fSkpO1xudmFyIHN5bmNTZXJ2aWNlU3RhdHVzID0gbmV3IFNlcnZpY2VTdGF0dXNfMS5TZXJ2aWNlU3RhdHVzKFBpbmdTZXJ2aWNlXzEuZGVmYXVsdFBpbmdTZXJ2aWNlKTtcbmV4cG9ydHMuU3luY1NlcnZpY2VTdGF0dXMgPSBzeW5jU2VydmljZVN0YXR1cztcbmxldCBTeW5jU2VydmljZSA9IGNsYXNzIFN5bmNTZXJ2aWNlIHtcbiAgICBjb25zdHJ1Y3RvcihvZmZsaW5lRGF0YVNlcnZpY2UgPSBuZXcgT2ZmbGluZURhdGFTZXJ2aWNlXzEuT2ZmbGluZURhdGFTZXJ2aWNlKCksIG1heFJldHJ5ID0gSW5maW5pdHkpIHtcbiAgICAgICAgdGhpcy5vZmZsaW5lRGF0YVNlcnZpY2UgPSBvZmZsaW5lRGF0YVNlcnZpY2U7XG4gICAgICAgIHRoaXMubWF4UmV0cnkgPSBtYXhSZXRyeTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFN5bmNTdGF0dXMuV0FJVElORztcbiAgICB9XG4gICAgZ2V0IFN0YXRlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5zdGF0ZTtcbiAgICB9XG4gICAgc2V0IFN0YXRlKHN0YXRlKSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICB9XG4gICAgdXBkYXRlU3RhdGUobmV0d29ya1N0YXRlKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBpZiAobmV0d29ya1N0YXRlID09PSBTdGF0ZVR5cGVfMS5TdGF0ZVR5cGUuT05MSU5FKSB7XG4gICAgICAgICAgICAgICAgeWllbGQgdGhpcy5vbk9ubGluZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgb25PbmxpbmUoKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICB5aWVsZCB0aGlzLnN5bmMoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHN5bmMoKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBsZXQgaGFzRGF0YSA9IHlpZWxkIHRoaXMub2ZmbGluZURhdGFTZXJ2aWNlLmhhc0RhdGEoKTtcbiAgICAgICAgICAgIGlmICghaGFzRGF0YSkge1xuICAgICAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvblRvTm9EYXRhU3RhdGUoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB5aWVsZCB0aGlzLnRyYW5zaXRpb25Ub0RhdGFTdGF0ZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgdHJhbnNpdGlvblRvTm9EYXRhU3RhdGUoKSB7XG4gICAgICAgIHRoaXMuU3RhdGUgPSBTeW5jU3RhdHVzLk5PX0RBVEE7XG4gICAgfVxuICAgIHRyYW5zaXRpb25Ub0RhdGFTdGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGxldCByZXRyeSA9IDA7XG4gICAgICAgICAgICB3aGlsZSAoIXRoaXMuaXNTeW5jU3VjY2Vzcykge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHJ5Kys7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuU3RhdGUgPSBTeW5jU3RhdHVzLkRBVEE7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNTeW5jU3VjY2VzcyA9IHlpZWxkIHRoaXMub2ZmbGluZURhdGFTZXJ2aWNlLnN5bmMoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNTeW5jU3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50cmFuc2l0aW9uVG9Ob0RhdGFTdGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHJldHJ5ID09PSB0aGlzLm1heFJldHJ5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXRyeSA9PT0gdGhpcy5tYXhSZXRyeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgKG5ldyBFcnJvcihleCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59O1xuU3luY1NlcnZpY2UgPSBfX2RlY29yYXRlKFtcbiAgICBzeW5jU2VydmljZVN0YXR1cy5PYnNlcnZlXG5dLCBTeW5jU2VydmljZSk7XG5leHBvcnRzLlN5bmNTZXJ2aWNlID0gU3luY1NlcnZpY2U7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBPZmZsaW5lRGF0YVNlcnZpY2VfMSA9IHJlcXVpcmUoXCIuL09mZmxpbmVEYXRhU2VydmljZVwiKTtcbmV4cG9ydHMuT2ZmbGluZURhdGFTZXJ2aWNlID0gT2ZmbGluZURhdGFTZXJ2aWNlXzEuT2ZmbGluZURhdGFTZXJ2aWNlO1xudmFyIFN5bmNTZXJ2aWNlXzEgPSByZXF1aXJlKFwiLi9TeW5jU2VydmljZVwiKTtcbmV4cG9ydHMuU3luY1NlcnZpY2UgPSBTeW5jU2VydmljZV8xLlN5bmNTZXJ2aWNlO1xuZXhwb3J0cy5TeW5jU2VydmljZVN0YXR1cyA9IFN5bmNTZXJ2aWNlXzEuU3luY1NlcnZpY2VTdGF0dXM7XG5leHBvcnRzLlN5bmNTdGF0dXMgPSBTeW5jU2VydmljZV8xLlN5bmNTdGF0dXM7XG4iXX0=
