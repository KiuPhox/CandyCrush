import { BoardState } from '../const/BoardState'
import { GAME_CONFIG } from '../const/GameConfig'
import BoardStateMachine from '../managers/BoardStateMachine'
import CandyGrid from '../managers/CandyGrid'
import CandySelection from '../managers/CandySelection'

export default class GameScene extends Phaser.Scene {
    private hintTween: Phaser.Tweens.Tween
    constructor() {
        super('GameScene')
    }

    init(): void {
        CandyGrid.init(this)
        CandySelection.init(this)

        // set background color
        this.cameras.main.setBackgroundColor(0x78aade)
        this.add
            .rectangle(
                0,
                0,
                this.scale.width,
                CandyGrid.candyGridOffset.y - GAME_CONFIG.tileWidth / 2,
                0x78aade
            )
            .setOrigin(0)
            .setDepth(1)

        CandyGrid.create()

        // Check if matches on the start
        this.checkMatches()
    }

    public checkMatches(): void {
        if (
            this.hintTween &&
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
                const hint = CandyGrid.getHints()[0]

                const defaultY: number[] = []
                hint.forEach((h) => defaultY.push(h.y))

                this.hintTween = this.tweens.addCounter({
                    duration: 300,
                    repeat: -1,
                    from: 0,
                    to: 1,
                    yoyo: true,
                    onUpdate: (t) => {
                        hint.forEach((h, i) => {
                            const bounce = Phaser.Math.Easing.Bounce.InOut(t.getValue())
                            const quart = Phaser.Math.Easing.Quartic.In(t.getValue())
                            h.setScale(0.7 + bounce * (0.7 - 0.75), 0.7 + bounce * (0.7 - 0.65))
                            // h.y = defaultY[i] + quart * 10
                        })
                    },
                    onStop: () => {
                        hint.forEach((h) => {
                            h.setScale(0.7)
                        })
                    },
                })

                // this.hintTween = this.add.tween({
                //     targets: hint,
                //     scaleX: 0.65,
                //     scaleY: 0.75,
                //     y: '-=5',
                //     duration: 300,
                //     repeat: -1,
                //     ease: 'Quart.in',
                //     yoyo: true,
                //     onStop: () => {
                //         hint.forEach((h) => {
                //             h.setScale(0.7)
                //         })
                //     },
                // })
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
}
