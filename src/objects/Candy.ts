import { CANDY_COLORS, CANDY_TYPE, SPECIAL_TYPE } from '../constants/CandyConstant'
import { ICandy } from '../types/tile'
import ParticleManager from '../managers/ParticleManager'
import ScoreManager from '../managers/ScoreManager'

export default class Candy extends Phaser.GameObjects.Sprite {
    private candyType: CANDY_TYPE
    private specialType: SPECIAL_TYPE
    private brightnessImage: Phaser.GameObjects.Image

    public gridX: number
    public gridY: number

    constructor(iCandy: ICandy) {
        super(iCandy.scene, iCandy.x, iCandy.y, 'candies', iCandy.candyType)
        this.gridX = iCandy.gridX
        this.gridY = iCandy.gridY
        this.candyType = iCandy.candyType
        this.setSpecialType(iCandy.specialType)

        this.setScale(0.35).setInteractive()
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
                this.setFrame(this.candyType)
                break
            case SPECIAL_TYPE.VERTICAL_STRIPED:
                this.setFrame(`${this.candyType}-${this.specialType}`)
                break
            case SPECIAL_TYPE.HORIZONTAL_STRIPED:
                this.setFrame(`${this.candyType}-${this.specialType}`)
                break
            case SPECIAL_TYPE.WRAPPED:
                this.setFrame(`${this.candyType}-${this.specialType}`)
                break
            case SPECIAL_TYPE.COLOR_BOMB:
                this.setFrame('color')
                break
        }

        if (this.brightnessImage) this.brightnessImage.setFrame(this.frame)
    }

    public getCandyType(): CANDY_TYPE {
        return this.candyType
    }

    public setCandyType(candyType: CANDY_TYPE): void {
        this.candyType = candyType
        this.setFrame(candyType)
        if (this.brightnessImage) this.brightnessImage.setFrame(candyType)
    }

    public setBrightnessEffect(value: number, active: boolean): void {
        if (active) {
            if (!this.brightnessImage)
                this.brightnessImage = this.scene.add
                    .image(this.x, this.y, 'candies', this.frame.name)
                    .setScale(0.35)
                    .setTintFill(0xffffff)

            this.brightnessImage
                .setPosition(this.x, this.y)
                .setAlpha(value)
                .setScale(this.scaleX, this.scaleY)
                .setVisible(true)
        } else {
            if (this.brightnessImage) this.brightnessImage.setAlpha(value).setVisible(false)
        }
    }

    public get isStriped(): boolean {
        return (
            this.specialType === SPECIAL_TYPE.HORIZONTAL_STRIPED ||
            this.specialType === SPECIAL_TYPE.VERTICAL_STRIPED
        )
    }

    destroy(fromScene?: boolean | undefined): void {
        this.playExplodeEffect()
        if (this.brightnessImage) this.brightnessImage.destroy()
        ScoreManager.addScore(1)
        super.destroy(fromScene)
    }
}
