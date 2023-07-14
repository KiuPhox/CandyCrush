import { BoardState } from '../const/BoardState'
import { GAME_CONFIG } from '../const/GameConfig'
import BoardStateMachine from '../managers/BoardStateMachine'
import CandyGrid from '../managers/candy-grid/CandyGrid'
import CandyMatcher from '../managers/candy-grid/CandyMatcher'
import CandyRemover from '../managers/candy-grid/CandyRemover'
import CandySelector from '../managers/candy-grid/CandySelector'
import ParticleManager from '../managers/ParticleManager'
import ScoreManager from '../managers/ScoreManager'
import Candy from '../objects/Candy'
import ProgressBar from './screens/ProgressBar'

export default class GameScene extends Phaser.Scene {
    private hintTween: Phaser.Tweens.Tween
    private idleTimer: number

    constructor() {
        super('GameScene')
    }

    init(): void {
        ParticleManager.init(this)
        CandyGrid.init(this)
        CandySelector.init(this)
        ScoreManager.init()
        BoardStateMachine.getInstance().emitter.on('board-state-changed', this.onBoardStateChanged)
        ScoreManager.emitter.on('score-reached-max', this.onScoreReachedMax)

        this.createProgressBar()

        this.cameras.main.setBackgroundColor(0x78aade)
        this.cameras.main.setZoom(11 / GAME_CONFIG.gridWidth)
        CandyGrid.create()
        this.tryGetHint()
        this.idleTimer = 5000
        this.anims.create({
            key: 'lightning',
            frames: this.anims.generateFrameNames('lightning', { prefix: '', start: 0, end: 60 }),
            frameRate: 30,
            yoyo: true,
            repeat: -1,
        })
    }

    private createProgressBar(): void {
        new ProgressBar(this)
            .setDepth(2)
            .setScale(0.5)
            .setPosition(
                this.scale.width / 2,
                CandyGrid.candyGridOffset.y - GAME_CONFIG.tileWidth / 2 - 50
            )
    }

    public checkMatches(): void {
        if (
            this.hintTween &&
            !this.hintTween.isDestroyed() &&
            BoardStateMachine.getInstance().getCurrentState() !== BoardState.SWAP
        ) {
            this.hintTween.stop()
            this.hintTween.destroy()
        }
        //Call the getMatches function to check for spots where there is
        //a run of three or more tiles in a row
        const matches = CandyMatcher.getMatches()

        //If there are matches, remove them
        if (matches.length > 0) {
            BoardStateMachine.getInstance().updateState(BoardState.MATCH)
            //Remove the tiles
            CandyRemover.removeCandyGroup(matches)
        } else {
            if (BoardStateMachine.getInstance().getCurrentState() === BoardState.FILL) {
                this.tryGetHint()
            }

            // No match so just swap the tiles back to their original position and reset

            CandyGrid.trySwapCandies(
                CandySelector.firstSelectedCandy,
                CandySelector.secondSelectedCandy
            )
            CandySelector.candyUp()

            this.tweens.addCounter({
                duration: 200,
                onComplete: () => {
                    BoardStateMachine.getInstance().updateState(BoardState.IDLE)
                },
            })
        }
    }

    public tryGetHint(): void {
        const hint = CandyGrid.getHints()[0]
        const glowFXs: Phaser.FX.Glow[] = []

        if (hint) {
            hint.candies.forEach((h: Candy) => {
                if (h.preFX) glowFXs.push(h.preFX?.addGlow())
            })

            this.hintTween = this.tweens.addCounter({
                duration: 300,
                repeat: -1,
                from: 0,
                to: 1,
                yoyo: true,
                onUpdate: (t) => {
                    hint.candies.forEach((h, i) => {
                        const bounce = Phaser.Math.Easing.Bounce.InOut(t.getValue())
                        const sine = Phaser.Math.Easing.Sine.InOut(t.getValue())
                        h.setScale(0.35 + bounce * (0.35 - 0.4), 0.35 + bounce * (0.35 - 0.3))
                        glowFXs[i].outerStrength = 2 + sine * 5
                    })
                },
                onStop: () => {
                    hint.candies.forEach((h, i) => {
                        glowFXs[i].outerStrength = 0
                        h.setScale(0.35)
                    })
                },
            })
        } else {
            CandyGrid.clear()
            CandyGrid.create()
            this.checkMatches()
            this.tryGetHint()
        }
    }

    private onBoardStateChanged = (boardState: BoardState) => {
        switch (boardState) {
            case BoardState.IDLE:
                break
            case BoardState.FILL:
                break
        }
    }

    private onScoreReachedMax = (currentScore: number, maxScore: number) => {
        //
    }

    update(time: number, delta: number): void {
        if (BoardStateMachine.getInstance().getCurrentState() === BoardState.IDLE) {
            this.idleTimer -= delta
            if (this.idleTimer <= 0) {
                this.idleTimer = 3000
                CandyGrid.playIdleEffect()
            }
        } else {
            this.idleTimer = 5000
        }
    }
}
