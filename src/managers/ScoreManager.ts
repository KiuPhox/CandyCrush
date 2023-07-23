class ScoreManager {
    private static currentScore: number
    private static maxScore: number

    public static emitter: Phaser.Events.EventEmitter

    public static init(): void {
        this.currentScore = 0
        this.maxScore = 100
        this.emitter = new Phaser.Events.EventEmitter()
    }

    public static reset(newLevel: number): void {
        this.maxScore = 100 * newLevel
        this.currentScore = 0
        this.emitter.emit('score-updated', this.currentScore, this.maxScore)
    }

    public static addScore(score: number): void {
        if (this.currentScore >= this.maxScore) return

        this.currentScore += score
        this.emitter.emit('score-updated', this.currentScore, this.maxScore)
        if (this.currentScore >= this.maxScore) {
            this.emitter.emit('score-reached-max', this.currentScore, this.maxScore)
        }
    }
}

export default ScoreManager
