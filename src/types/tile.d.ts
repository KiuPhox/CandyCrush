import { CANDY_TYPE } from '../const/CandyType'

export interface ICandy {
    scene: Phaser.Scene
    x: number
    y: number
    gridX: number
    gridY: number
    candyType: CANDY_TYPE
    texture: string
    frame?: string | number
}
