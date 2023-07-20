import Candy from '../../objects/Candy'
import GameScene from '../../scenes/GameScene'
import { CANDY_COLORS, CANDY_TYPE, SPECIAL_TYPE } from '../../constants/CandyConstant'
import { Lightning } from '../../objects/Lightning'
import ScoreManager from '../ScoreManager'
import ParticleManager from '../ParticleManager'
import { IMatch } from '../../types/match'
import { Random } from '../../utils/Random'
import BoardStateMachine from '../BoardStateMachine'
import CandySelector from './CandySelector'
import CandyGrid from './CandyGrid'
import { BoardState } from '../../constants/BoardState'

export class CandyRemover {
    private static scene: GameScene

    public static init(scene: GameScene): void {
        this.scene = scene
    }

    public static removeCandy(candy: Candy, delay?: number): void {
        CandyGrid.grid[candy.gridY][candy.gridX] = undefined
        if (!delay) {
            candy.destroy()
        } else {
            this.scene.tweens.addCounter({
                duration: delay,
                onComplete: () => {
                    candy.destroy()
                },
            })
        }
    }

    public static removeColorCandyByColorBomb(
        bombCandy: Candy,
        candyType: CANDY_TYPE,
        delay: number
    ): number {
        for (let i = 0; i < CandyGrid.grid.length; i++) {
            for (let j = 0; j < CandyGrid.grid[i].length; j++) {
                const candy = CandyGrid.grid[i][j]
                if (candy && candy.getCandyType() === candyType) {
                    delay = Math.max(delay, (j + 1) * 100 + 200)
                    this.lightningCandy(bombCandy, candy, j * 100, () => {
                        this.removeCandy(candy)
                    })
                }
                ScoreManager.addScore(1)
            }
        }
        return delay
    }

    private static getWrappedCandies(matches: IMatch[]): Candy[] {
        const candyCounts = new Map<Candy, number>()
        // Check for wrapped candy
        for (const match of matches) {
            for (const candy of match.candies) {
                const count = candyCounts.get(candy) || 0
                candyCounts.set(candy, count + 1)
            }
        }

        const wrappedCandies: Candy[] = []

        candyCounts.forEach((count: number, candy: Candy) => {
            if (count === 2) {
                wrappedCandies.push(candy)
            }
        })

        return wrappedCandies
    }

