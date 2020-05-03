import express from "express"; // Подключаем express
import path from "path";
import http from "http";
import socketIO from "socket.io";
import Player from "./player";
import MonopolyGame from "./game";

const port: number = 3000

class App {
    private MAX_PLAYERS = 2;
    private server: http.Server
    private port: number
    private io: socketIO.Server
    private players: { [id: string]: Player } = {} //словарь подключенныъ игроков по типу {socket.id: Player { _money: 50000, _name: Nuck}
    private games: { [id: number]: MonopolyGame } = {}
    private colour = ["Orange", "Blue" , "Pirple" , "Green" ];

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
                if (typeof this.games[0] != 'undefined'){
                    this.games[0].delPlayer(socket.id, this.io);

                }
                else if (this.players && this.players[socket.id]) {
                    delete this.players[socket.id] //удаляет из партии игрока от кого пришел 'disconnected'
                    console.log("In game " + (Object.keys(this.players).length) + " players");
                }

                //TODO надо проработать убирание пользователя из интерфейса если он отвалился
            });

            socket.on("newUser", (username: string) => {
                if ((Object.keys(this.players).length) < this.MAX_PLAYERS) {
                    this.players[socket.id] = new Player(username, this.colour[(Object.keys(this.players).length)])

                    //socket.broadcast.emit('newUserReport', this.players[socket.id].getPlayer());
                    //console.log(this.players);
                    //console.log(this.players[socket.id].getPlayer());
                    //console.log("In game " + (Object.keys(this.players).length) + " players");

                    //если набралось максимальное количество игроков, то отсылаем данные всех игроков на клииента для отрисовки и начала игры
                    if ((Object.keys(this.players).length) == this.MAX_PLAYERS) {
                        console.log("start game");

                        //console.log(allPlayers);

                        //TODO допилить создание нескольких сессий
                        //создаем игру
                        this.games[0] = new MonopolyGame(0, this.MAX_PLAYERS, this.players);
                        this.io.emit('renderStartUser', this.games[0].getPlayersData()); //создаем карточки пользователя
                    }
                    socket.emit('responseNewUser', "<div class=\"alert alert-success\" role=\"alert\">👍 Great, now we are waiting for friends </div>");
                    console.log("Game waiting " + (Object.keys(this.players).length) + " players");
                } else {
                    socket.emit('responseNewUser', "<div class=\"alert alert-warning\" role=\"alert\">✋ Sorry but all the players are in the game. Come back another time</div>");
                }
                //socket.broadcast.emit('newUserReport', JSON.stringify( data ));
            });

            //socket.emit("message", "Hello " + socket.id); //даст алерт с id

            //слушаем сообщения от клиента типа message
            // нажатие броска хода
            socket.on("rollDice", (id: string) => {
                let stateGame = this.games[0].gameState();
                if (stateGame.gameStatus == 0) {
                    if (stateGame.whoMove == socket.id) {
                        console.log(socket.id + " game wait roll, move this player");
                        let ds1 = this.getRandomIntInclusive(1,6); //значение 1 кубика
                        let ds2 = this.getRandomIntInclusive(1,6); //значение 2 кубика
                        let lastPos = this.players[socket.id].getPosition();

                        this.games[0].move(ds1+ds2); //передвигаем фишку
                        console.log(ds1 + " " + ds2);
                        this.io.emit("updDice", ds1, ds2); //данные клиент для отрисовки кубиков

                        this.io.emit("updPlayer",this.games[0].getPlayersData()); //обновленние данных экрана пользователя
                        this.io.emit("updChip", lastPos, this.players[socket.id].getPosition());
                        //TODO ответ сервера для обновления позиции фишки
                    }
                    else {
                        console.log(socket.id + " game wait roll, but not this player")
                    }
                } else {
                    console.log("Game not wait rollDice, someone need endMove");
                }
            });

            socket.on("endMove", (id: string) => {
                let stateGame = this.games[0].gameState();
                if (stateGame.gameStatus == 1) {
                    if (stateGame.whoMove == socket.id) {
                        console.log(socket.id + " move ends this player");
                        this.games[0].endMove();
                        this.io.emit("updMovePlayer", this.games[0].getInxWhoMove(), this.games[0].getCountPlayer())
                        //TODO добавить ответ сервера чтоб блокировать кнопки на клиенте
                    }
                    else {
                        console.log(socket.id + " game wait endMove, but not this player")
                    }
                }
                else {
                    console.log("Game not wait endMove, someone need roll Dice");
                }

            })

            socket.on("buyCard", (id: string) => {
                console.log("server: buy " + id);
                this.games[0].buyCard(id, this.io);
                this.io.emit("updPlayer",this.games[0].getPlayersData()); //обновленние данных экрана пользователя
            });

            socket.on("sellCard", function (message: string) {
                console.log(socket.id + " wants: " + message);
            });

            socket.on("buyHouse", function (message: string) {
                console.log(socket.id + " wants: " + message);
            });

            socket.on("sellHouse", function (message: string) {
                console.log(socket.id + " wants: " + message);
            });
        })
    }

    public Start() {
        this.server.listen(this.port, () => {
            console.log(`Server listening on ports ${this.port}.`)
        })
    }

    public getRandomIntInclusive(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
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





