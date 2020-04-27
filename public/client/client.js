var Client = /** @class */ (function () {
    function Client() {
        this.socket = io();
        // Посетителя просят ввести имя пользователя...
        var username = prompt('What\'s your username?');
        //отрисовывает игрока
        //TODO надо продумать как отсылать уже подключеных игроков
        $("#players").append("<div class=\"player\">\n" +
            "        <div class=\"player-marker\"></div>\n" +
            "        <div class=\"player-name\">" + username + "</div>\n" +
            "        <div class=\"player-money\"><span>$</span><span>" + "66 000" + "</span></div>\n" +
            "    </div>");
        // Оно отправляется в сообщении типа "sendUser"
        this.socket.emit('newUser', username);
        this.socket.on('newUserReport', function (data) {
            //alert('The server has a message for you: ' + message); // сообщает что-то от сервера
            var infoPlayer = JSON.parse(data);
            //отрисовывает подключенного игрока
            $("#players").append("<div class=\"player\">\n" +
                "        <div class=\"player-marker\"></div>\n" +
                "        <div class=\"player-name\">" + infoPlayer.name + "</div>\n" +
                "        <div class=\"player-money\"><span>$</span><span>" + infoPlayer.money + "</span></div>\n" +
                "    </div>");
        });
        this.socket.on('sendUser', function (message) {
            alert('The server has a message for you: ' + message); // сообщает что-то от сервера
        });
        //Слушает текстовые сообщения от сервера
        this.socket.on('message', function (message) {
            alert('The server has a message for you: ' + message); // сообщает что игрок подключился
        });
    }
    //отправляет на сервер данные о нажатии на кнопку для вызова соответствующей функции
    Client.prototype.rollDice = function () {
        this.socket.emit("rollDice", "User roll Dice");
        console.log("roll");
    };
    Client.prototype.buyCard = function () {
        this.socket.emit("buyCard", "User buyCard click");
    };
    Client.prototype.sellCard = function () {
        this.socket.emit("sellCard", "User sellCard click");
    };
    Client.prototype.buyHouse = function () {
        this.socket.emit("buyHouse", "User buyCard click");
    };
    Client.prototype.sellHouse = function () {
        this.socket.emit("sellHouse", "User sellHouse click");
    };
    return Client;
}());
var client = new Client();
//компиляция с параметрами tsc -p .
