import { BoardState } from '../const/BoardState'
import BoardStateMachine from '../managers/BoardStateMachine'
import CandyGrid from '../managers/CandyGrid'
import CandySelection from '../managers/CandySelection'

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene')
    }

    init(): void {
        CandyGrid.init(this)
        CandySelection.init(this)

        // set background color
        this.cameras.main.setBackgroundColor(0x78aade)
        this.add
            .rectangle(0, 0, this.scale.width, CandyGrid.candyGridOffset.y, 0x78aade)
            .setOrigin(0)
            .setDepth(1)

        CandyGrid.create()

        // Check if matches on the start
        this.checkMatches()
    }

    public checkMatches(): void {
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
