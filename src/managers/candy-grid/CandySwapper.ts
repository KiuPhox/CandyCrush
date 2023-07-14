import { BlendModes } from 'phaser'
import CandyGrid from './CandyGrid'
import { BoardState } from '../../const/BoardState'
import Candy from '../../objects/Candy'
import GameScene from '../../scenes/GameScene'
import BoardStateMachine from '../BoardStateMachine'

class CandySwapper {
    private static scene: GameScene
    private static swapEffects: Phaser.GameObjects.Particles.ParticleEmitter[]

    public static init(scene: GameScene) {
        this.scene = scene
        this.swapEffects = []
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
        BoardStateMachine.getInstance().updateState(BoardState.SWAP)

        const a = new Phaser.Math.Vector2(firstCandy.gridX, firstCandy.gridY)
        const b = new Phaser.Math.Vector2(secondCandy.gridX, secondCandy.gridY)

        this.swapCandiesInternal(a, b)

        this.swapEffects.forEach((swapEffect) => swapEffect.destroy())
        // Add particle when candies move

        const p1 = this.scene.add.particles(32, 32, 'particle-3', {
            lifespan: 500,
            alpha: { start: 1, end: 0, ease: 'Quad.out' },
            scale: { start: 1, end: 0, ease: 'Quad.out' },
            duration: 200,
            blendMode: BlendModes.ADD,
            stopAfter: 1,
        })

        const p2 = this.scene.add.particles(32, 32, 'particle-3', {
            lifespan: 500,
            alpha: { start: 1, end: 0, ease: 'Quad.out' },
            scale: { start: 1, end: 0, ease: 'Quad.out' },
            duration: 200,
            blendMode: BlendModes.ADD,
            stopAfter: 1,
        })

        this.swapEffects.push(...[p1, p2])
        // Move them on the screen with tweens

        this.scene.add.tween({
            targets: firstCandy,
            x: secondCandy.x,
            y: secondCandy.y,
            ease: 'Quad.out',
            duration: 200,
            repeat: 0,
            yoyo: false,
            onUpdate: (tween: Phaser.Tweens.Tween, candy: Candy) => {
                p1.x = candy.getCenter().x ?? 0
                p1.y = candy.getCenter().y ?? 0
            },
        })

        this.scene.add.tween({
            targets: secondCandy,
            x: firstCandy.x,
            y: firstCandy.y,
            ease: 'Quad.out',
            duration: 200,
            repeat: 0,
            yoyo: false,
            onUpdate: (tween: Phaser.Tweens.Tween, candy: Candy) => {
                p2.x = candy.getCenter().x ?? 0
                p2.y = candy.getCenter().y ?? 0
            },
            onComplete: () => {
                onComplete()
            },
        })
    }
}

export default CandySwapper
