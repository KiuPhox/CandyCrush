import CandyGrid from './CandyGrid'
import { BoardState } from '../../constants/BoardState'
import Candy from '../../objects/Candy'
import GameScene from '../../scenes/GameScene'
import BoardManager from '../BoardManager'
import { BlendModes } from 'phaser'

class CandySwapper {
    private static scene: GameScene
    private static swapEffects: Phaser.GameObjects.Image[]

    public static init(scene: GameScene) {
        this.scene = scene
        this.swapEffects = []

        for (let i = 0; i < 2; i++) {
            this.swapEffects.push(
                this.scene.add
                    .image(0, 0, 'particle-3')
                    .setDepth(1)
                    .setScale(0)
                    .setBlendMode(BlendModes.ADD)
            )
        }
    }

    public static swapCandiesInternal(
        firstPos: Phaser.Math.Vector2,
        secondPos: Phaser.Math.Vector2
    ): void {
        const grid = CandyGrid.grid
        if (firstPos && secondPos) {
            const { x: x1, y: y1 } = firstPos
            const { x: x2, y: y2 } = secondPos
            const candyA = grid[y1][x1]
            const candyB = grid[y2][x2]

            const temp = candyA
            grid[y1][x1] = candyB
            grid[y2][x2] = temp

            if (candyA) {
                candyA.setGrid(x2, y2)
            }
            if (candyB) {
                candyB.setGrid(x1, y1)
            }
        }
    }

    public static swapCandies(firstCandy: Candy, secondCandy: Candy, onComplete: () => void): void {
        BoardManager.updateState(BoardState.SWAP)

        const a = new Phaser.Math.Vector2(firstCandy.gridX, firstCandy.gridY)
        const b = new Phaser.Math.Vector2(secondCandy.gridX, secondCandy.gridY)
        const firstPos = CandyGrid.getCandyWorldPos(firstCandy)
        const secondPos = CandyGrid.getCandyWorldPos(secondCandy)

        this.swapCandiesInternal(a, b)
        // Move them on the screen with tweens

        this.swapEffects[0].setPosition(firstCandy.x, firstCandy.y)
        this.swapEffects[1].setPosition(secondCandy.x, secondCandy.y)

        this.scene.add.tween({
            targets: this.swapEffects,
            scale: { from: 1, to: 0 },
            alpha: { from: 1, to: 0 },
            duration: 200,
            ease: 'Quad.in',
        })

        this.scene.add.tween({
            targets: [firstCandy, this.swapEffects[0]],
            x: secondPos.x,
            y: secondPos.y,
            ease: 'Quad.out',
            duration: 200,
        })

        this.scene.add.tween({
            targets: [secondCandy, this.swapEffects[1]],
            x: firstPos.x,
            y: firstPos.y,
            ease: 'Quad.out',
            duration: 200,
            onComplete: () => {
                onComplete()
            },
        })
    }
}

export default CandySwapper
