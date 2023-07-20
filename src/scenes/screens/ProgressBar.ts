import { BlendModes } from 'phaser'
import ScoreManager from '../../managers/ScoreManager'

class ProgressBar extends Phaser.GameObjects.Container {
    private progressFill: Phaser.GameObjects.Image
    private currentProgress: number
    private particleEmitter: Phaser.GameObjects.Particles.ParticleEmitter

    private progressBitmapText: Phaser.GameObjects.BitmapText

    constructor(scene: Phaser.Scene) {
        super(scene)
        scene.add.existing(this)

        this.createProgressbar()
        this.createParticleEmitter()
        this.createProgressBitmapText()

        ScoreManager.emitter.on('score-updated', this.onScoreUpdated)
    }

    private createParticleEmitter(): void {
        this.particleEmitter = this.scene.add.particles(0, 0, 'particle-2', {
            color: [0xb6eafa],
            scale: { min: 2, max: 3 },
            lifespan: 200,
            alpha: { start: 1, end: 0, ease: 'Quad.in' },
            rotate: { start: 0, end: 2000, random: true },
            angle: { min: 120, max: 240 },
            speed: 500,
            radial: true,
            frequency: 15,
            blendMode: BlendModes.ADD,
        })

        this.particleEmitter.setPosition(
            this.progressFill.getRightCenter().x,
            this.progressFill.getRightCenter().y
        )

        this.add(this.particleEmitter)
    }

    private createProgressbar(): void {
        this.currentProgress = 1
        this.add(this.scene.add.image(-350, 0, 'progress-head'))
        this.progressFill = this.scene.add
            .image(-350, 0, 'progress-fill')
            .setOrigin(0, 0.5)
            .setScale(this.currentProgress, 1)
        this.add(this.progressFill)
    }

    private createProgressBitmapText(): void {
        this.progressBitmapText = this.scene.add
            .bitmapText(0, 0, 'bananasp', '0%')
            .setOrigin(0.5)
            .setTint(0xf6c964, 0xf6c964, 0xe37e26, 0xe37e26)
            .setDropShadow(10, 10, 0x000000, 0.1)

        this.add(this.progressBitmapText)
    }

    public updateProgress(progress: number): void {
        if (progress <= 100) {
            this.scene.tweens.addCounter({
                from: this.currentProgress,
                to: progress,
                duration: 300,
                onUpdate: (tween: Phaser.Tweens.Tween) => {
                    this.progressBitmapText.setText(tween.getValue().toFixed(2) + '%')
                },
            })

            this.currentProgress = progress

            this.scene.add.tween({
                targets: this.progressFill,
                scaleX: progress / 2,
                duration: 300,
                ease: 'Quad.out',
                onUpdate: () => {
                    this.particleEmitter.setPosition(
                        this.progressFill.getRightCenter().x,
                        this.progressFill.getRightCenter().y
                    )
                },
            })
        }
    }

    private onScoreUpdated = (currentScore: number, maxScore: number) => {
        this.updateProgress((currentScore / maxScore) * 100)
    }
}

export default ProgressBar
