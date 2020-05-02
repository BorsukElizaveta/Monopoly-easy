export default class Player {
    private readonly _name: string
    private _money: number = 50000
    private _position: number;
    private _colour: string;


    constructor(name: string, colour: string) {
        this._name = name;
        this._position = 0;
        this._colour = colour;
    }

    public getMoney():number {
        return this._money;
    }
    public getPosition():number{
        return this._position;
    }

    public getColour():string {
        return this._colour;
    }

    //установка/обновление денег
    public setMoney(money: number){
        this._money = money;
    }

    public newPosition (addPos: number){
        let newPosition = this._position + addPos;
        if (newPosition > 39) { //прошли круг
            this._money += 200;
            this._position = newPosition - 39;
        }
        else {
            this._position = newPosition;
        }
    }

    //возвращает объект игрока
    public getPlayer(): PlayerState {
        return <PlayerState>{name: this._name, money: this._money, position: this._position, colour: this._colour}
    }
}