# offlinets
offlinets will check service availability by pinging it.

## Version 2
## Usage
Define any class that should be notified and updated when the state of service changes.
The class should have a member updateState(state: StateType).
Create an instance of ServiceStatus like:
```ts
let serviceStatus = new ServiceStatus(new PingService());
```
ServiceStatus mandatorily takes a PingService as argument.

PingService interface looks like this:
```ts
interface PingService {
    ping: () => Promise<boolean>;
}
```
Annotate the class with the Observe decorator in serviceStatus instance:
```ts
@serviceStatus.Observe
export class SampleObserver {
    state: number = 0;

    //this function will be called when state of the system changes.
    updateState(state: StateType) {
        this.state = 999;
    }
    constructor() {
    }
}
```
Start the period ping by calling:
```ts
serviceStatus.startPing(1500);// 1500 ms interval period.
```

## Usage (version 1)
Define any class that should be notified and updated when the state of service changes.
The class should have a member updateState(state: StateType)
Annotate it with @Observe() passing in the period of ping interval and a PingService as config.
Default implementation will be provided if PingService is not found.

PingService interface looks like this:
```ts
interface PingService {
    ping: () => Promise<boolean>;
}
```

### This syntax uses the DefaultPingService.
```ts
@Observe({
    period: 1000
})
export class SampleObserver {
    state: number = 0;

    //this function will be called when state of the system changes.
    updateState(state: StateType) {
        this.state = 999;
    }
    constructor() {
    }
}
```


### User implemented PingService.
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
