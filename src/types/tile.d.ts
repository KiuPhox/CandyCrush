import { CANDY_TYPE, SPECIAL_TYPE } from '../const/CandyConstant'

export interface ICandy {
    scene: Phaser.Scene
    x: number
    y: number
    gridX: number
    gridY: number
    candyType: CANDY_TYPE
    specialType: SPECIAL_TYPE
    frame?: string | number
}