    public static removeCandyGroup(matches: IMatch[]): void {
        const candiesToRemove: Set<Candy> = new Set<Candy>()
        const wrappedCandies = this.getWrappedCandies(matches)

        let removeDelay = 0

        const removeCandyByStriped = (
            stripedCandy: Candy,
            removedCandy: Candy | undefined,
            delay: number
        ) => {
            if (
                removedCandy &&
                (removedCandy.getSpecialType() === SPECIAL_TYPE.NONE ||
                    removedCandy === stripedCandy)
            ) {
                removeDelay = Math.max(removeDelay, delay)
                this.scene.tweens.addCounter({
                    duration: delay,
                    onComplete: () => {
                        candiesToRemove.delete(removedCandy)
                        this.removeCandy(removedCandy)
                        ParticleManager.playCandyExplodeByStriped(
                            CandyGrid.getCandyWorldPos(removedCandy).x,
                            CandyGrid.getCandyWorldPos(removedCandy).y,
                            stripedCandy.getSpecialType(),
                            CANDY_COLORS[stripedCandy.getCandyType()]
                        )
                    },
                })
            } else if (removedCandy && removedCandy.getSpecialType() === SPECIAL_TYPE.COLOR_BOMB) {
                removeDelay = this.removeColorCandyByColorBomb(
                    removedCandy,
                    stripedCandy.getCandyType(),
                    removeDelay
                )
                candiesToRemove.delete(removedCandy)
                this.removeCandy(removedCandy, removeDelay)
            } else if (removedCandy && removedCandy !== stripedCandy) {
                candiesToRemove.add(removedCandy)
            }
        }

        for (const match of matches) {
            for (let i = 0; i < match.candies.length; i++) {
                const candy = match.candies[i]
                // Wrapped Candy
                if (wrappedCandies.indexOf(candy) !== -1) {
                    const othersCandy = [...match.candies]
                    othersCandy.splice(i)
                    this.scene.add.tween({
                        targets: othersCandy,
                        x: candy.x,
                        y: candy.y,
                        duration: 50,
                        ease: 'Quad.out',
                    })
                    candy.setSpecialType(SPECIAL_TYPE.WRAPPED)
                    candiesToRemove.delete(candy)
                    match.type = 'wrapped'
                } else {
                    candiesToRemove.add(candy)
                }
            }

            // Match 4
            if (match.candies.length === 4 && match.type !== 'wrapped') {
                // If there are any selected candy, that candy will become a striped candy else choose random candy in the match
                let stripedCandyIndex = Random.Percent(50) ? 1 : 2

                if (
                    CandySelector.firstSelectedCandy &&
                    match.candies.indexOf(CandySelector.firstSelectedCandy) !== -1
                ) {
                    stripedCandyIndex = match.candies.indexOf(CandySelector.firstSelectedCandy)
                } else if (
                    CandySelector.secondSelectedCandy &&
                    match.candies.indexOf(CandySelector.secondSelectedCandy) !== -1
                ) {
                    stripedCandyIndex = match.candies.indexOf(CandySelector.secondSelectedCandy)
                }

                // Remove the striped candy from the list
                const otherCandies = [...match.candies]
                otherCandies.splice(stripedCandyIndex)

                const stripedCandy: Candy = match.candies[stripedCandyIndex]

                ParticleManager.playCandyExplodeEffect(
                    stripedCandy.x,
                    stripedCandy.y,
                    CANDY_COLORS[stripedCandy.getCandyType()]
                )

                stripedCandy.setSpecialType(
                    match.type === 'horizontal'
                        ? SPECIAL_TYPE.VERTICAL_STRIPED
                        : SPECIAL_TYPE.HORIZONTAL_STRIPED
                )

                // Move others candies to the striped candy

                this.scene.add.tween({
                    targets: otherCandies,
                    x: stripedCandy.x,
                    y: stripedCandy.y,
                    duration: 50,
                    ease: 'Quad.out',
                })

                candiesToRemove.delete(stripedCandy)
            } else if (match.candies.length === 5) {
                const candy: Candy = match.candies[2]

                candy.setCandyType(CANDY_TYPE.COLOR)
                candy.setSpecialType(SPECIAL_TYPE.COLOR_BOMB)
                candiesToRemove.delete(candy)

                ParticleManager.playCandyExplodeEffect(
                    candy.x,
                    candy.y,
                    CANDY_COLORS[candy.getCandyType()]
                )

                const otherCandies = [...match.candies]
                otherCandies.splice(2)

                this.scene.add.tween({
                    targets: otherCandies,
                    x: candy.x,
                    y: candy.y,
                    duration: 50,
                    ease: 'Quad.out',
                })
            }
        }

        for (const candy of candiesToRemove) {
            if (candy.getSpecialType() === SPECIAL_TYPE.HORIZONTAL_STRIPED) {
                this.scene.cameras.main.shake(100, 0.02)

                for (let i = candy.gridX; i >= 0; i--) {
                    const c = CandyGrid.grid[candy.gridY][i]
                    removeCandyByStriped(candy, c, 30 * (candy.gridX - i + 1))
                }
                for (let i = candy.gridX + 1; i < CandyGrid.grid[candy.gridY].length; i++) {
                    const c = CandyGrid.grid[candy.gridY][i]
                    removeCandyByStriped(candy, c, 30 * (i + 1 - candy.gridX))
                }
                ScoreManager.addScore(8)
            } else if (candy.getSpecialType() === SPECIAL_TYPE.VERTICAL_STRIPED) {
                this.scene.cameras.main.shake(100, 0.02)

                for (let i = candy.gridY; i >= 0; i--) {
                    const c = CandyGrid.grid[i][candy.gridX]
                    removeCandyByStriped(candy, c, 30 * (candy.gridY - i + 1))
                }

                for (let i = candy.gridY + 1; i < CandyGrid.grid.length; i++) {
                    const c = CandyGrid.grid[i][candy.gridX]
                    removeCandyByStriped(candy, c, 30 * (i + 1 - candy.gridY))
                }
                ScoreManager.addScore(8)
            } else if (candy.getSpecialType() === SPECIAL_TYPE.WRAPPED) {
                this.scene.cameras.main.shake(100, 0.02)
                ParticleManager.playWrappedExplode(
                    candy.x,
                    candy.y,
                    CANDY_COLORS[candy.getCandyType()]
                )
                const neighborCandies = CandyGrid.getNeighborCandies(candy)
                for (const neighborCandy of neighborCandies) {
                    if (neighborCandy.getSpecialType() === SPECIAL_TYPE.NONE) {
                        candiesToRemove.delete(neighborCandy)
                        this.removeCandy(neighborCandy, 0)
                    } else if (neighborCandy.getSpecialType() === SPECIAL_TYPE.COLOR_BOMB) {
                        removeDelay = this.removeColorCandyByColorBomb(
                            neighborCandy,
                            candy.getCandyType(),
                            removeDelay
                        )
                        candiesToRemove.delete(neighborCandy)
                        this.removeCandy(neighborCandy, removeDelay)
                    } else {
                        candiesToRemove.add(neighborCandy)
                    }
                }
                ScoreManager.addScore(neighborCandies.length)
            }
        }

        this.scene.time.delayedCall(removeDelay + 50, () => {
            BoardStateMachine.getInstance().updateState(BoardState.FILL)
            ScoreManager.addScore(candiesToRemove.size)
            // Loop through all the matches and remove the associated candies
            for (const candy of candiesToRemove) {
                if (candy && CandyGrid.grid[candy.gridY][candy.gridX]) {
                    this.removeCandy(candy)
                }
            }

            CandyGrid.resetCandy()
            CandyGrid.fillCandy().then(() => {
                CandySelector.candyUp()
                this.scene.checkMatches()
            })
        })
    }

    public static lightningCandy(
        source: Candy,
        target: Candy,
        delay: number,
        onLightningTouch?: () => void
    ) {
        const lightning = new Lightning(this.scene).setVisible(false)
        lightning.setLine(
            new Phaser.Math.Vector2(source.x, source.y),
            new Phaser.Math.Vector2(target.x, target.y)
        )
        this.scene.tweens.addCounter({
            duration: delay,
            onComplete: () => {
                if (onLightningTouch) {
                    onLightningTouch()
                }
                lightning.setVisible(true)
                this.scene.tweens.addCounter({
                    duration: 200,
                    onComplete: () => {
                        lightning.destroy()
                    },
                })
            },
        })
    }
}

export default CandyRemover
