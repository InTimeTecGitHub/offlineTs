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
            let isSyncSuccess = false;
            while (!isSyncSuccess) {
                try {
                    retry++;
                    this.State = SyncStatus.DATA;
                    isSyncSuccess = yield this.offlineDataService.sync();
                    if (isSyncSuccess) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L2luZGV4LmpzIiwiZGlzdC9zcmMvUGluZ1NlcnZpY2UuanMiLCJkaXN0L3NyYy9TZXJ2aWNlU3RhdHVzLmpzIiwiZGlzdC9zcmMvU3RhdGVUeXBlLmpzIiwiZGlzdC9zcmMvc3luYy9PZmZsaW5lRGF0YVNlcnZpY2UuanMiLCJkaXN0L3NyYy9zeW5jL1N5bmNTZXJ2aWNlLmpzIiwiZGlzdC9zcmMvc3luYy9zeW5jLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgU2VydmljZVN0YXR1c18xID0gcmVxdWlyZShcIi4vc3JjL1NlcnZpY2VTdGF0dXNcIik7XG5leHBvcnRzLlN0YXRlVHlwZSA9IFNlcnZpY2VTdGF0dXNfMS5TdGF0ZVR5cGU7XG5leHBvcnRzLlNlcnZpY2VTdGF0dXMgPSBTZXJ2aWNlU3RhdHVzXzEuU2VydmljZVN0YXR1cztcbmNvbnN0IHN5bmMgPSByZXF1aXJlKFwiLi9zcmMvc3luYy9zeW5jXCIpO1xuZXhwb3J0cy5zeW5jID0gc3luYztcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jbGFzcyBEZWZhdWx0UGluZ1NlcnZpY2Uge1xuICAgIHBpbmcoKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgICAgICAgICAgICBmZXRjaChuZXcgUmVxdWVzdChcIi9mYXZpY28uaWNvP189XCIgKyBuZXcgRGF0ZSgpLmdldFRpbWUoKSksIHtcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIkhFQURcIixcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczogbmV3IEhlYWRlcnMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJBY2NlcHRcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIlxuICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgbW9kZTogXCJjb3JzXCIsXG4gICAgICAgICAgICAgICAgICAgIGNhY2hlOiBcImRlZmF1bHRcIixcbiAgICAgICAgICAgICAgICAgICAgY3JlZGVudGlhbHM6IFwic2FtZS1vcmlnaW5cIlxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gMjAwKVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0UGluZ1NlcnZpY2UgPSBuZXcgRGVmYXVsdFBpbmdTZXJ2aWNlKCk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIFN0YXRlVHlwZTtcbihmdW5jdGlvbiAoU3RhdGVUeXBlKSB7XG4gICAgU3RhdGVUeXBlW1N0YXRlVHlwZVtcIk9OTElORVwiXSA9IDBdID0gXCJPTkxJTkVcIjtcbiAgICBTdGF0ZVR5cGVbU3RhdGVUeXBlW1wiT0ZGTElORVwiXSA9IDFdID0gXCJPRkZMSU5FXCI7XG59KShTdGF0ZVR5cGUgPSBleHBvcnRzLlN0YXRlVHlwZSB8fCAoZXhwb3J0cy5TdGF0ZVR5cGUgPSB7fSkpO1xuY2xhc3MgU2VydmljZVN0YXR1cyB7XG4gICAgY29uc3RydWN0b3IocGluZykge1xuICAgICAgICB0aGlzLnBpbmcgPSBwaW5nO1xuICAgICAgICB0aGlzLm9ic2VydmVycyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFN0YXRlVHlwZS5PTkxJTkU7XG4gICAgICAgIHRoaXMuT2JzZXJ2ZSA9IChjb25zdHJ1Y3RvcikgPT4ge1xuICAgICAgICAgICAgdmFyIHNlcnZpY2VTdGF0dXMgPSB0aGlzO1xuICAgICAgICAgICAgcmV0dXJuIGNsYXNzIGV4dGVuZHMgY29uc3RydWN0b3Ige1xuICAgICAgICAgICAgICAgIGNvbnN0cnVjdG9yKC4uLmFyZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgc3VwZXIoLi4uYXJncyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuT2JzZXJ2ZXJJZCA9IERhdGUubm93KCkgKiBNYXRoLnJhbmRvbSgpICogMTAwMDtcbiAgICAgICAgICAgICAgICAgICAgc2VydmljZVN0YXR1cy5hdHRhY2godGhpcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgYXR0YWNoKG9ic2VydmVyKSB7XG4gICAgICAgIGlmIChvYnNlcnZlci5PYnNlcnZlcklkKVxuICAgICAgICAgICAgdGhpcy5vYnNlcnZlcnMuc2V0KG9ic2VydmVyLk9ic2VydmVySWQsIG9ic2VydmVyKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiT2JzZXJ2ZXJJZCBOb3QgU2V0LlwiKTtcbiAgICB9XG4gICAgc2V0IFBpbmcocGluZykge1xuICAgICAgICB0aGlzLnBpbmcgPSBwaW5nO1xuICAgIH1cbiAgICBzZXQgUGVyaW9kKHBlcmlvZCkge1xuICAgICAgICB0aGlzLmNhbmNlbEludGVydmFsKCk7XG4gICAgICAgIHRoaXMucGVyaW9kID0gcGVyaW9kO1xuICAgICAgICB0aGlzLmludGVydmFsID0gc2V0SW50ZXJ2YWwoKCkgPT4gdGhpcy5jYWxsYmFjaygpLCB0aGlzLnBlcmlvZCk7XG4gICAgfVxuICAgIHNldCBTdGF0ZShzdGF0ZSkge1xuICAgICAgICB0aGlzLnN0YXRlID0gc3RhdGU7XG4gICAgICAgIHRoaXMubm90aWZ5KCk7XG4gICAgfVxuICAgIGdldCBTdGF0ZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGU7XG4gICAgfVxuICAgIGdvT25saW5lKCkge1xuICAgICAgICBpZiAodGhpcy5TdGF0ZSAhPT0gU3RhdGVUeXBlLk9OTElORSkge1xuICAgICAgICAgICAgdGhpcy5TdGF0ZSA9IFN0YXRlVHlwZS5PTkxJTkU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGdvT2ZmbGluZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuU3RhdGUgIT09IFN0YXRlVHlwZS5PRkZMSU5FKSB7XG4gICAgICAgICAgICB0aGlzLlN0YXRlID0gU3RhdGVUeXBlLk9GRkxJTkU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIG5vdGlmeSgpIHtcbiAgICAgICAgdGhpcy5vYnNlcnZlcnMuZm9yRWFjaChvYnNlcnZlciA9PiBvYnNlcnZlci51cGRhdGVTdGF0ZSh0aGlzLlN0YXRlKSk7XG4gICAgfVxuICAgIGNhbGxiYWNrKCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLnBpbmcpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgaWYgKHlpZWxkIHRoaXMucGluZy5waW5nKCkpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ29PbmxpbmUoKTtcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nb09mZmxpbmUoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGNhbmNlbEludGVydmFsKCkge1xuICAgICAgICB0aGlzLmludGVydmFsICYmIChjbGVhckludGVydmFsKHRoaXMuaW50ZXJ2YWwpKTtcbiAgICB9XG4gICAgc3RhcnRQaW5nKHBlcmlvZCkge1xuICAgICAgICBpZiAoIXBlcmlvZClcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCBzdGFydCBwaW5nIHdpdGhvdXQgaW50ZXJ2YWwgdGltZS5cIik7XG4gICAgICAgIGlmICghdGhpcy5waW5nKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gUGluZyBzZXJ2aWNlIHNldC5cIik7XG4gICAgICAgIHRoaXMuUGVyaW9kID0gcGVyaW9kO1xuICAgIH1cbn1cbmV4cG9ydHMuU2VydmljZVN0YXR1cyA9IFNlcnZpY2VTdGF0dXM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBTdGF0ZVR5cGU7XG4oZnVuY3Rpb24gKFN0YXRlVHlwZSkge1xuICAgIFN0YXRlVHlwZVtTdGF0ZVR5cGVbXCJPTkxJTkVcIl0gPSAwXSA9IFwiT05MSU5FXCI7XG4gICAgU3RhdGVUeXBlW1N0YXRlVHlwZVtcIk9GRkxJTkVcIl0gPSAxXSA9IFwiT0ZGTElORVwiO1xufSkoU3RhdGVUeXBlID0gZXhwb3J0cy5TdGF0ZVR5cGUgfHwgKGV4cG9ydHMuU3RhdGVUeXBlID0ge30pKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgT2ZmbGluZURhdGFTZXJ2aWNlIHtcbiAgICBzeW5jKCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgeWV0IEltcGxlbWVudGVkXCIpO1xuICAgIH1cbiAgICBoYXNEYXRhKCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOb3QgeWV0IEltcGxlbWVudGVkXCIpO1xuICAgIH1cbn1cbmV4cG9ydHMuT2ZmbGluZURhdGFTZXJ2aWNlID0gT2ZmbGluZURhdGFTZXJ2aWNlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19kZWNvcmF0ZSA9ICh0aGlzICYmIHRoaXMuX19kZWNvcmF0ZSkgfHwgZnVuY3Rpb24gKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XG4gICAgdmFyIGMgPSBhcmd1bWVudHMubGVuZ3RoLCByID0gYyA8IDMgPyB0YXJnZXQgOiBkZXNjID09PSBudWxsID8gZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpIDogZGVzYywgZDtcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XG4gICAgcmV0dXJuIGMgPiAzICYmIHIgJiYgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCByKSwgcjtcbn07XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IFN0YXRlVHlwZV8xID0gcmVxdWlyZShcIi4uL1N0YXRlVHlwZVwiKTtcbmNvbnN0IE9mZmxpbmVEYXRhU2VydmljZV8xID0gcmVxdWlyZShcIi4vT2ZmbGluZURhdGFTZXJ2aWNlXCIpO1xuY29uc3QgU2VydmljZVN0YXR1c18xID0gcmVxdWlyZShcIi4uL1NlcnZpY2VTdGF0dXNcIik7XG5jb25zdCBQaW5nU2VydmljZV8xID0gcmVxdWlyZShcIi4uL1BpbmdTZXJ2aWNlXCIpO1xudmFyIFN5bmNTdGF0dXM7XG4oZnVuY3Rpb24gKFN5bmNTdGF0dXMpIHtcbiAgICBTeW5jU3RhdHVzW1N5bmNTdGF0dXNbXCJXQUlUSU5HXCJdID0gMF0gPSBcIldBSVRJTkdcIjtcbiAgICBTeW5jU3RhdHVzW1N5bmNTdGF0dXNbXCJOT19EQVRBXCJdID0gMV0gPSBcIk5PX0RBVEFcIjtcbiAgICBTeW5jU3RhdHVzW1N5bmNTdGF0dXNbXCJEQVRBXCJdID0gMl0gPSBcIkRBVEFcIjtcbn0pKFN5bmNTdGF0dXMgPSBleHBvcnRzLlN5bmNTdGF0dXMgfHwgKGV4cG9ydHMuU3luY1N0YXR1cyA9IHt9KSk7XG52YXIgc3luY1NlcnZpY2VTdGF0dXMgPSBuZXcgU2VydmljZVN0YXR1c18xLlNlcnZpY2VTdGF0dXMoUGluZ1NlcnZpY2VfMS5kZWZhdWx0UGluZ1NlcnZpY2UpO1xuZXhwb3J0cy5TeW5jU2VydmljZVN0YXR1cyA9IHN5bmNTZXJ2aWNlU3RhdHVzO1xubGV0IFN5bmNTZXJ2aWNlID0gY2xhc3MgU3luY1NlcnZpY2Uge1xuICAgIGNvbnN0cnVjdG9yKG9mZmxpbmVEYXRhU2VydmljZSA9IG5ldyBPZmZsaW5lRGF0YVNlcnZpY2VfMS5PZmZsaW5lRGF0YVNlcnZpY2UoKSwgbWF4UmV0cnkgPSBJbmZpbml0eSkge1xuICAgICAgICB0aGlzLm9mZmxpbmVEYXRhU2VydmljZSA9IG9mZmxpbmVEYXRhU2VydmljZTtcbiAgICAgICAgdGhpcy5tYXhSZXRyeSA9IG1heFJldHJ5O1xuICAgICAgICB0aGlzLnN0YXRlID0gU3luY1N0YXR1cy5XQUlUSU5HO1xuICAgIH1cbiAgICBnZXQgU3RhdGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRlO1xuICAgIH1cbiAgICBzZXQgU3RhdGUoc3RhdGUpIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICAgIH1cbiAgICB1cGRhdGVTdGF0ZShuZXR3b3JrU3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGlmIChuZXR3b3JrU3RhdGUgPT09IFN0YXRlVHlwZV8xLlN0YXRlVHlwZS5PTkxJTkUpIHtcbiAgICAgICAgICAgICAgICB5aWVsZCB0aGlzLm9uT25saW5lKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBvbk9ubGluZSgpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIHlpZWxkIHRoaXMuc3luYygpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgc3luYygpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGxldCBoYXNEYXRhID0geWllbGQgdGhpcy5vZmZsaW5lRGF0YVNlcnZpY2UuaGFzRGF0YSgpO1xuICAgICAgICAgICAgaWYgKCFoYXNEYXRhKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50cmFuc2l0aW9uVG9Ob0RhdGFTdGF0ZSgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHlpZWxkIHRoaXMudHJhbnNpdGlvblRvRGF0YVN0YXRlKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICB0cmFuc2l0aW9uVG9Ob0RhdGFTdGF0ZSgpIHtcbiAgICAgICAgdGhpcy5TdGF0ZSA9IFN5bmNTdGF0dXMuTk9fREFUQTtcbiAgICB9XG4gICAgdHJhbnNpdGlvblRvRGF0YVN0YXRlKCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgbGV0IHJldHJ5ID0gMDtcbiAgICAgICAgICAgIGxldCBpc1N5bmNTdWNjZXNzID0gZmFsc2U7XG4gICAgICAgICAgICB3aGlsZSAoIWlzU3luY1N1Y2Nlc3MpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICByZXRyeSsrO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLlN0YXRlID0gU3luY1N0YXR1cy5EQVRBO1xuICAgICAgICAgICAgICAgICAgICBpc1N5bmNTdWNjZXNzID0geWllbGQgdGhpcy5vZmZsaW5lRGF0YVNlcnZpY2Uuc3luYygpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoaXNTeW5jU3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50cmFuc2l0aW9uVG9Ob0RhdGFTdGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHJldHJ5ID09PSB0aGlzLm1heFJldHJ5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXRyeSA9PT0gdGhpcy5tYXhSZXRyeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgKG5ldyBFcnJvcihleCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59O1xuU3luY1NlcnZpY2UgPSBfX2RlY29yYXRlKFtcbiAgICBzeW5jU2VydmljZVN0YXR1cy5PYnNlcnZlXG5dLCBTeW5jU2VydmljZSk7XG5leHBvcnRzLlN5bmNTZXJ2aWNlID0gU3luY1NlcnZpY2U7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBPZmZsaW5lRGF0YVNlcnZpY2VfMSA9IHJlcXVpcmUoXCIuL09mZmxpbmVEYXRhU2VydmljZVwiKTtcbmV4cG9ydHMuT2ZmbGluZURhdGFTZXJ2aWNlID0gT2ZmbGluZURhdGFTZXJ2aWNlXzEuT2ZmbGluZURhdGFTZXJ2aWNlO1xudmFyIFN5bmNTZXJ2aWNlXzEgPSByZXF1aXJlKFwiLi9TeW5jU2VydmljZVwiKTtcbmV4cG9ydHMuU3luY1NlcnZpY2UgPSBTeW5jU2VydmljZV8xLlN5bmNTZXJ2aWNlO1xuZXhwb3J0cy5TeW5jU2VydmljZVN0YXR1cyA9IFN5bmNTZXJ2aWNlXzEuU3luY1NlcnZpY2VTdGF0dXM7XG5leHBvcnRzLlN5bmNTdGF0dXMgPSBTeW5jU2VydmljZV8xLlN5bmNTdGF0dXM7XG4iXX0=
