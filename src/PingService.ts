export interface PingService {
    ping: () => Promise<Response>;
}

class DefaultPingService implements PingService {
    async ping() {
        return fetch(
            new Request("/favicon.ico?_=" + new Date().getTime()),
            {
                method: "HEAD",
                headers: new Headers({
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }),
                mode: "cors",
                cache: "default",
                credentials: "same-origin"
            });
    }
}
export var defaultPingService = new DefaultPingService();