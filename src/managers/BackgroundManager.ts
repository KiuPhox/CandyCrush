import GameScene from '../scenes/GameScene'
import { Random } from '../utils/Random'

class BackgroundManager {
    private static scene: GameScene
    private static background1: Phaser.GameObjects.Image
    private static background2: Phaser.GameObjects.Image

    public static init(scene: GameScene): void {
        this.scene = scene

        this.background1 = scene.add
            .image(scene.scale.width / 2, scene.scale.height / 2, `bg-${Random.Int(1, 14)}`)
            .setDepth(-1)
        this.background1.setScale(scene.scale.height / this.background1.displayHeight)

        this.background2 = scene.add
            .image(scene.scale.width / 2, scene.scale.height / 2, `bg-${Random.Int(1, 14)}`)
            .setDepth(-1)
        this.background2.setScale(scene.scale.height / this.background2.displayHeight)
    }

    public static changeBackground(): void {
        const bgTextureKey = this.background1.texture.key

        this.scene.add.tween({
            targets: this.background2,
            alpha: 0,
            duration: 2000,
            onComplete: () => {
                this.background2.setTexture(bgTextureKey)
                this.background2.setAlpha(1)
                this.background1.setTexture(`bg-${Random.Int(1, 14)}`)
            },
        })
    }
}

export default BackgroundManager
