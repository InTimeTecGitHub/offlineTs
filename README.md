# offlinets
offlinets will check availability of a service by pinging it.
An example would be to detect the internet availability in the browser.
run `npm run demo` and open http://localhost:3000 to see this in action.

## Version 3

#### Usage
Define any class that should be notified and updated when the state of service changes.
The class should have a member updateState(state: StateType, response: Response|Error).
updateState is called with StateType as well as the Response.

#### ServiceStatus
An instance of ServiceStatus is created like this:
```ts
let serviceStatus = new ServiceStatus(new PingService());
```
ServiceStatus mandatorily takes a PingService as argument.
PingService.ping() will be called to check service availability.
PingService interface looks like this:
```ts
interface PingService {
    ping: () => Promise<Response>;
}
```
This ServiceStatus class has an exported member to get the response.
It looks like this:
```ts
 get Response(): Response | Error {
        return this.response || new Response();
    }
```
##### Observer interface:
```ts
interface Observer {
    updateState: (state: StateType, response?: Response|Error) => Promise<any>;
    ObserverId?: number;
}
```
### SyncService
#####To start the period ping, refer version-2(usage) context. 
##### Retry 
Start retrying when sync fails by calling:
```ts
syncService.retry(3);// 3 is number for maxRetry.
```
Version 3 exposes a getter method for a Promise that resolves to SyncStatus.. 
It looks like this:
```ts
get SyncStatus(): Promise<SyncStatus> {
    }
``` 

## Version 2
#### Usage
Define any class that should be notified and updated when the state of service changes.
The class should have a member updateState(state: StateType).
Create an instance of ServiceStatus like:
```ts
let serviceStatus = new ServiceStatus(new PingService());
```
ServiceStatus mandatorily takes a PingService as argument.
PingService.ping() will be called to check service availability.
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
Using with Javascript.
```js
var TestObserver = serviceStatus.Observe(function () {
    this.state = 0;
    this.updateState = function () {
        this.state = 999;
        return true;
    }
})

exports.TestObserver = TestObserver;
```
### Sync Service
Version 2 provides a service can be used to synchronize local data with remote server

##### Basic Usage
```ts
import {SyncService, SyncServiceStatus} from "sync";
let syncService = new SyncService(new OfflineDataService(), maxRetry);
SyncServiceStatus.startPing(1500);
```

##### OfflineDataService interface:
```ts
interface OfflineDataService {
    //implementation should sync data and return true for success.
    //false for everything else.
    sync(): Promise<boolean> {
    }

    //implement this to check if data exists, 
    //it would be good if this check was fast.
    hasData(): Promise<boolean> {
    }
}
```
##### maxRetry
Set this value to allow number of retries when sync fails.
by default its set to **Infinity**

## Version 1
#### Usage 
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

#### This syntax uses the DefaultPingService.
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


#### User implemented PingService.
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

#### StateType is as follows
```ts
export enum StateType {
    ONLINE,
    OFFLINE
}

```
### Core Contributors

Feel free to reach out to any of the core contributors with your questions or
concerns. We will do our best to respond in a timely manner.

[![IntimeTec](https://github.com/InTimeTecGitHub/)](https://github.com/InTimeTecGitHub/)
[![Syed Fayaz](https://github.com/SyedFayaz)](https://github.com/SyedFayaz)
[![Nandita Khemnani](https://github.com/Nandita-Khemnani)](https://github.com/Nandita-Khemnani)
[![Akhil Sasidharan](https://github.com/sasidakh)](https://github.com/sasidakh)
