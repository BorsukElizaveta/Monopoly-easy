import express from "express"  // Подключаем express
import path from "path"
import http from "http"
import socketIO from "socket.io"
import Player from "./player";

const port: number = 3000

class App {
    private MAX_PLAYERS = 2;
    private server: http.Server
    private port: number
    private io: socketIO.Server
    private players: {[id: string]:Player} = {} //словарь подключенныъ игроков по типу {socket.id: Player { _money: 50000, _name: Nuck}

    constructor(port: number) {
        this.port = port;

        // Создаем приложение с помощью Express
        const app = express();
        app.use(express.static(path.join(__dirname, '../../public/client')));  //путь до статических страниц которые сервер отсылает клиенту
        app.use('/jquery', express.static(path.join(__dirname, '../../node_modules/jquery/dist')))
        app.use('/bootstrap', express.static(path.join(__dirname, '../../node_modules/bootstrap/dist')))

        // Создаем HTTP-сервер с помощью модуля HTTP, входящего в Node.js.
        // Связываем его с Express
        this.server = new http.Server(app);

        // Инициализируем Socket.IO так, чтобы им обрабатывались подключения
        // к серверу Express/HTTP
        this.io = socketIO(this.server);

        this.io.on('connection', (socket: socketIO.Socket) => {
            console.log('a user connected : ' + socket.id);

            socket.on('disconnect', () => {
                console.log('socket disconnected : ' + socket.id);
                if (this.players && this.players[socket.id]) {
                    delete this.players[socket.id] //удаляет из партии игрока от кого пришел 'disconnected'
                    console.log("In game " + (Object.keys(this.players).length) + " players");
                }
                //TODO надо проработать убирание пользователя если он отвалился
            });

            socket.on("newUser", (username: string) => {
                if ((Object.keys(this.players).length) < this.MAX_PLAYERS) {
                    this.players[socket.id] = new Player(username)

                    //socket.broadcast.emit('newUserReport', this.players[socket.id].getPlayer());
                    console.log(this.players);
                    console.log(this.players[socket.id].getPlayer());
                    console.log("In game " + (Object.keys(this.players).length) + " players");

                    //если набралось максимальное количество игроков, то отсылаем данные всех игроков на клииента для отрисовки и начала игры
                    if ((Object.keys(this.players).length) == this.MAX_PLAYERS) {
                        console.log("start game");
                        let allPlayers = []
                        for (let value of Object.values(this.players)) {
                            allPlayers.push(value.getPlayer());
                        }
                        //console.log(allPlayers);
                        this.io.emit('renderStartUser', allPlayers);
                    }
                    socket.emit('responseNewUser', "<div class=\"alert alert-success\" role=\"alert\">👍 Great, now we are waiting for friends </div>");
                }
                else {
                    socket.emit('responseNewUser', "<div class=\"alert alert-warning\" role=\"alert\">✋ Sorry but all the players are in the game. Come back another time</div>");
                }
                //socket.broadcast.emit('newUserReport', JSON.stringify( data ));
            });

            socket.emit("message", "Hello " + socket.id);
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





