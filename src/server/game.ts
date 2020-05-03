import Player from "./player";
import socketIO from "socket.io";

export default class MonopolyGame {
    private _id: number; // id сессии
    private _players: { [id: string]: Player } = {}; //массив игроков
    private _gameStatus: number = 0; //0 - ожидание броска кубика 1 - ожидание конца хода (кубик брошен, время на действие)
    private _fields: GameField[]; //игровое поле
    private _whoMove: string; //ходящий игрок
    private _maxPlayers: number; //максимальное количество игроков
    private _gameState: GameState; //сатус игры

    constructor(id: number, maxPlayers: number, players: { [id: string]: Player }) {
        this._id = id;
        this._players = players; // массив игроков игровой сесии
        this.createField(); // создаем игровое поле
        this._whoMove = Object.keys(this._players)[0]; //взять socket.id у первого игрока
        this._maxPlayers = maxPlayers;

        console.log("the fields: " + this._fields[0].name);
        console.log("the fields: ");
        console.log(this._players);
        console.log("the start player: ");
        console.log(this._whoMove);
        //console.log("the first player: " + this._whoMove);

        console.log("Game start, waiting to Move player: ", this._players[this._whoMove].getPlayer().name);
        this._gameState = {
            id: this._id,
            whoMove: this._whoMove,
            gameStatus: this._gameStatus,
            maxPlayers: this._maxPlayers
        }
    }

    public move(num: number) {
        this._players[this._whoMove].newPosition(num);
        this._gameStatus = 1; //меняем статус на ожидание завершения хода
        this._gameState.gameStatus = this._gameStatus;


    }

    public endMove() {
        this._gameStatus = 0; //меняем статус на нового хода
        this._gameState.gameStatus = this._gameStatus;
        console.log("move end");

        if (this._whoMove == Object.keys(this._players)[this._maxPlayers - 1]) {
            console.log("last player");
            this._whoMove = Object.keys(this._players)[0];
            this._gameState.whoMove = this._whoMove;
        } else {
            for (let i = 0; i < this._maxPlayers - 1; i++) {
                console.log(i);
                if (this._whoMove == Object.keys(this._players)[i]) {
                    console.log(Object.keys(this._players));
                    this._whoMove = Object.keys(this._players)[++i]; //обновляем ходящего
                    this._gameState.whoMove = this._whoMove; //обновляем данные для вызачи
                    console.log("next move " + this._whoMove);
                    break;
                }
            }
        }
    }

    public buyCard(id: string, io: socketIO.Server) {
        console.log("buy function call");
        let pl = this._players[id].getPlayer();
        if (this._whoMove == id) {//ходит этот игрок?
            if (this._fields[pl.position].type == "commerceCell") { //ячека коммерческая?
                if (!(this._fields[pl.position].hasOwnProperty("owner"))) { //проверям куплена ли эта ячека кем то
                    console.log("cell is free");
                    if ((pl.money - this._fields[pl.position].price) >= 0) {//проверка на наличие денег
                        this._players[id].setMoney(pl.money - this._fields[pl.position].price);
                        this._fields[pl.position].owner = id;
                        io.emit("setFlag", pl.position, pl.colour);
                        // console.log(this._fields[pl.position]);
                        // console.log(this._players[id].getPlayer());
                    } else {
                        console.log("need more money");
                    }
                } else {
                    console.log("this cell have owner");
                }
            }
            else {
                console.log("cell is rest")
            }
        } else {
            console.log("cant buy, different player move");
        }
    }

    //возвращает статус игры
    public gameState(): GameState {
        return this._gameState;
    }

    //возвращает текущие данные пользователей
    public getPlayersData(): PlayerState[] {
        let allPlayers = []
        for (let value of Object.values(this._players)) {
            allPlayers.push(value.getPlayer());
        }
        return allPlayers;
    }

    public getInxWhoMove(): number {
        let key = Object.keys(this._players);
        console.log(key);
        console.log(key.indexOf(this._whoMove));
        return key.indexOf(this._whoMove);
    }

    public getCountPlayer(): number{
        return Object.keys(this._players).length;
    }

