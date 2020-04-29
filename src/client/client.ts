type PlayerState = {
    name: string;
    money: number;
}

class Client {
    private socket: SocketIOClient.Socket
    private player: PlayerState

    constructor() {
        this.socket = io();

        // Посетителя просят ввести имя пользователя...
        //let username = prompt('What\'s your username?');

        // Оно отправляется в сообщении типа "sendUser"
        //this.socket.emit('newUser', username);

        /*this.socket.on('newUserReport', (data: PlayerState) => {
            //отрисовывает подключенного игрока
            this.player = data;
            $("#players").append("<div class=\"player\">\n" +
                "        <div class=\"player-marker\"></div>\n" +
                "        <div class=\"player-name\">" + data.name + "</div>\n" +
                "        <div class=\"player-money\"><span>$</span><span>" + data.money + "</span></div>\n" +
                "    </div>");
        })*/

        ////отрисовывает всех игроков на старте
        this.socket.on('renderStartUser', (data: PlayerState[]) => {
            //отрисовывает подключенного игрока
            //this.player = data;
            for (let pl of data){
                $("#players").append("<div class=\"player\">\n" +
                    "        <div class=\"player-marker\"></div>\n" +
                    "        <div class=\"player-name\">" + pl.name + "</div>\n" +
                    "        <div class=\"player-money\"><span>$</span><span>" + pl.money + "</span></div>\n" +
                    "    </div>");
            }
            //переключем экраны
            $(".start").attr('hidden','hidden');
            $(".butt").removeAttr('hidden');
            $("#players").removeAttr('hidden');
        });

        this.socket.on('responseNewUser', function(message: string) {
            $(".start").append(message);
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
    public regToGame() {
        let inputField = $("#namePlayer");
        this.socket.emit('newUser', inputField.val());
        inputField.attr("disabled");
        $("#regGame").attr("disabled");

        //$(".start").append("<div class=\"alert alert-success\" role=\"alert\">Отлично, теперь ждем друзей </div>");

    }

    public rollDice() {
        this.socket.emit("rollDice", "User roll Dice");
        //заготовка на сокрытие экранов
        $("#players").removeAttr('hidden');
        $('.butt').attr('hidden','hidden');
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

$('form').submit(function (e) {
    e.preventDefault();
});

//компиляция с параметрами tsc -p .