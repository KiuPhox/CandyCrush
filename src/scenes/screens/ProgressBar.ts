export default class ProgressBar extends Phaser.GameObjects.Container {
    private progressFill: Phaser.GameObjects.Image
    private currentProgress: number

    constructor(scene: Phaser.Scene) {
        super(scene)
        scene.add.existing(this)

        this.createProgressbar()
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

    public getProgress(): number {
        return this.currentProgress
    }

    public updateProgress(progress: number) {
        if (progress <= 50) {
            this.currentProgress = progress
            this.scene.add.tween({
                targets: this.progressFill,
                scaleX: progress,
                duration: 200,
                ease: 'Quad.out',
            })
        }
    }
}
