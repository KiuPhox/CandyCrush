import { CANDY_TYPE } from '../const/CandyType'
import { ICandy } from '../interfaces/tile'

export default class Candy extends Phaser.GameObjects.Image {
    public candyType: CANDY_TYPE

    constructor(iCandy: ICandy) {
        super(iCandy.scene, iCandy.x, iCandy.y, iCandy.texture, iCandy.frame)
        this.candyType = iCandy.candyType

        this.setOrigin(0, 0).setScale(0.7).setInteractive()

        this.scene.add.existing(this)
    }
}
