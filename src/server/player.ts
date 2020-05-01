export default class Player {
    private readonly _name: string
    private _money: number = 50000
    private _position: number;


    constructor(name: string) {
        this._name = name;
        this._position = 0;
    }

    public getMoney():number {
        return this._money;
    }

    //установка/обновление денег
    public setMoney(money: number){
        this._money = money;
    }

    //возвращает объект игрока
    public getPlayer(): PlayerState {
        return <PlayerState>{name: this._name, money: this._money}
    }
}