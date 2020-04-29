type PlayerState = {
    name: string;
    money: number;
}

export default class Player {
    private _name: string
    private _money: number = 50000

    constructor(name: string) {
        this._name = name;
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