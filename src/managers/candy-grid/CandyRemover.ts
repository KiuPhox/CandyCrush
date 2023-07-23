import Candy from '../../objects/Candy'
import GameScene from '../../scenes/GameScene'
import { CANDY_COLORS, CANDY_TYPE, SPECIAL_TYPE } from '../../constants/CandyConstant'
import Lightning from '../../objects/Lightning'
import ParticleManager from '../ParticleManager'
import { IMatch } from '../../types/match'
import { Random } from '../../utils/Random'
import BoardManager from '../BoardManager'
import CandySelector from './CandySelector'
import CandyGrid from './CandyGrid'
import { BoardState } from '../../constants/BoardState'
import { CandyRemoveSet } from '../../types/general'

class CandyRemover {
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

    public static removeCandyByStriped(
        stripedCandy: Candy,
        removedCandy: Candy | undefined,
        delay: number,
        candyRemoveSet: CandyRemoveSet
    ): void {
        if (
            removedCandy &&
            (removedCandy.getSpecialType() === SPECIAL_TYPE.NONE || removedCandy === stripedCandy)
        ) {
            candyRemoveSet.removeDelay = Math.max(candyRemoveSet.removeDelay, delay)
            this.scene.tweens.addCounter({
                duration: delay,
                onComplete: () => {
                    candyRemoveSet.candiesToRemove.delete(removedCandy)
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
            candyRemoveSet.removeDelay = this.removeColorCandyByColorBomb(
                removedCandy,
                stripedCandy.getCandyType(),
                candyRemoveSet.removeDelay
            )
            candyRemoveSet.candiesToRemove.delete(removedCandy)
            this.removeCandy(removedCandy, candyRemoveSet.removeDelay)
        } else if (removedCandy && removedCandy !== stripedCandy) {
            candyRemoveSet.candiesToRemove.add(removedCandy)
        }
    }

    public static processCandiesToRemove(candyRemoveSet: CandyRemoveSet): void {
        for (const candyToRemove of candyRemoveSet.candiesToRemove) {
            if (candyToRemove.getSpecialType() === SPECIAL_TYPE.HORIZONTAL_STRIPED) {
                this.scene.cameras.main.shake(100, 0.02)

                for (let i = candyToRemove.gridX; i >= 0; i--) {
                    const candyRemoveByStriped = CandyGrid.grid[candyToRemove.gridY][i]
                    this.removeCandyByStriped(
                        candyToRemove,
                        candyRemoveByStriped,
                        30 * (candyToRemove.gridX - i + 1),
                        candyRemoveSet
                    )
                }
                for (
                    let i = candyToRemove.gridX + 1;
                    i < CandyGrid.grid[candyToRemove.gridY].length;
                    i++
                ) {
                    const c = CandyGrid.grid[candyToRemove.gridY][i]
                    this.removeCandyByStriped(
                        candyToRemove,
                        c,
                        30 * (i + 1 - candyToRemove.gridX),
                        candyRemoveSet
                    )
                }
            } else if (candyToRemove.getSpecialType() === SPECIAL_TYPE.VERTICAL_STRIPED) {
                this.scene.cameras.main.shake(100, 0.02)

                for (let i = candyToRemove.gridY; i >= 0; i--) {
                    const candyRemoveByStriped = CandyGrid.grid[i][candyToRemove.gridX]
                    this.removeCandyByStriped(
                        candyToRemove,
                        candyRemoveByStriped,
                        30 * (candyToRemove.gridY - i + 1),
                        candyRemoveSet
                    )
                }

                for (let i = candyToRemove.gridY + 1; i < CandyGrid.grid.length; i++) {
                    const candyRemoveByStriped = CandyGrid.grid[i][candyToRemove.gridX]
                    this.removeCandyByStriped(
                        candyToRemove,
                        candyRemoveByStriped,
                        30 * (i + 1 - candyToRemove.gridY),
                        candyRemoveSet
                    )
                }
            } else if (candyToRemove.getSpecialType() === SPECIAL_TYPE.WRAPPED) {
                this.scene.cameras.main.shake(100, 0.02)
                ParticleManager.playWrappedExplode(
                    candyToRemove.x,
                    candyToRemove.y,
                    CANDY_COLORS[candyToRemove.getCandyType()]
                )
                const neighborCandies = CandyGrid.getNeighborCandies(candyToRemove, 1)
                for (const neighborCandy of neighborCandies) {
                    if (neighborCandy.getSpecialType() === SPECIAL_TYPE.NONE) {
                        candyRemoveSet.candiesToRemove.delete(neighborCandy)
                        this.removeCandy(neighborCandy, 0)
                    } else if (neighborCandy.getSpecialType() === SPECIAL_TYPE.COLOR_BOMB) {
                        candyRemoveSet.removeDelay = this.removeColorCandyByColorBomb(
                            neighborCandy,
                            candyToRemove.getCandyType(),
                            candyRemoveSet.removeDelay
                        )
                        candyRemoveSet.candiesToRemove.delete(neighborCandy)
                        this.removeCandy(neighborCandy, candyRemoveSet.removeDelay)
                    } else {
                        candyRemoveSet.candiesToRemove.add(neighborCandy)
                    }
                }
                this.removeCandy(candyToRemove)
            }
        }
    }

    public static removeCandyGroup(matches: IMatch[]): void {
        const wrappedCandies = this.getWrappedCandies(matches)
        const candyRemoveSet: CandyRemoveSet = { removeDelay: 0, candiesToRemove: new Set<Candy>() }

        let combineCandyDelay = 0

        for (const match of matches) {
            for (let i = 0; i < match.candies.length; i++) {
                const candy = match.candies[i]
                // Wrapped Candy
                if (wrappedCandies.indexOf(candy) !== -1) {
                    const othersCandy = [...match.candies]
                    othersCandy.splice(i)
                    combineCandyDelay = 50
                    this.scene.add.tween({
                        targets: othersCandy,
                        x: candy.x,
                        y: candy.y,
                        duration: 50,
                        ease: 'Quad.out',
                    })
                    candy.setSpecialType(SPECIAL_TYPE.WRAPPED)
                    candyRemoveSet.candiesToRemove.delete(candy)
                    match.type = 'wrapped'
                } else {
                    candyRemoveSet.candiesToRemove.add(candy)
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
                combineCandyDelay = 50
                // Move others candies to the striped candy
                this.scene.add.tween({
                    targets: otherCandies,
                    x: stripedCandy.x,
                    y: stripedCandy.y,
                    duration: 50,
                    ease: 'Quad.out',
                })

                candyRemoveSet.candiesToRemove.delete(stripedCandy)
            } else if (match.candies.length === 5) {
                const candy: Candy = match.candies[2]

                candy.setCandyType(CANDY_TYPE.COLOR)
                candy.setSpecialType(SPECIAL_TYPE.COLOR_BOMB)
                candyRemoveSet.candiesToRemove.delete(candy)

                ParticleManager.playCandyExplodeEffect(
                    candy.x,
                    candy.y,
                    CANDY_COLORS[candy.getCandyType()]
                )

                const otherCandies = [...match.candies]
                otherCandies.splice(2)
                combineCandyDelay = 50
                this.scene.add.tween({
                    targets: otherCandies,
                    x: candy.x,
                    y: candy.y,
                    duration: 50,
                    ease: 'Quad.out',
                })
            }
        }

        this.processCandiesToRemove(candyRemoveSet)

        this.scene.time.delayedCall(combineCandyDelay, () => {
            for (const candy of candyRemoveSet.candiesToRemove) {
                if (candy && CandyGrid.grid[candy.gridY][candy.gridX]) {
                    this.removeCandy(candy)
                }
            }
            this.scene.time.delayedCall(candyRemoveSet.removeDelay, () => {
                BoardManager.updateState(BoardState.FILL)

                CandyGrid.resetCandy()
                CandyGrid.fillCandy().then(() => {
                    CandySelector.candyUp()
                    this.scene.checkMatches()
                })
            })
        })
    }

    public static lightningCandy(
        source: Candy,
        target: Candy,
        delay: number,
        onLightningTouch?: () => void
    ): void {
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
