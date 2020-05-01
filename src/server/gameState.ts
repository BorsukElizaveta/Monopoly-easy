type GameState = {
    id: number;
    whoMove: string;
    maxPlayers: number;
    gameStatus: number;
}

//0 - ожидание броска кубика
//1 - ожидание конца хода (кубик брошен, время на действие)