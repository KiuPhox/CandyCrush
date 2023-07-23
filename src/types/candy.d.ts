import { CANDY_TYPE, SPECIAL_TYPE } from '../constants/CandyConstant'
import Candy from '../objects/Candy'

export interface ICandy {
    scene: Phaser.Scene
    x: number
    y: number
    gridX: number
    gridY: number
    candyType: CANDY_TYPE
    specialType: SPECIAL_TYPE
}

export type Cell = Candy | undefined
