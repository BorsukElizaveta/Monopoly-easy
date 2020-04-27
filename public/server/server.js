"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express")); // Подключаем express
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = __importDefault(require("socket.io"));
const port = 3000;
class App {
    constructor(port) {
        this.port = port;
        // Создаем приложение с помощью Express
        const app = express_1.default();
        app.use(express_1.default.static(path_1.default.join(__dirname, '../../public/client'))); //путь до статических страниц которые сервер отсылает клиенту
        app.use('/jquery', express_1.default.static(path_1.default.join(__dirname, '../../node_modules/jquery/dist')));
        // Создаем HTTP-сервер с помощью модуля HTTP, входящего в Node.js.
        // Связываем его с Express
        this.server = new http_1.default.Server(app);
        // Инициализируем Socket.IO так, чтобы им обрабатывались подключения
        // к серверу Express/HTTP
        this.io = socket_io_1.default(this.server);
        this.io.on('connection', (socket) => {
            console.log('a user connected : ' + socket.id);
            socket.on('disconnect', function () {
                console.log('socket disconnected : ' + socket.id);
            });
            socket.emit("message", "Hello " + socket.id);
            socket.on("newUser", function (username) {
                let data = {
                    "name": username,
                    "money": "66 000"
                };
                socket.broadcast.emit('newUserReport', JSON.stringify(data));
                console.log(data);
                //socket.emit("newUser", JSON.stringify( data ));
            });
            //слушаем сообщения от клиента типа message
            socket.on("rollDice", function (message) {
                console.log(socket.id + " wants:" + message);
            });
            socket.on("buyCard", function (message) {
                console.log(socket.id + " wants:" + message);
            });
            socket.on("sellCard", function (message) {
                console.log(socket.id + " wants:" + message);
            });
            socket.on("buyHouse", function (message) {
                console.log(socket.id + " wants:" + message);
            });
            socket.on("sellHouse", function (message) {
                console.log(socket.id + " wants:" + message);
            });
        });
    }
    Start() {
        this.server.listen(this.port, () => {
            console.log(`Server listening on ports ${this.port}.`);
        });
    }
}
new App(port).Start();
/* ----------------------------------------------------------
-------------------------------------------------------------
 */
/*import * as path from "path";

import express = require('express'); // Подключаем express

// Создаем приложение с помощью Express
const app = express();
const port = 3000 || process.env.PORT;
app.set("port", port);

// Создаем HTTP-сервер с помощью модуля HTTP, входящего в Node.js.
// Связываем его с Express
let http = require("http").Server(app);

// Инициализируем Socket.IO так, чтобы им обрабатывались подключения
// к серверу Express/HTTP
let io = require("socket.io")(http);

app.use(express.static(path.join(__dirname, '../../public/client'))); //путь до статических страниц которые сервер отсылает клиенту

//маршрут
app.get("/", (req: any, res: any) => {
    //рендерим статическую страницу
    res.render("index");
});
*/ /*

//слушаем сообщения от клиента после того как он загрузися - connected
io.on("connection", function(socket: any) {
    console.log("a user connected id - " + socket.id.toString());

    socket.on("newUser", function(username: string){
        socket.username = username;
        socket.broadcast.emit('message', socket.username + ' has just connected to game!');
        let data = {
            "name": username,
            "money": "60 000"
        };
        console.log(data);
        socket.emit("newUser", JSON.stringify( data ));
    });

    //слушаем сообщения от клиента типа message
    socket.on("rollDice", function(message: string) {
        console.log(socket.username + " wants:" + message);
    });

    socket.on("buyCard", function(message: string) {
        console.log(socket.username + " wants:" + message);
    });

    socket.on("sellCard", function(message: string) {
        console.log(socket.username + " wants:" + message);
    });

    socket.on("buyHouse", function(message: string) {
        console.log(socket.username + " wants:" + message);
    });

    socket.on("sellHouse", function(message: string) {
        console.log(socket.username + " wants:" + message);
    });

    socket.on('disconnect', () => {
        io.emit('user disconnected id - ' + socket.id.toString());
    });
});

*/
