import { CANDY_TYPE } from './CandyConstant'

export const GAME_CONFIG = {
    score: 0,
    highscore: 0,
    gridWidth: 10,
    gridHeight: 8,
    tileWidth: 64,
    tileHeight: 64,
    candyTypes: [
        CANDY_TYPE.BLUE,
        CANDY_TYPE.GREEN,
        CANDY_TYPE.ORANGE,
        CANDY_TYPE.PURPLE,
        CANDY_TYPE.RED,
        CANDY_TYPE.YELLOW,
    ],
}
