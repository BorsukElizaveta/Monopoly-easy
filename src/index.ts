import * as path from "path";

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

app.use(express.static(__dirname + '/client')); //путь до статических страниц которые сервер отсылает клиенту

//маршрут
app.get("/", (req: any, res: any) => {
    //рендерим статическую страницу
    res.render("index");
});


//слушаем сообщения от клиента после того как он загрузися - connected
io.on("connection", function(socket: any) {
    console.log("a user connected");

    socket.on("newUser", function(username: string){
        socket.username = username;
        socket.broadcast.emit('message', socket.username + ' has just connected to game!');
    });

    //слушаем сообщения от клиента типа message
    socket.on("rollDice", function(message: string) {
        console.log(socket.username + " wants:" + message);
    });

    socket.on("buyCard", function(message: string) {
        console.log(socket.username + " wants:" + message);
    });

    socket.on("sellCard", function(message: any) {
        console.log(socket.username + " wants:" + message);
    });

    socket.on("buyHouse", function(message: any) {
        console.log(socket.username + " wants:" + message);
    });

    socket.on("sellHouse", function(message: any) {
        console.log(socket.username + " wants:" + message);
    });
});

const server = http.listen(port, function() {
    console.log(`server started at http://localhost:${port}`);
});





