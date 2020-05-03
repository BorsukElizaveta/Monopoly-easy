type PlayerState = {
    name: string;
    money: number;
    position: number;
    colour: "Orange" | "Blue" | "Pirple" | "Green";
}

type GameField = {
    name: string;
    type: "commerceCell" | "restCell";
    price?: 60 | 100 | 120 | 140 | 160 | 180 | 200 | 220 | 240 | 260 | 280 | 300 | 320 | 350 | 400;
    tax?: number[];
    buildings?: 0 | 1 | 2 | 3 | 4 | 5;
    owner?: string;
};

type GameState = {
    id: number;
    whoMove: string;
    maxPlayers: number;
    gameStatus: number;
}

class Client {
    private socket: SocketIOClient.Socket
    private player: PlayerState
    private id: string

    constructor() {
        this.socket = io();
        this.id = this.socket.id;

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
            document.getElementById('style').setAttribute('href', 'styles.css');
            let num = 0;
            for (let pl of data) {
                $("#players").append("<div class=\"player\" id='player" + num + "'>\n" +
                    "        <div class=\"player-name\">" + pl.name + "</div>\n" +
                    "        <div class=\"player-money\"><span>$</span><span id=\"money\">" + pl.money + "</span></div>\n" +
                    "    </div>");
                num++;
            }
            $("#player0").addClass("move"); //добавляем клас для подсветки ходящего
            //переключем экраны
            $(".start").attr('hidden', 'hidden');
            $(".game").removeAttr('hidden');
        });

        //обновление данных экранов пользователей
        this.socket.on("updPlayer", (data: PlayerState[]) => {
            let num = 0;
            for (let pl of data) {
                $("div#player" + num + " div.player-name").text(pl.name);
                $("div#player" + num + " div.player-money span#money").text(pl.money);
                //TODO сюда вставку для удаления фишек с прошлой позикии и постановкой на новую
                num++;
            }
        })

        this.socket.on("updMovePlayer", (whoMove: number, maxPlayer: number) => {
            let prevPos = whoMove - 1;
            console.log("maxPl "+ maxPlayer);
            console.log("prewPl "+ prevPos);
            if (prevPos >= 0) {
                $("#player" + prevPos).removeClass("move");
            } else {
                $("#player" + (maxPlayer-1)).removeClass("move");
            }

            $("#player" + whoMove).addClass("move");
        })

        this.socket.on("setFlag", (position: number, colour: string) => {
            $("div#cell_" + position + " div.flag").append("<img alt=\"house\" src=\"images/flag" + colour + ".svg\">");
        })

        // уведомления о статусе регистрации
        this.socket.on('responseNewUser', function (message: string) {
            $(".start").append(message);
        })

        // сообщает что-то от сервера
        this.socket.on('sendUser', function (message: any) {
            alert('The server has a message for you: ' + message);
        })

        //Слушает текстовые сообщения от сервера
        this.socket.on('message', function (message: any) {
            alert('The server has a message for you: ' + message); // сообщает что игрок подключился
        });

        this.socket.on("updDice", (ds1: number, ds2: number) => {

            $('#dice1').attr('src', 'images/dice/dice' + ds1 + '.svg')
            $('#dice2').attr('src', 'images/dice/dice' + ds2 + '.svg')

        })

        this.socket.on("updChip", (lastPos: number, newPos: number) => {

            //TODO удаляет все дома а не один
            $("div#cell_" + lastPos + " div.chip img:first-child").remove();
            $("div#cell_" + newPos + " div.chip").append("<img alt=\"house\" src=\"images/house/house-icon.svg\">")
        })

    }

    //отправляет на сервер данные о нажатии на кнопку для вызова соответствующей функции
    public regToGame() {
        let inputField = $("#namePlayer");
        this.socket.emit('newUser', inputField.val());
        inputField.attr("disabled");
        $("#regGame").attr("disabled");

        //$(".start").append("<div class=\"alert alert-success\" role=\"alert\">Отлично, теперь ждем друзей </div>");

    }

    //нажал на кнопку бросок хода
    public rollDice() {
        this.socket.emit("rollDice", this.socket.id);
        //заготовка на сокрытие экранов
        $("#players").removeAttr('hidden');
        $('.butt').attr('hidden', 'hidden');
        console.log("roll");
    }

    public endMove() {
        this.socket.emit("endMove", this.socket.id);
    }

    public buyCard() {
        this.socket.emit("buyCard", this.socket.id);
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