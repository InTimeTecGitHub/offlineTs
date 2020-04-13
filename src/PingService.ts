export interface PingService {
    ping: (path: string, init: RequestInit) => Promise<Response>;
}

class DefaultPingService implements PingService {
    async ping(path: string, init:RequestInit) {
        return fetch( new Request(path, init));
    }
}
export var defaultPingService = new DefaultPingService();