    private createField() {
        //this._fields[0].owner = "owner1"; //так потом овнера можно добавить
        this._fields = [{ //0
            name: "Старт",
            type: "restCell"
        }, { //1
            name: "Житная ул.",
            type: "commerceCell",
            price: 60,
            tax: [2, 10, 30, 90, 160, 250],
            buildings: 0
        }, { //2
            name: "Отдых",
            type: "restCell"
        }, { //3
            name: "Нагатинская ул.",
            type: "commerceCell",
            price: 60,
            tax: [10, 24, 60, 120, 300, 450],
            buildings: 0
        }, { //4
            name: "Отдых",
            type: "restCell"
        }, { //5
            name: "Отдых",
            type: "restCell"
        }, { //6
            name: "Ул.Огарева",
            type: "commerceCell",
            price: 100,
            tax: [6, 30, 90, 270, 400, 550],
            buildings: 0
        }, { //7
            name: "Отдых",
            type: "restCell"
        }, { //8
            name: "Варшавское шоссе",
            type: "commerceCell",
            price: 100,
            tax: [6, 30, 90, 270, 400, 550],
            buildings: 0
        }, { //9
            name: "Парковая ул.",
            type: "commerceCell",
            price: 100,
            tax: [7, 35, 105, 315, 460, 640],
            buildings: 0
        }, { //10
            name: "Отдых",
            type: "restCell"
        }, { //11
            name: "Ул.Стретенка",
            type: "commerceCell",
            price: 160,
            tax: [10, 50, 150, 450, 625, 750],
            buildings: 0
        }, { //12
            name: "Отдых",
            type: "restCell"
        }, { //13
            name: "Ул.Полянка",
            type: "commerceCell",
            price: 140,
            tax: [10, 50, 150, 450, 625, 750],
            buildings: 0
        }, { //14
            name: "Ростовская наб.",
            type: "commerceCell",
            price: 160,
            tax: [12, 60, 180, 500, 700, 900],
            buildings: 0
        }, { //15
            name: "Отдых",
            type: "restCell"
        }, { //16
            name: "Ул. Вавилова",
            type: "commerceCell",
            price: 180,
            tax: [14, 70, 200, 550, 750, 950],
            buildings: 0
        }, { //17
            name: "Отдых",
            type: "restCell"
        }, { //18
            name: "Рязанский проспект",
            type: "commerceCell",
            price: 180,
            tax: [14, 70, 200, 550, 750, 950],
            buildings: 0
        }, { //19
            name: "Рублевское шоссе",
            type: "commerceCell",
            price: 200,
            tax: [16, 80, 220, 600, 800, 1000],
            buildings: 0
        }, { //20
            name: "Отдых",
            type: "restCell"
        }, { //21
            name: "Пушкинская ул.",
            type: "commerceCell",
            price: 220,
            tax: [18, 90, 250, 700, 875, 1050],
            buildings: 0
        }, { //22
            name: "Отдых",
            type: "restCell"
        }, { //23
            name: "Ул Тверская",
            type: "commerceCell",
            price: 220,
            tax: [18, 90, 250, 700, 875, 1050],
            buildings: 0
        }, { //24
            name: "Площадь Маяковского",
            type: "commerceCell",
            price: 240,
            tax: [20, 100, 300, 750, 925, 1100],
            buildings: 0
        }, { //25
            name: "Отдых",
            type: "restCell"
        }, { //26
            name: "Грузинский вал",
            type: "commerceCell",
            price: 260,
            tax: [22, 110, 330, 800, 970, 1150],
            buildings: 0
        }, { //27
            name: "Новинский бульвар",
            type: "commerceCell",
            price: 260,
            tax: [22, 110, 330, 800, 970, 1150],
            buildings: 0
        }, { //28
            name: "Отдых",
            type: "restCell"
        }, { //29
            name: "Смоленская площадь",
            type: "commerceCell",
            price: 280,
            tax: [24, 120, 360, 850, 1025, 1200],
            buildings: 0
        }, { //30
            name: "Отдых",
            type: "restCell"
        }, { //31
            name: "Гоголевский бульва",
            type: "commerceCell",
            price: 300,
            tax: [26, 130, 390, 900, 1100, 1275],
            buildings: 0
        }, { //32
            name: "ул.Щусева",
            type: "commerceCell",
            price: 300,
            tax: [26, 130, 390, 900, 1100, 1275],
            buildings: 0
        }, { //33
            name: "Отдых",
            type: "restCell"
        }, { //34
            name: "Кутузовский проспект",
            type: "commerceCell",
            price: 320,
            tax: [28, 150, 450, 1000, 1200, 1400],
            buildings: 0
        }, { //35
            name: "Отдых",
            type: "restCell"
        }, { //36
            name: "Отдых",
            type: "restCell"
        }, { //37
            name: "ул. Маллая бронная",
            type: "commerceCell",
            price: 350,
            tax: [35, 170, 500, 1100, 1300, 1500],
            buildings: 0
        }, { //38
            name: "Отдых",
            type: "restCell"
        }, { //39
            name: "ул. Арбат",
            type: "commerceCell",
            price: 400,
            tax: [50, 200, 600, 1400, 1700, 2000],
            buildings: 0
        }];
    }
};