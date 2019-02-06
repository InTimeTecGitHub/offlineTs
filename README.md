# offlinets
Watchdog will check service availability by pinging it.

## Usage
Define any class that should be notified and updated when the state of service changes.
Annotate it with @Observe() passing in the period of ping interval and a PingService as config.
Default implementation will be provided if PingService is not found.

PingService interface looks like this:
```ts
interface PingService {
    ping: () => Promise<boolean>;
}
```

### this syntax uses the DefaultPingService.
```ts
@Observe({
    period: 1000
})
export class SampleObserver {
    state: number = 0;

    //this function will be called when state of the system changes.
    updateState() {
        this.state = 999;
    }
    constructor() {
    }
}
```


### user implemented PingService.
```ts
@Observe({
    period: 1000,
    ping: new PingService()
})
export class SampleObserver {
    state: number = 0;
    //this function will be called when state of the system changes.
    async updateState(state: StateType) {
        this.state = 999;
        return true
    }
    constructor() {
    }
}
```

## StateType is as follows
```ts
export enum StateType {
    ONLINE,
    OFFLINE
}

```
