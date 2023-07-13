import { CANDY_TYPE, SPECIAL_TYPE } from '../const/CandyConstant'
import { GAME_CONFIG } from '../const/GameConfig'
import Candy from '../objects/Candy'
import GameScene from '../scenes/GameScene'
import { BoardState } from '../const/BoardState'
import BoardStateMachine from './BoardStateMachine'
import { Random } from '../utils/Random'
import { IMatch } from '../types/match'
import { ParticleManager } from './ParticleManager'
import { CandyMatcher } from './CandyMatcher'
import { CandySwapper } from './CandySwapper'
import CandySelector from './CandySelector'

export default class CandyGrid {
    private static scene: GameScene
    public static grid: (Candy | undefined)[][]
    public static candyGridOffset: Phaser.Math.Vector2

    public static init(scene: GameScene): void {
        this.scene = scene
        this.grid = []
        CandySwapper.init(scene)
        CandyMatcher.init(this.grid)
        this.candyGridOffset = new Phaser.Math.Vector2(
            (scene.scale.width -
                GAME_CONFIG.gridWidth * GAME_CONFIG.tileWidth +
                GAME_CONFIG.tileWidth) /
                2,
            (scene.scale.height -
                GAME_CONFIG.gridHeight * GAME_CONFIG.tileHeight +
                GAME_CONFIG.tileWidth) /
                2
        )
    }

    public static create(): (Candy | undefined)[][] {
        BoardStateMachine.getInstance().updateState(BoardState.CREATE)
        let candies: Candy[] = []

        for (let y = 0; y < GAME_CONFIG.gridHeight; y++) {
            this.grid[y] = []
            for (let x = 0; x < GAME_CONFIG.gridWidth; x++) {
                const candy = this.addCandy(x, y)
                this.grid[y][x] = candy
                candies.push(candy)
            }
        }

        candies = Random.shuffleArray(candies)

        const ROTATE_TWEEN_DUR = 1000
        const ROTATE_TWEEN_REPEAT = 1
        const MOVE_TWEEN_DUR = 500
        const MOVE_TWEEN_DELAY = 500 / candies.length

        this.scene.tweens.addCounter({
            from: 260,
            to: 40,
            duration: ROTATE_TWEEN_DUR,
            ease: 'Sine.easeInOut',
            repeat: ROTATE_TWEEN_REPEAT,
            yoyo: true,
            onUpdate: (t) => {
                Phaser.Actions.RotateAroundDistance(
                    candies,
                    { x: this.scene.scale.width / 2, y: this.scene.scale.height / 2 },
                    0.03,
                    t.getValue()
                )
            },
            onComplete: () => {
                candies.forEach((candy, i) => {
                    this.scene.add.tween({
                        targets: candy,
                        x: candy.gridX * GAME_CONFIG.tileWidth + this.candyGridOffset.x,
                        y: candy.gridY * GAME_CONFIG.tileHeight + this.candyGridOffset.y,
                        duration: MOVE_TWEEN_DUR,
                        ease: 'Quad.out',
                        delay: i * MOVE_TWEEN_DELAY,
                    })
                })
            },
        })

        const totalDelay =
            ROTATE_TWEEN_DUR * (ROTATE_TWEEN_REPEAT + 1) * 2 +
            candies.length * MOVE_TWEEN_DELAY +
            MOVE_TWEEN_DUR

        this.scene.time.delayedCall(totalDelay, () => {
            this.scene.checkMatches()
        })

        return this.grid
    }

    public static clear(): void {
        for (let y = 0; y < GAME_CONFIG.gridHeight; y++) {
            for (let x = 0; x < GAME_CONFIG.gridWidth; x++) {
                const candy = this.grid[y][x]
                if (candy) {
                    candy.destroy()
                    this.grid[y][x] = undefined
                }
            }
        }
    }

