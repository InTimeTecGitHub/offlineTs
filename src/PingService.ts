
export interface PingService {
    ping: () => Promise<boolean>;
}
class DefaultPingService implements PingService {
    async ping() {
        return new Promise<boolean>((resolve) => {
            fetch(
                new Request("/favico.ico?_=" + new Date().getTime()),
                {
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
                    else resolve(false);
                })
                .catch(error => {
                    resolve(false);
                });
        });
    }
}
export var defaultPingService = new DefaultPingService();