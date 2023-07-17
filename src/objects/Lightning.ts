import { BlendModes } from 'phaser'

export class Lightning extends Phaser.GameObjects.Rope {
    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0, 'lightning')
        scene.add.existing(this)

        this.setDepth(5).setColors(0xb6eafa).setBlendMode(BlendModes.ADD).play('lightning')
    }

    public setLine(pointA: Phaser.Math.Vector2, pointB: Phaser.Math.Vector2) {
        this.points[0] = pointA
        this.points[this.points.length - 1] = pointB
    }
}