    public static playIdleEffect(): void {
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                const candy = this.grid[i][j]
                if (candy) {
                    this.scene.add.tween({
                        targets: candy,
                        y: candy.y - 20,
                        duration: 200,
                        delay: (i + j) * 100,
                        ease: 'Quad.out',
                        yoyo: true,
                    })
                }
            }
        }
    }

    private static addCandy(
        x: number,
        y: number,
        _candyType?: CANDY_TYPE,
        _specialType?: SPECIAL_TYPE
    ): Candy {
        const candyType =
            _candyType ??
            GAME_CONFIG.candyTypes[Phaser.Math.RND.between(0, GAME_CONFIG.candyTypes.length - 1)]

        const specialType = _specialType ?? SPECIAL_TYPE.NONE

        // Return the created candy
        return new Candy({
            scene: this.scene,
            candyType: candyType,
            specialType: specialType,
            x: x * GAME_CONFIG.tileWidth + this.candyGridOffset.x,
            y: y * GAME_CONFIG.tileHeight + this.candyGridOffset.y,
            gridX: x,
            gridY: y,
        })
    }

    public static fillCandy(): Promise<void> {
        return new Promise<void>((resolve) => {
            const veticalGrid: Candy[][] = []
            for (let y = 0; y < GAME_CONFIG.gridHeight; y++) {
                veticalGrid[y] = []
            }
            //Check for blank spaces in the grid and add new candies at that position
            for (let y = 0; y < this.grid.length; y++) {
                for (let x = 0; x < this.grid[y].length; x++) {
                    if (this.grid[y][x] === undefined) {
                        //Found a blank spot so lets add animate a tile there
                        const candy = this.addCandy(x, y)
                        veticalGrid[x].push(candy)
                        this.grid[y][x] = candy
                    }
                }
            }

            for (let i = 0; i < veticalGrid.length; i++) {
                for (let j = 0; j < veticalGrid[i].length; j++) {
                    const candy = veticalGrid[i][j]
                    candy.y -= GAME_CONFIG.tileHeight * veticalGrid[i].length
                    this.scene.add.tween({
                        targets: candy,
                        y: candy.y + GAME_CONFIG.tileHeight * veticalGrid[i].length,
                        ease: 'Bounce.out',
                        duration: 500,
                    })
                }
            }

            this.scene.tweens.addCounter({
                duration: 550,
                onComplete: () => {
                    resolve()
                },
            })
        })
    }

    public static resetCandy(): void {
        // Loop through each column starting from the left
        for (let y = this.grid.length - 1; y > 0; y--) {
            // Loop through each candy in the column from bottom to top
            for (let x = this.grid[y].length - 1; x >= 0; x--) {
                const t = y

                // If this space is blank, but the one above it is not, move the one above down
                if (this.grid[t][x] === undefined && this.grid[t - 1][x] !== undefined) {
                    const tempCandy = this.grid[t - 1][x]
                    this.grid[t][x] = tempCandy
                    this.grid[t - 1][x] = undefined

                    tempCandy?.setGrid(x, t)
                    this.grid[t - 1][x]?.setGrid(x, t - 1)

                    this.scene.add.tween({
                        targets: tempCandy,
                        y: GAME_CONFIG.tileHeight * t + CandyGrid.candyGridOffset.y,
                        ease: 'Bounce.out',
                        duration: 500,
                    })

                    // The positions have changed, so start the process again from the bottom
                    // Set `x` and `y` to their maximum values to restart the loops
                    x = this.grid[t].length
                    y = this.grid.length - 1
                }
            }
        }
    }

    public static trySwapCandies(
        firstCandy: Candy | undefined,
        secondCandy: Candy | undefined
    ): void {
        if (firstCandy && secondCandy) {
            // Get the position of the two candies
            BoardStateMachine.getInstance().updateState(BoardState.SWAP)

            CandySwapper.swapCandies(firstCandy, secondCandy, () => {
                if (firstCandy.getSpecialType() === SPECIAL_TYPE.COLOR_BOMB) {
                    const matches: IMatch[] = []
                    let delay = 0

                    if (secondCandy.getSpecialType() === SPECIAL_TYPE.COLOR_BOMB) {
                        for (let i = 0; i < this.grid.length; i++) {
                            for (let j = 0; j < this.grid[i].length; j++) {
                                const candy = this.grid[i][j]
                                if (candy) {
                                    matches.push({ candies: [candy], direction: 'horizontal' })
                                }
                            }
                        }
                    } else if (
                        secondCandy.getSpecialType() === SPECIAL_TYPE.VERTICAL_STRIPED ||
                        secondCandy.getSpecialType() === SPECIAL_TYPE.HORIZONTAL_STRIPED
                    ) {
                        for (let i = 0; i < this.grid.length; i++) {
                            for (let j = 0; j < this.grid[i].length; j++) {
                                const candy = this.grid[i][j]
                                if (candy && candy.getCandyType() === secondCandy.getCandyType()) {
                                    this.scene.time.delayedCall(i * 100, () => {
                                        candy.setSpecialType(
                                            Random.Percent(50)
                                                ? SPECIAL_TYPE.VERTICAL_STRIPED
                                                : SPECIAL_TYPE.HORIZONTAL_STRIPED
                                        )
                                        matches.push({
                                            candies: [candy],
                                            direction: 'horizontal',
                                        })
                                    })
                                    delay = Math.max(delay, (i + 1) * 100)
                                }
                            }
                        }
                    } else {
                        for (let i = 0; i < this.grid.length; i++) {
                            for (let j = 0; j < this.grid[i].length; j++) {
                                const candy = this.grid[i][j]
                                if (candy && candy.getCandyType() === secondCandy.getCandyType()) {
                                    matches.push({ candies: [candy], direction: 'horizontal' })
                                }
                            }
                        }
                        matches.push({ candies: [firstCandy], direction: 'horizontal' })
                    }
                    this.scene.time.delayedCall(delay, () => {
                        this.removeCandyGroup(matches)
                    })
                } else {
                    this.scene.checkMatches()
                }
            })
        }
    }

    public static removeCandyGroup(matches: IMatch[]): void {
        const candiesToRemove: Set<Candy> = new Set<Candy>()

        for (const match of matches) {
            for (let i = 0; i < match.candies.length; i++) {
                candiesToRemove.add(match.candies[i])
            }

            // Match 4
            if (match.candies.length === 4) {
                match.candies[0].setSpecialType(
                    match.direction === 'horizontal'
                        ? SPECIAL_TYPE.VERTICAL_STRIPED
                        : SPECIAL_TYPE.HORIZONTAL_STRIPED
                )
                candiesToRemove.delete(match.candies[0])
            } else if (match.candies.length === 5) {
                const candy: Candy = match.candies[0]
                candy.setCandyType(CANDY_TYPE.COLOR)
                candy.setSpecialType(SPECIAL_TYPE.COLOR_BOMB)
                candiesToRemove.delete(candy)
            }
        }

        let specialRemoveDelay = 0

        for (const candy of candiesToRemove) {
            if (candy.getSpecialType() === SPECIAL_TYPE.HORIZONTAL_STRIPED) {
                this.scene.cameras.main.shake(200, 0.002)
                this.grid[candy.gridY].forEach((c, i) => {
                    if (
                        c &&
                        (c.getSpecialType() === SPECIAL_TYPE.NONE ||
                            c.getSpecialType() === SPECIAL_TYPE.COLOR_BOMB ||
                            c === candy)
                    ) {
                        specialRemoveDelay = Math.max(specialRemoveDelay, 30 * (i + 1))
                        this.scene.tweens.addCounter({
                            duration: 30 * i,
                            onComplete: () => {
                                candiesToRemove.delete(c)
                                c.destroy()
                                this.grid[c.gridY][c.gridX] = undefined
                                ParticleManager.playCandyExplodeByStriped(c.x, c.y)
                            },
                        })
                    } else if (c && c !== candy) {
                        candiesToRemove.add(c)
                    }
                })
            } else if (candy.getSpecialType() === SPECIAL_TYPE.VERTICAL_STRIPED) {
                this.scene.cameras.main.shake(200, 0.002)
                for (let i = 0; i < this.grid[candy.gridY].length; i++) {
                    const c = this.grid[i][candy.gridX]
                    if (
                        c &&
                        (c.getSpecialType() === SPECIAL_TYPE.NONE ||
                            c.getSpecialType() === SPECIAL_TYPE.COLOR_BOMB ||
                            c === candy)
                    ) {
                        specialRemoveDelay = Math.max(specialRemoveDelay, 30 * (i + 1))
                        this.scene.tweens.addCounter({
                            duration: 30 * i,
                            onComplete: () => {
                                candiesToRemove.delete(c)
                                c.destroy()
                                this.grid[c.gridY][c.gridX] = undefined
                                ParticleManager.playCandyExplodeByStriped(c.x, c.y)
                            },
                        })
                    } else if (c && c !== candy) {
                        candiesToRemove.add(c)
                    }
                }
            }
        }

        this.scene.time.delayedCall(specialRemoveDelay, () => {
            BoardStateMachine.getInstance().updateState(BoardState.FILL)
            // Loop through all the matches and remove the associated candies
            for (const candy of candiesToRemove) {
                if (candy && this.grid[candy.gridY][candy.gridX]) {
                    candy.destroy()
                    this.grid[candy.gridY][candy.gridX] = undefined
                }
            }

            this.resetCandy()
            this.fillCandy().then(() => {
                CandySelector.candyUp()
                this.scene.checkMatches()
            })
        })
    }

    public static getHints(): IMatch[] {
        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length - 1; x++) {
                // Swap candies and check for matches
                const a = new Phaser.Math.Vector2(y, x)
                const b = new Phaser.Math.Vector2(y, x + 1)
                CandySwapper.swapCandiesInternal(a, b)
                const matches = CandyMatcher.getMatches()

                // If matches are found, this is a valid hint
                if (matches.length > 0) {
                    CandySwapper.swapCandiesInternal(a, b) // Swap back to original positions
                    return matches
                }

                // Swap candies back to original positions
                CandySwapper.swapCandiesInternal(a, b)
            }
        }

        // Check for vertical hints
        for (let x = 0; x < this.grid[0].length; x++) {
            for (let y = 0; y < this.grid.length - 1; y++) {
                // Swap candies and check for matches
                const a = new Phaser.Math.Vector2(y, x)
                const b = new Phaser.Math.Vector2(y + 1, x)
                CandySwapper.swapCandiesInternal(a, b)
                const matches = CandyMatcher.getMatches()

                // If matches are found, this is a valid hint
                if (matches.length > 0) {
                    CandySwapper.swapCandiesInternal(a, b) // Swap back to original positions
                    return matches
                }

                // Swap candies back to original positions
                CandySwapper.swapCandiesInternal(a, b)
            }
        }
        return []
    }
}
