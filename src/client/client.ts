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
            document.getElementById('style').setAttribute('href', 'styles.css');
            for (let pl of data){
                $("#players").append("<div class=\"player\">\n" +
                    "        <div class=\"player-name\">" + pl.name + "</div>\n" +
                    "        <div class=\"player-money\"><span>$</span><span>" + pl.money + "</span></div>\n" +
                    "    </div>");
            }
            //переключем экраны
            $(".start").attr('hidden','hidden');
            //$(".butt").removeAttr('hidden');
            $(".game").removeAttr('hidden');
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






let diceIMG = [
    'images/dice/dice1.svg',
    'images/dice/dice2.svg',
    'images/dice/dice3.svg',
    'images/dice/dice4.svg',
    'images/dice/dice5.svg',
    'images/dice/dice6.svg',
];



function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}



let rollButton = document.querySelector('.throw-dice-button');
/*rollButton.addEventListener ( 'click', roll, );

function roll(){
	let dice = document.querySelector('.dice');
	//dice.innerHTML = '';

	let dice1 = document.createElement("IMG");
	let dice2 = document.createElement("IMG");

	let d1 = getRandomIntInclusive(1,5);
	let d2 = getRandomIntInclusive(1,5);

	dice1.src = diceIMG[d1];
	dice2.src = diceIMG[d2];;


	dice.appendChild(dice1);
	dice.appendChild(dice2);
}*/

rollButton.addEventListener ( 'click', function roll() {
    let img=["dice1", "dice2"];

    img.forEach(function(elementId){
        // @ts-ignore
        document.getElementById(elementId).src = diceIMG[getRandomIntInclusive(1,5)];
    });
}, );

//компиляция с параметрами tsc -p .