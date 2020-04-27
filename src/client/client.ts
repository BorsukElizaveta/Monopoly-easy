class Client {
    private socket: SocketIOClient.Socket

    constructor() {
        this.socket = io();

        // Посетителя просят ввести имя пользователя...
        let username = prompt('What\'s your username?');

        //отрисовывает игрока
        //TODO надо продумать как отсылать уже подключеных игроков
        $("#players").append("<div class=\"player\">\n" +
            "        <div class=\"player-marker\"></div>\n" +
            "        <div class=\"player-name\">" + username + "</div>\n" +
            "        <div class=\"player-money\"><span>$</span><span>" + "66 000" + "</span></div>\n" +
            "    </div>");

        // Оно отправляется в сообщении типа "sendUser"
        this.socket.emit('newUser', username);

        this.socket.on('newUserReport', function(data) {
            //alert('The server has a message for you: ' + message); // сообщает что-то от сервера
            let infoPlayer = JSON.parse ( data );
            //отрисовывает подключенного игрока
            $("#players").append("<div class=\"player\">\n" +
                "        <div class=\"player-marker\"></div>\n" +
                "        <div class=\"player-name\">" + infoPlayer.name + "</div>\n" +
                "        <div class=\"player-money\"><span>$</span><span>" + infoPlayer.money + "</span></div>\n" +
                "    </div>");
        })

        this.socket.on('sendUser', function(message: any) {
            alert('The server has a message for you: ' + message); // сообщает что-то от сервера
        })

        //Слушает текстовые сообщения от сервера
        this.socket.on('message', function(message: any) {
            alert('The server has a message for you: ' + message); // сообщает что игрок подключился
        });

    }

    //отправляет на сервер данные о нажатии на кнопку для вызова соответствующей функции
    public rollDice() {
        this.socket.emit("rollDice", "User roll Dice");
        console.log("roll");
    }

    public buyCard() {
        this.socket.emit("buyCard", "User buyCard click");
    }

    public sellCard() {
        this.socket.emit("sellCard", "User sellCard click");
    }

    public buyHouse() {
        this.socket.emit("buyHouse", "User buyCard click");
    }

    public sellHouse() {
        this.socket.emit("sellHouse", "User sellHouse click");
    }
}

const client = new Client();

//компиляция с параметрами tsc -p .