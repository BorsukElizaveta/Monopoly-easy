class Client {
    constructor() {
        this.socket = io();
        this.socket.on("message", function (message) {
            console.log(message);
            document.body.innerHTML = message;
            console.log("fignia");
        });
    }
}
const client = new Client();
//компиляция с параметрами tsc -p .
//# sourceMappingURL=client.js.map