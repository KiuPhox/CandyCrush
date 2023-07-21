import { BoardState } from '../../constants/BoardState'
import Candy from '../../objects/Candy'
import GameScene from '../../scenes/GameScene'
import BoardManager from '../BoardManager'
import CandyGrid from './CandyGrid'

class CandySelector {
    private static scene: GameScene

    public static firstSelectedCandy: Candy | undefined
    public static secondSelectedCandy: Candy | undefined

    private static selectedFrame: Phaser.GameObjects.Image

    public static init(scene: GameScene) {
        this.scene = scene
        this.firstSelectedCandy = undefined
        this.secondSelectedCandy = undefined
        this.selectedFrame = scene.add
            .image(0, 0, 'selected-frame')
            .setScale(0.6)
            .setVisible(false)
            .setDepth(5)

        scene.add.tween({
            targets: this.selectedFrame,
            scale: 0.65,
            duration: 600,
            repeat: -1,
            yoyo: true,
        })
        scene.input.on('gameobjectdown', this.candyDown, scene)
    }

    private static candyDown = (pointer: PointerEvent, gameobject: Candy | undefined) => {
        if (BoardManager.getCurrentState() === BoardState.IDLE && gameobject) {
            if (!this.firstSelectedCandy) {
                this.firstSelectedCandy = gameobject
                this.setFramePosition(this.firstSelectedCandy)
            } else if (this.firstSelectedCandy === gameobject) {
                this.firstSelectedCandy = undefined
                this.selectedFrame.setVisible(false)
            } else {
                this.secondSelectedCandy = gameobject

                const dx = Math.abs(this.firstSelectedCandy.gridX - this.secondSelectedCandy.gridX)
                const dy = Math.abs(this.firstSelectedCandy.gridY - this.secondSelectedCandy.gridY)

                if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
                    BoardManager.updateState(BoardState.SWAP)
                    CandyGrid.trySwapCandies(this.firstSelectedCandy, this.secondSelectedCandy)
                } else {
                    this.firstSelectedCandy = undefined
                }
                this.selectedFrame.setVisible(false)
            }
        }
    }

    private static setFramePosition(candy: Candy): void {
        const pos = CandyGrid.getCandyWorldPos(candy)
        this.selectedFrame.setPosition(pos.x, pos.y).setVisible(true)
    }

    public static candyUp(): void {
        this.firstSelectedCandy = undefined
        this.secondSelectedCandy = undefined
    }
}

export default CandySelector
