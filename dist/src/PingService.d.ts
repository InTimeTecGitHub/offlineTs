export interface PingService {
    ping: () => Promise<boolean>;
}
declare class DefaultPingService implements PingService {
    ping(): Promise<boolean>;
}
export declare var defaultPingService: DefaultPingService;
export {};
