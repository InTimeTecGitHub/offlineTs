(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ServiceStatus_1 = require("./src/ServiceStatus");
exports.StateType = ServiceStatus_1.StateType;
var Observer_1 = require("./src/Observer");
exports.Observe = Observer_1.Observe;
var SyncService_1 = require("./src/sync/SyncService");
exports.SyncService = SyncService_1.SyncService;

},{"./src/Observer":2,"./src/ServiceStatus":4,"./src/sync/SyncService":7}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceStatus_1 = require("./ServiceStatus");
const PingService_1 = require("./PingService");
function Observe(oc = {
    pingService: PingService_1.defaultPingService
}) {
    if (oc.pingService)
        ServiceStatus_1.ServiceStatus.Ping = oc.pingService;
    if (!ServiceStatus_1.ServiceStatus.Instance)
        ServiceStatus_1.ServiceStatus.Instance = new ServiceStatus_1.ServiceStatus(oc.period);
    return function (constructor) {
        return class extends constructor {
            constructor(...args) {
                super(...args);
                this.ObserverId = Date.now() * Math.random() * 1000;
                ServiceStatus_1.ServiceStatus.Instance.attach(this);
            }
        };
    };
}
exports.Observe = Observe;

},{"./PingService":3,"./ServiceStatus":4}],3:[function(require,module,exports){
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
                    method: "GET",
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

},{}],4:[function(require,module,exports){
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
        this.state = StateType.ONLINE;
        this.interval = setInterval(() => this.callback(), this.period);
    }
    static get Instance() {
        return this.instance;
    }
    static set Instance(serviceStatus) {
        this.instance = serviceStatus;
    }
    attach(observer) {
        if (observer.ObserverId)
            this.observers.set(observer.ObserverId, observer);
        else
            throw new Error("ObserverId Not Set.");
    }
    static set Ping(ping) {
        ServiceStatus.ping = ping;
    }
    set State(state) {
        this.state = state;
        this.notify();
    }
    get State() {
        return this.state;
    }
    static goOnline() {
        if (ServiceStatus.instance.State !== StateType.ONLINE) {
            ServiceStatus.instance.State = StateType.ONLINE;
        }
        return this;
    }
    static goOffline() {
        if (ServiceStatus.instance.State !== StateType.OFFLINE) {
            ServiceStatus.instance.State = StateType.OFFLINE;
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
                return ServiceStatus.goOnline();
            else
                return ServiceStatus.goOffline();
        });
    }
    static cancelInterval() {
        clearInterval(ServiceStatus.instance.interval);
    }
}
exports.ServiceStatus = ServiceStatus;

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
Object.defineProperty(exports, "__esModule", { value: true });
var StateType;
(function (StateType) {
    StateType[StateType["ONLINE"] = 0] = "ONLINE";
    StateType[StateType["OFFLINE"] = 1] = "OFFLINE";
})(StateType = exports.StateType || (exports.StateType = {}));

},{}],7:[function(require,module,exports){
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
const StateType_1 = require("./StateType");
const Observer_1 = require("../Observer");
const OfflineDataService_1 = require("./OfflineDataService");
var SyncStatus;
(function (SyncStatus) {
    SyncStatus[SyncStatus["WAITING"] = 0] = "WAITING";
    SyncStatus[SyncStatus["NO_DATA"] = 1] = "NO_DATA";
    SyncStatus[SyncStatus["DATA"] = 2] = "DATA";
})(SyncStatus = exports.SyncStatus || (exports.SyncStatus = {}));
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
    Observer_1.Observe()
], SyncService);
exports.SyncService = SyncService;

},{"../Observer":2,"./OfflineDataService":5,"./StateType":6}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2luZGV4LmpzIiwiZGlzdC9zcmMvT2JzZXJ2ZXIuanMiLCJkaXN0L3NyYy9QaW5nU2VydmljZS5qcyIsImRpc3Qvc3JjL1NlcnZpY2VTdGF0dXMuanMiLCJkaXN0L3NyYy9zeW5jL09mZmxpbmVEYXRhU2VydmljZS5qcyIsImRpc3Qvc3JjL3N5bmMvU3RhdGVUeXBlLmpzIiwiZGlzdC9zcmMvc3luYy9TeW5jU2VydmljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBTZXJ2aWNlU3RhdHVzXzEgPSByZXF1aXJlKFwiLi9zcmMvU2VydmljZVN0YXR1c1wiKTtcbmV4cG9ydHMuU3RhdGVUeXBlID0gU2VydmljZVN0YXR1c18xLlN0YXRlVHlwZTtcbnZhciBPYnNlcnZlcl8xID0gcmVxdWlyZShcIi4vc3JjL09ic2VydmVyXCIpO1xuZXhwb3J0cy5PYnNlcnZlID0gT2JzZXJ2ZXJfMS5PYnNlcnZlO1xudmFyIFN5bmNTZXJ2aWNlXzEgPSByZXF1aXJlKFwiLi9zcmMvc3luYy9TeW5jU2VydmljZVwiKTtcbmV4cG9ydHMuU3luY1NlcnZpY2UgPSBTeW5jU2VydmljZV8xLlN5bmNTZXJ2aWNlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBTZXJ2aWNlU3RhdHVzXzEgPSByZXF1aXJlKFwiLi9TZXJ2aWNlU3RhdHVzXCIpO1xuY29uc3QgUGluZ1NlcnZpY2VfMSA9IHJlcXVpcmUoXCIuL1BpbmdTZXJ2aWNlXCIpO1xuZnVuY3Rpb24gT2JzZXJ2ZShvYyA9IHtcbiAgICBwaW5nU2VydmljZTogUGluZ1NlcnZpY2VfMS5kZWZhdWx0UGluZ1NlcnZpY2Vcbn0pIHtcbiAgICBpZiAob2MucGluZ1NlcnZpY2UpXG4gICAgICAgIFNlcnZpY2VTdGF0dXNfMS5TZXJ2aWNlU3RhdHVzLlBpbmcgPSBvYy5waW5nU2VydmljZTtcbiAgICBpZiAoIVNlcnZpY2VTdGF0dXNfMS5TZXJ2aWNlU3RhdHVzLkluc3RhbmNlKVxuICAgICAgICBTZXJ2aWNlU3RhdHVzXzEuU2VydmljZVN0YXR1cy5JbnN0YW5jZSA9IG5ldyBTZXJ2aWNlU3RhdHVzXzEuU2VydmljZVN0YXR1cyhvYy5wZXJpb2QpO1xuICAgIHJldHVybiBmdW5jdGlvbiAoY29uc3RydWN0b3IpIHtcbiAgICAgICAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgY29uc3RydWN0b3Ige1xuICAgICAgICAgICAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgICAgICAgICAgICAgIHN1cGVyKC4uLmFyZ3MpO1xuICAgICAgICAgICAgICAgIHRoaXMuT2JzZXJ2ZXJJZCA9IERhdGUubm93KCkgKiBNYXRoLnJhbmRvbSgpICogMTAwMDtcbiAgICAgICAgICAgICAgICBTZXJ2aWNlU3RhdHVzXzEuU2VydmljZVN0YXR1cy5JbnN0YW5jZS5hdHRhY2godGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfTtcbn1cbmV4cG9ydHMuT2JzZXJ2ZSA9IE9ic2VydmU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgRGVmYXVsdFBpbmdTZXJ2aWNlIHtcbiAgICBwaW5nKCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICAgICAgZmV0Y2gobmV3IFJlcXVlc3QoXCIvZmF2aWNvLmljbz9fPVwiICsgbmV3IERhdGUoKS5nZXRUaW1lKCkpLCB7XG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJHRVRcIixcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogbmV3IEhlYWRlcnMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxuICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgbW9kZTogXCJjb3JzXCIsXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlOiBcImRlZmF1bHRcIixcbiAgICAgICAgICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIlxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0UGluZ1NlcnZpY2UgPSBuZXcgRGVmYXVsdFBpbmdTZXJ2aWNlKCk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIFN0YXRlVHlwZTtcbihmdW5jdGlvbiAoU3RhdGVUeXBlKSB7XG4gICAgU3RhdGVUeXBlW1N0YXRlVHlwZVtcIk9OTElORVwiXSA9IDBdID0gXCJPTkxJTkVcIjtcbiAgICBTdGF0ZVR5cGVbU3RhdGVUeXBlW1wiT0ZGTElORVwiXSA9IDFdID0gXCJPRkZMSU5FXCI7XG59KShTdGF0ZVR5cGUgPSBleHBvcnRzLlN0YXRlVHlwZSB8fCAoZXhwb3J0cy5TdGF0ZVR5cGUgPSB7fSkpO1xuY2xhc3MgU2VydmljZVN0YXR1cyB7XG4gICAgY29uc3RydWN0b3IocGVyaW9kID0gMTAwMCkge1xuICAgICAgICB0aGlzLnBlcmlvZCA9IHBlcmlvZDtcbiAgICAgICAgdGhpcy5vYnNlcnZlcnMgPSBuZXcgTWFwKCk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBTdGF0ZVR5cGUuT05MSU5FO1xuICAgICAgICB0aGlzLmludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4gdGhpcy5jYWxsYmFjaygpLCB0aGlzLnBlcmlvZCk7XG4gICAgfVxuICAgIHN0YXRpYyBnZXQgSW5zdGFuY2UoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmluc3RhbmNlO1xuICAgIH1cbiAgICBzdGF0aWMgc2V0IEluc3RhbmNlKHNlcnZpY2VTdGF0dXMpIHtcbiAgICAgICAgdGhpcy5pbnN0YW5jZSA9IHNlcnZpY2VTdGF0dXM7XG4gICAgfVxuICAgIGF0dGFjaChvYnNlcnZlcikge1xuICAgICAgICBpZiAob2JzZXJ2ZXIuT2JzZXJ2ZXJJZClcbiAgICAgICAgICAgIHRoaXMub2JzZXJ2ZXJzLnNldChvYnNlcnZlci5PYnNlcnZlcklkLCBvYnNlcnZlcik7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk9ic2VydmVySWQgTm90IFNldC5cIik7XG4gICAgfVxuICAgIHN0YXRpYyBzZXQgUGluZyhwaW5nKSB7XG4gICAgICAgIFNlcnZpY2VTdGF0dXMucGluZyA9IHBpbmc7XG4gICAgfVxuICAgIHNldCBTdGF0ZShzdGF0ZSkge1xuICAgICAgICB0aGlzLnN0YXRlID0gc3RhdGU7XG4gICAgICAgIHRoaXMubm90aWZ5KCk7XG4gICAgfVxuICAgIGdldCBTdGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGU7XG4gICAgfVxuICAgIHN0YXRpYyBnb09ubGluZSgpIHtcbiAgICAgICAgaWYgKFNlcnZpY2VTdGF0dXMuaW5zdGFuY2UuU3RhdGUgIT09IFN0YXRlVHlwZS5PTkxJTkUpIHtcbiAgICAgICAgICAgIFNlcnZpY2VTdGF0dXMuaW5zdGFuY2UuU3RhdGUgPSBTdGF0ZVR5cGUuT05MSU5FO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBzdGF0aWMgZ29PZmZsaW5lKCkge1xuICAgICAgICBpZiAoU2VydmljZVN0YXR1cy5pbnN0YW5jZS5TdGF0ZSAhPT0gU3RhdGVUeXBlLk9GRkxJTkUpIHtcbiAgICAgICAgICAgIFNlcnZpY2VTdGF0dXMuaW5zdGFuY2UuU3RhdGUgPSBTdGF0ZVR5cGUuT0ZGTElORTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgbm90aWZ5KCkge1xuICAgICAgICB0aGlzLm9ic2VydmVycy5mb3JFYWNoKG9ic2VydmVyID0+IG9ic2VydmVyLnVwZGF0ZVN0YXRlKHRoaXMuU3RhdGUpKTtcbiAgICB9XG4gICAgY2FsbGJhY2soKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBpZiAoIVNlcnZpY2VTdGF0dXMucGluZylcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBpZiAoeWllbGQgU2VydmljZVN0YXR1cy5waW5nLnBpbmcoKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gU2VydmljZVN0YXR1cy5nb09ubGluZSgpO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJldHVybiBTZXJ2aWNlU3RhdHVzLmdvT2ZmbGluZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgc3RhdGljIGNhbmNlbEludGVydmFsKCkge1xuICAgICAgICBjbGVhckludGVydmFsKFNlcnZpY2VTdGF0dXMuaW5zdGFuY2UuaW50ZXJ2YWwpO1xuICAgIH1cbn1cbmV4cG9ydHMuU2VydmljZVN0YXR1cyA9IFNlcnZpY2VTdGF0dXM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIE9mZmxpbmVEYXRhU2VydmljZSB7XG4gICAgc3luYygpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IHlldCBJbXBsZW1lbnRlZFwiKTtcbiAgICB9XG4gICAgaGFzRGF0YSgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm90IHlldCBJbXBsZW1lbnRlZFwiKTtcbiAgICB9XG59XG5leHBvcnRzLk9mZmxpbmVEYXRhU2VydmljZSA9IE9mZmxpbmVEYXRhU2VydmljZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIFN0YXRlVHlwZTtcbihmdW5jdGlvbiAoU3RhdGVUeXBlKSB7XG4gICAgU3RhdGVUeXBlW1N0YXRlVHlwZVtcIk9OTElORVwiXSA9IDBdID0gXCJPTkxJTkVcIjtcbiAgICBTdGF0ZVR5cGVbU3RhdGVUeXBlW1wiT0ZGTElORVwiXSA9IDFdID0gXCJPRkZMSU5FXCI7XG59KShTdGF0ZVR5cGUgPSBleHBvcnRzLlN0YXRlVHlwZSB8fCAoZXhwb3J0cy5TdGF0ZVR5cGUgPSB7fSkpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19kZWNvcmF0ZSA9ICh0aGlzICYmIHRoaXMuX19kZWNvcmF0ZSkgfHwgZnVuY3Rpb24gKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcbn07XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IFN0YXRlVHlwZV8xID0gcmVxdWlyZShcIi4vU3RhdGVUeXBlXCIpO1xuY29uc3QgT2JzZXJ2ZXJfMSA9IHJlcXVpcmUoXCIuLi9PYnNlcnZlclwiKTtcbmNvbnN0IE9mZmxpbmVEYXRhU2VydmljZV8xID0gcmVxdWlyZShcIi4vT2ZmbGluZURhdGFTZXJ2aWNlXCIpO1xudmFyIFN5bmNTdGF0dXM7XG4oZnVuY3Rpb24gKFN5bmNTdGF0dXMpIHtcbiAgICBTeW5jU3RhdHVzW1N5bmNTdGF0dXNbXCJXQUlUSU5HXCJdID0gMF0gPSBcIldBSVRJTkdcIjtcbiAgICBTeW5jU3RhdHVzW1N5bmNTdGF0dXNbXCJOT19EQVRBXCJdID0gMV0gPSBcIk5PX0RBVEFcIjtcbiAgICBTeW5jU3RhdHVzW1N5bmNTdGF0dXNbXCJEQVRBXCJdID0gMl0gPSBcIkRBVEFcIjtcbn0pKFN5bmNTdGF0dXMgPSBleHBvcnRzLlN5bmNTdGF0dXMgfHwgKGV4cG9ydHMuU3luY1N0YXR1cyA9IHt9KSk7XG5sZXQgU3luY1NlcnZpY2UgPSBjbGFzcyBTeW5jU2VydmljZSB7XG4gICAgY29uc3RydWN0b3Iob2ZmbGluZURhdGFTZXJ2aWNlID0gbmV3IE9mZmxpbmVEYXRhU2VydmljZV8xLk9mZmxpbmVEYXRhU2VydmljZSgpLCBtYXhSZXRyeSA9IEluZmluaXR5KSB7XG4gICAgICAgIHRoaXMub2ZmbGluZURhdGFTZXJ2aWNlID0gb2ZmbGluZURhdGFTZXJ2aWNlO1xuICAgICAgICB0aGlzLm1heFJldHJ5ID0gbWF4UmV0cnk7XG4gICAgICAgIHRoaXMuc3RhdGUgPSBTeW5jU3RhdHVzLldBSVRJTkc7XG4gICAgfVxuICAgIGdldCBTdGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGU7XG4gICAgfVxuICAgIHNldCBTdGF0ZShzdGF0ZSkge1xuICAgICAgICB0aGlzLnN0YXRlID0gc3RhdGU7XG4gICAgfVxuICAgIHVwZGF0ZVN0YXRlKG5ldHdvcmtTdGF0ZSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgaWYgKG5ldHdvcmtTdGF0ZSA9PT0gU3RhdGVUeXBlXzEuU3RhdGVUeXBlLk9OTElORSkge1xuICAgICAgICAgICAgICAgIHlpZWxkIHRoaXMub25PbmxpbmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIG9uT25saW5lKCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgeWllbGQgdGhpcy5zeW5jKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzeW5jKCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgbGV0IGhhc0RhdGEgPSB5aWVsZCB0aGlzLm9mZmxpbmVEYXRhU2VydmljZS5oYXNEYXRhKCk7XG4gICAgICAgICAgICBpZiAoIWhhc0RhdGEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRyYW5zaXRpb25Ub05vRGF0YVN0YXRlKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgeWllbGQgdGhpcy50cmFuc2l0aW9uVG9EYXRhU3RhdGUoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHRyYW5zaXRpb25Ub05vRGF0YVN0YXRlKCkge1xuICAgICAgICB0aGlzLlN0YXRlID0gU3luY1N0YXR1cy5OT19EQVRBO1xuICAgIH1cbiAgICB0cmFuc2l0aW9uVG9EYXRhU3RhdGUoKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBsZXQgcmV0cnkgPSAwO1xuICAgICAgICAgICAgd2hpbGUgKCF0aGlzLmlzU3luY1N1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZXRyeSsrO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLlN0YXRlID0gU3luY1N0YXR1cy5EQVRBO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzU3luY1N1Y2Nlc3MgPSB5aWVsZCB0aGlzLm9mZmxpbmVEYXRhU2VydmljZS5zeW5jKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzU3luY1N1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudHJhbnNpdGlvblRvTm9EYXRhU3RhdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChyZXRyeSA9PT0gdGhpcy5tYXhSZXRyeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChleCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocmV0cnkgPT09IHRoaXMubWF4UmV0cnkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IChuZXcgRXJyb3IoZXgpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufTtcblN5bmNTZXJ2aWNlID0gX19kZWNvcmF0ZShbXG4gICAgT2JzZXJ2ZXJfMS5PYnNlcnZlKClcbl0sIFN5bmNTZXJ2aWNlKTtcbmV4cG9ydHMuU3luY1NlcnZpY2UgPSBTeW5jU2VydmljZTtcbiJdfQ==
