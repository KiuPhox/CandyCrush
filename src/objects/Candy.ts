import { BlendModes } from 'phaser'
import { CANDY_COLORS, CANDY_TYPE } from '../const/CandyType'
import { ICandy } from '../types/tile'
import { Random } from '../utils/Random'

export default class Candy extends Phaser.GameObjects.Image {
    public candyType: CANDY_TYPE
    public gridX: number
    public gridY: number

    constructor(iCandy: ICandy) {
        super(iCandy.scene, iCandy.x, iCandy.y, iCandy.texture, iCandy.frame)
        this.gridX = iCandy.gridX
        this.gridY = iCandy.gridY
        this.candyType = iCandy.candyType

        this.setScale(0.7).setInteractive()

        this.scene.add.existing(this)
    }

    destroy(fromScene?: boolean | undefined): void {
        this.playDestroyEffect()
        super.destroy(fromScene)
    }

    private playDestroyEffect(): void {
        const { x, y } = this.getCenter()

        const p1 = this.scene.add.particles(x, y, 'particle-1', {
            color: [CANDY_COLORS[this.candyType]],
            lifespan: 500,
            angle: { min: 0, max: 360 },
            rotate: {
                start: Random.Float(0, 360),
                end: Random.Float(0, 360),
            },
            scale: {
                start: Random.Float(0.4, 0.5),
                end: 0,
                ease: 'Back.in',
            },
            speed: { min: 100, max: 120 },
            gravityY: 200,
            duration: 300,
            stopAfter: Phaser.Math.RND.between(2, 3),
        })

        const p2 = this.scene.add.particles(x, y, 'particle-2', {
            lifespan: 500,
            angle: { min: 0, max: 360 },
            rotate: {
                min: 0,
                max: 360,
                start: Random.Float(0, 360),
                end: Random.Float(0, 360),
            },
            scale: {
                start: Random.Float(1, 2),
                end: 0,
                ease: 'Back.in',
            },
            speed: { min: 100, max: 120 },
            gravityY: 200,
            duration: 300,
            blendMode: BlendModes.ADD,
            stopAfter: Phaser.Math.RND.between(3, 5),
        })

        const p3 = this.scene.add.particles(x, y, 'particle-3', {
            color: [CANDY_COLORS[this.candyType]],
            lifespan: 500,
            alpha: { start: 1, end: 0, ease: 'Quad.out' },
            scale: { start: 0, end: 1, ease: 'Quart.out' },
            duration: 300,
            blendMode: BlendModes.ADD,
            stopAfter: 1,
        })

        this.scene.time.delayedCall(800, () => {
            p1.destroy()
            p2.destroy()
            p3.destroy()
        })
    }

    public setGrid(x: number, y: number) {
        this.gridX = x
        this.gridY = y
    }
}
