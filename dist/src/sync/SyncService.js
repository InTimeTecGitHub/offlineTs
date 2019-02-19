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
