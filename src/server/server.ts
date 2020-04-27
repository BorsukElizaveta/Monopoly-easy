import express from "express"  // Подключаем express
import path from "path"
import http from "http"
import socketIO from "socket.io"

const port: number = 3000

class App {
    private server: http.Server
    private port: number
    private io: socketIO.Server

    constructor(port: number) {
        this.port = port;

        // Создаем приложение с помощью Express
        const app = express();
        app.use(express.static(path.join(__dirname, '../../public/client')));  //путь до статических страниц которые сервер отсылает клиенту
        app.use('/jquery', express.static(path.join(__dirname, '../../node_modules/jquery/dist')))

        // Создаем HTTP-сервер с помощью модуля HTTP, входящего в Node.js.
        // Связываем его с Express
        this.server = new http.Server(app);

        // Инициализируем Socket.IO так, чтобы им обрабатывались подключения
        // к серверу Express/HTTP
        this.io = socketIO(this.server);

        this.io.on('connection', (socket: socketIO.Socket) => {
            console.log('a user connected : ' + socket.id);

            socket.on('disconnect', function () {
                console.log('socket disconnected : ' + socket.id);
            });

            socket.emit("message", "Hello " + socket.id);

            socket.on("newUser", function(username: string){
                let data = {
                    "name": username,
                    "money": "66 000"
                };
                socket.broadcast.emit('newUserReport', JSON.stringify( data ));
                console.log(data);
                //socket.emit("newUser", JSON.stringify( data ));
            });

            //слушаем сообщения от клиента типа message
            socket.on("rollDice", function(message: string) {
                console.log(socket.id + " wants:" + message);
            });

            socket.on("buyCard", function(message: string) {
                console.log(socket.id + " wants:" + message);
            });

            socket.on("sellCard", function(message: string) {
                console.log(socket.id + " wants:" + message);
            });

            socket.on("buyHouse", function(message: string) {
                console.log(socket.id + " wants:" + message);
            });

            socket.on("sellHouse", function(message: string) {
                console.log(socket.id + " wants:" + message);
            });
        })
    }

    public Start() {
        this.server.listen(this.port, () => {
            console.log( `Server listening on ports ${this.port}.` )
        })
    }
}

new App(port).Start()







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





