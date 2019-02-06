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
//# sourceMappingURL=PingService.js.map