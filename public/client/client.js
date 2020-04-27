var Client = /** @class */ (function () {
    function Client() {
        var _this = this;
        //отправляет на сервер данные о нажатии на кнопку для вызова соответствующей функции
        this.rollDice = function () {
            _this.socket.emit("rollDice", "User roll Dice");
            console.log("roll");
        };
        this.buyCard = function () {
            _this.socket.emit("buyCard", "User buyCard click");
        };
        this.sellCard = function () {
            _this.socket.emit("sellCard", "User sellCard click");
        };
        this.buyHouse = function () {
            _this.socket.emit("buyHouse", "User buyCard click");
        };
        this.sellHouse = function () {
            _this.socket.emit("sellHouse", "User sellHouse click");
        };
        this.socket = io();
        // Посетителя просят ввести имя пользователя...
        var username = prompt('What\'s your username?');
        // Оно отправляется в сообщении типа "sendUser"
        this.socket.emit('newUser', username);
        this.socket.on('newUser', function (data) {
            var infoPlayer = JSON.parse(data);
            $(".players > .player1 > .player-name").text(infoPlayer.name);
            $(".players > .player1 > .player-money").text(infoPlayer.money);
        });
        this.socket.on('sendUser', function (message) {
            alert('The server has a message for you: ' + message); // сообщает что-то от сервера
        });
        //Слушает текстовые сообщения от сервера
        this.socket.on('message', function (message) {
            alert('The server has a message for you: ' + message); // сообщает что игрок подключился
        });
    }
    return Client;
}());
var client = new Client();
//компиляция с параметрами tsc -p .
