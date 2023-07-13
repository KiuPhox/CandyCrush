import { CANDY_COLORS, CANDY_TYPE, SPECIAL_TYPE } from '../const/CandyConstant'
import { ICandy } from '../types/tile'
import { ParticleManager } from '../managers/ParticleManager'

export default class Candy extends Phaser.GameObjects.Sprite {
    private candyType: CANDY_TYPE
    private specialType: SPECIAL_TYPE
    public gridX: number
    public gridY: number

    constructor(iCandy: ICandy) {
        super(iCandy.scene, iCandy.x, iCandy.y, iCandy.candyType, iCandy.frame)
        this.gridX = iCandy.gridX
        this.gridY = iCandy.gridY
        this.candyType = iCandy.candyType
        this.setSpecialType(iCandy.specialType)

        this.setScale(0.7).setInteractive()
        this.scene.add.existing(this)
    }

    private playExplodeEffect(): void {
        const x = this.getCenter().x ?? 0
        const y = this.getCenter().y ?? 0

        ParticleManager.playCandyExplodeEffect(x, y, CANDY_COLORS[this.candyType])
    }

    public setGrid(x: number, y: number) {
        this.gridX = x
        this.gridY = y
    }

    public getSpecialType(): SPECIAL_TYPE {
        return this.specialType
    }

    public setSpecialType(specialType: SPECIAL_TYPE): void {
        this.specialType = specialType

        switch (specialType) {
            case SPECIAL_TYPE.NONE:
                this.setTexture(this.candyType)
                break
            case SPECIAL_TYPE.VERTICAL_STRIPED:
                this.setTexture(`${this.candyType}-${this.specialType}`)
                break
            case SPECIAL_TYPE.HORIZONTAL_STRIPED:
                this.setTexture(`${this.candyType}-${this.specialType}`)
                break
            case SPECIAL_TYPE.COLOR_BOMB:
                this.setTexture('color')
                break
        }
    }

    public getCandyType(): CANDY_TYPE {
        return this.candyType
    }

    public setCandyType(candyType: CANDY_TYPE): void {
        this.candyType = candyType
    }

    destroy(fromScene?: boolean | undefined): void {
        this.playExplodeEffect()
        super.destroy(fromScene)
    }
}
