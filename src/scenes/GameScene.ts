import { BoardState } from '../constants/BoardState'
import { GAME_CONFIG } from '../constants/GameConfig'
import BackgroundManager from '../managers/BackgroundManager'
import BoardManager from '../managers/BoardManager'
import CandyGrid from '../managers/candy-grid/CandyGrid'
import CandyMatcher from '../managers/candy-grid/CandyMatcher'
import CandyRemover from '../managers/candy-grid/CandyRemover'
import CandySelector from '../managers/candy-grid/CandySelector'
import ParticleManager from '../managers/ParticleManager'
import ScoreManager from '../managers/ScoreManager'
import Candy from '../objects/Candy'
import ProgressBar from './screens/ProgressBar'

class GameScene extends Phaser.Scene {
    private hintTween: Phaser.Tweens.Tween
    private idleTimer: number
    private levelClear: boolean
    private currentLevel: number
    private debug: boolean

    constructor() {
        super('GameScene')
    }

    init(): void {
        BackgroundManager.init(this)
        ParticleManager.init(this)
        CandyGrid.init(this)
        ScoreManager.init()
        BoardManager.init()
    }

    create(): void {
        CandyGrid.create()
        this.createProgressBar()

        this.cameras.main.setBackgroundColor(0x78aade)
        this.idleTimer = 5000
        this.levelClear = false
        this.debug = false
        this.currentLevel = 1
        this.anims.create({
            key: 'lightning',
            frames: this.anims.generateFrameNames('lightning', { prefix: '', start: 0, end: 60 }),
            frameRate: 30,
            yoyo: true,
            repeat: -1,
        })

        console.log('Debug mode is currently inactive. To toggle debug mode, press the D key')

        this.input.keyboard?.on('keydown-D', () => {
            this.debug = !this.debug
            console.log('Debugging: ' + this.debug)
        })

        BoardManager.emitter.on('board-state-changed', this.onBoardStateChanged)
        ScoreManager.emitter.on('score-reached-max', this.onScoreReachedMax)
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
        //Call the getMatches function to check for spots where there is
        //a run of three or more tiles in a row
        const matches = CandyMatcher.getMatches()

        //If there are matches, remove them
        if (matches.length > 0) {
            BoardManager.updateState(BoardState.MATCH)
            //Remove the tiles
            CandyRemover.removeCandyGroup(matches)
        } else if (this.levelClear) {
            this.currentLevel++
            this.levelClear = false
            ScoreManager.reset(this.currentLevel)
            CandyGrid.shuffle()
        } else {
            // No match so just swap the tiles back to their original position and reset
            if (!this.debug) {
                CandyGrid.trySwapCandies(
                    CandySelector.firstSelectedCandy,
                    CandySelector.secondSelectedCandy
                )
            }

            CandySelector.candyUp()

            this.tweens.addCounter({
                duration: 200,
                onComplete: () => {
                    BoardManager.updateState(BoardState.IDLE)
                },
            })
        }
    }

    public tryGetHint(): void {
        if (
            this.hintTween &&
            !this.hintTween.isDestroyed() &&
            BoardManager.getCurrentState() !== BoardState.SWAP
        ) {
            this.hintTween.stop()
            this.hintTween.destroy()
        }

        const hint = CandyGrid.getHint()

        if (hint) {
            hint.candies.forEach((h: Candy) => {
                h.setBrightnessEffect(0, true)
            })

            this.hintTween = this.tweens.addCounter({
                duration: 300,
                repeat: -1,
                from: 0,
                to: 1,
                yoyo: true,
                onUpdate: (t) => {
                    hint.candies.forEach((h: Candy) => {
                        const sine = Phaser.Math.Easing.Sine.InOut(t.getValue())
                        h.setBrightnessEffect(sine * 0.4, true)
                        h.setScale(0.35 + sine * (0.35 - 0.38), 0.35 + sine * (0.35 - 0.32))
                    })
                },
                onStop: () => {
                    hint.candies.forEach((h: Candy) => {
                        h.setBrightnessEffect(0, false)
                        h.setScale(0.35)
                    })
                },
            })
        } else {
            CandyGrid.shuffle()
        }
    }

    private onBoardStateChanged = (boardState: BoardState) => {
        switch (boardState) {
            case BoardState.CREATE:
                BackgroundManager.changeBackground()
                break
            case BoardState.IDLE:
                this.tryGetHint()
                break
            case BoardState.SWAP:
                if (this.hintTween && !this.hintTween.isDestroyed()) {
                    this.hintTween.stop()
                    this.hintTween.destroy()
                }
                break
            case BoardState.LEVEL_CLEAR:
                if (this.hintTween && !this.hintTween.isDestroyed()) {
                    this.hintTween.stop()
                    this.hintTween.destroy()
                }
                break
        }
    }

    private onScoreReachedMax = () => {
        ParticleManager.playConfettiEffect()
        this.levelClear = true
    }

    update(time: number, delta: number): void {
        if (BoardManager.getCurrentState() === BoardState.IDLE) {
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

export default GameScene
