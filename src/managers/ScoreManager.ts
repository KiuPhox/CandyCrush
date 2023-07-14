class ScoreManager {
    private static currentScore: number
    private static maxScore: number

    public static emitter: Phaser.Events.EventEmitter

    public static init() {
        this.currentScore = 0
        this.maxScore = 100
        this.emitter = new Phaser.Events.EventEmitter()
    }

    public static addScore(score: number): void {
        this.currentScore += score
        this.emitter.emit('score-updated', this.currentScore, this.maxScore)
        if (this.currentScore >= this.maxScore) {
            this.emitter.emit('score-reached-max', this.currentScore, this.maxScore)
        }
    }
}

export default ScoreManager
