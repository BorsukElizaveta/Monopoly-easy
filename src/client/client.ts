class Client {
    private socket: SocketIOClient.Socket

    constructor() {
        this.socket = io();

        // Посетителя просят ввести имя пользователя...
        let username = prompt('What\'s your username?');

        // Оно отправляется в сообщении типа "sendUser"
        this.socket.emit('newUser', username);

        this.socket.on('newUser', function(data){
            let infoPlayer = JSON.parse ( data );

            $(".players > .player1 > .player-name").text(infoPlayer.name);
            $(".players > .player1 > .player-money").text(infoPlayer.money);
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
    public rollDice = () => {
        this.socket.emit("rollDice", "User roll Dice");
        console.log("roll");
    }

    public buyCard = () => {
        this.socket.emit("buyCard", "User buyCard click");
    }

    public sellCard = () => {
        this.socket.emit("sellCard", "User sellCard click");
    }

    public buyHouse = () => {
        this.socket.emit("buyHouse", "User buyCard click");
    }

    public sellHouse = () => {
        this.socket.emit("sellHouse", "User sellHouse click");
    }
}

const client = new Client();

//компиляция с параметрами tsc -p .