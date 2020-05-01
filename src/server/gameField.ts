type GameField = {
    name: string;
    type: "commerceCell" | "restCell";
    price?: 60 | 100 | 120 | 140 | 160 | 180 | 200 | 220 | 240 | 260 | 280 | 300 | 320 | 350 | 400;
    tax?: number[];
    buildings?: 0 | 1 | 2 | 3 | 4 | 5;
    owner?: string;
};