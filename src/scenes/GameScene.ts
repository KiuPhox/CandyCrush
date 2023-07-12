import { BoardState } from '../const/BoardState'
import { GAME_CONFIG } from '../const/GameConfig'
import BoardStateMachine from '../managers/BoardStateMachine'
import CandyGrid from '../managers/CandyGrid'
import CandySelection from '../managers/CandySelection'
import { ParticleManager } from '../managers/ParticleManager'
import ProgressBar from './screens/ProgressBar'

export default class GameScene extends Phaser.Scene {
    private hintTween: Phaser.Tweens.Tween
    private progressBar: ProgressBar
    private rectangleMask: Phaser.GameObjects.Rectangle

    private idleTimer: number

    constructor() {
        super('GameScene')
    }

    init(): void {
        ParticleManager.init(this)
        CandyGrid.init(this)
        CandySelection.init(this)

        this.createRectangleMask()
        this.progressBar = new ProgressBar(this)
            .setDepth(2)
            .setScale(0.5)
            .setPosition(this.rectangleMask.getCenter().x, this.rectangleMask.getCenter().y)
        this.cameras.main.setBackgroundColor(0x78aade)
        CandyGrid.create()
        this.tryGetHint()
        this.idleTimer = 5000
    }

    private createRectangleMask(): void {
        this.rectangleMask = this.add
            .rectangle(
                0,
                0,
                this.scale.width,
                CandyGrid.candyGridOffset.y - GAME_CONFIG.tileWidth / 2,
                0x78aade
            )
            .setOrigin(0)
            .setDepth(1)
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
        const matches = CandyGrid.getMatches()

        //If there are matches, remove them
        if (matches.length > 0) {
            this.progressBar.updateProgress(this.progressBar.getProgress() + 1)
            BoardStateMachine.getInstance().updateState(BoardState.MATCH)
            //Remove the tiles
            CandyGrid.removeCandyGroup(matches)
            // Move the tiles currently on the board into their new positions
            CandyGrid.resetCandy()
            CandyGrid.fillCandy().then(() => {
                //Fill the board with new tiles wherever there is an empty spot
                CandySelection.candyUp()
                this.checkMatches()
            })
        } else {
            if (BoardStateMachine.getInstance().getCurrentState() === BoardState.MATCH) {
                this.tryGetHint()
            }

            // No match so just swap the tiles back to their original position and reset

            CandyGrid.swapCandies(
                CandySelection.firstSelectedCandy,
                CandySelection.secondSelectedCandy
            )
            CandySelection.candyUp()

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

        const defaultY: number[] = []
        if (hint) {
            hint.candies.forEach((h) => defaultY.push(h.y))

            this.hintTween = this.tweens.addCounter({
                duration: 300,
                repeat: -1,
                from: 0,
                to: 1,
                yoyo: true,
                onUpdate: (t) => {
                    hint.candies.forEach((h, i) => {
                        const bounce = Phaser.Math.Easing.Bounce.InOut(t.getValue())
                        //const quart = Phaser.Math.Easing.Quartic.In(t.getValue())
                        h.setScale(0.7 + bounce * (0.7 - 0.75), 0.7 + bounce * (0.7 - 0.65))
                        // h.y = defaultY[i] + quart * 10
                    })
                },
                onStop: () => {
                    hint.candies.forEach((h) => {
                        h.setScale(0.7)
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
