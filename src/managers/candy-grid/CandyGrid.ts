import { CANDY_TYPE, SPECIAL_TYPE } from '../../constants/CandyConstant'
import { GAME_CONFIG } from '../../constants/GameConfig'
import Candy from '../../objects/Candy'
import GameScene from '../../scenes/GameScene'
import { BoardState } from '../../constants/BoardState'
import BoardStateMachine from '../BoardStateMachine'
import { Random } from '../../utils/Random'
import { IMatch } from '../../types/match'
import CandyMatcher from './CandyMatcher'
import CandySwapper from './CandySwapper'
import ScoreManager from '../ScoreManager'
import CandyRemover from './CandyRemover'
import CandyShuffle from './CandyShuffle'
import CandySelector from './CandySelector'

export class CandyGrid {
    private static scene: GameScene
    private static candyLayer: Phaser.GameObjects.Layer
    private static candyMask: Phaser.Display.Masks.GeometryMask

    public static grid: (Candy | undefined)[][]
    public static candyGridOffset: Phaser.Math.Vector2

    public static init(scene: GameScene): void {
        this.scene = scene
        this.grid = []
        CandySelector.init(scene)
        CandySwapper.init(scene)
        CandyRemover.init(scene)
        CandyShuffle.init(scene)
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

        this.scene.add.nineslice(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2,
            'grid',
            undefined,
            GAME_CONFIG.gridWidth * GAME_CONFIG.tileWidth + 10,
            GAME_CONFIG.gridHeight * GAME_CONFIG.tileHeight + 10,
            50,
            50,
            50,
            50
        )

        this.candyLayer = this.createLayerMask()
    }

    private static createLayerMask(): Phaser.GameObjects.Layer {
        const candyLayer = this.scene.add.layer()

        const graphics = this.scene.make.graphics()

        graphics.fillRect(
            this.scene.scale.width / 2 - (GAME_CONFIG.gridWidth * GAME_CONFIG.tileWidth) / 2,
            CandyGrid.candyGridOffset.y - GAME_CONFIG.tileWidth / 2,
            GAME_CONFIG.gridWidth * GAME_CONFIG.tileWidth,
            GAME_CONFIG.gridHeight * GAME_CONFIG.tileHeight
        )

        this.candyMask = graphics.createGeometryMask()

        candyLayer.setMask(this.candyMask)

        return candyLayer
    }

    public static create(): void {
        const candies: Candy[] = []
        for (let y = 0; y < GAME_CONFIG.gridHeight; y++) {
            this.grid[y] = []
            for (let x = 0; x < GAME_CONFIG.gridWidth; x++) {
                const candy = CandyGrid.addCandy(x, y)
                CandyGrid.grid[y][x] = candy
                candies.push(candy)
            }
        }
        this.candyLayer.clearMask()

        const totalDelay = CandyShuffle.shuffle(candies, false)

        this.scene.time.delayedCall(totalDelay, () => {
            this.candyLayer.setMask(this.candyMask)
            this.scene.checkMatches()
        })
    }

    public static shuffle() {
        const candies: Candy[] = []
        for (let y = 0; y < GAME_CONFIG.gridHeight; y++) {
            for (let x = 0; x < GAME_CONFIG.gridWidth; x++) {
                const candy = this.grid[y][x]
                if (candy) {
                    candies.push(candy)
                }
            }
        }

        this.candyLayer.clearMask()

        const totalDelay = CandyShuffle.shuffle(candies, true)

        this.scene.time.delayedCall(totalDelay, () => {
            this.candyLayer.setMask(this.candyMask)
            this.scene.checkMatches()
        })
    }

    public static clear(): void {
        for (let y = 0; y < GAME_CONFIG.gridHeight; y++) {
            for (let x = 0; x < GAME_CONFIG.gridWidth; x++) {
                const candy = this.grid[y][x]
                if (candy) {
                    CandyRemover.removeCandy(candy)
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
                        y: CandyGrid.getCandyWorldPos(candy).y - 20,
                        duration: 200,
                        delay: (i + j) * 100,
                        ease: 'Quad.out',
                        yoyo: true,
                    })
                }
            }
        }
    }

    public static addCandy(
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
        const candy = new Candy({
            scene: this.scene,
            candyType: candyType,
            specialType: specialType,
            x: x * GAME_CONFIG.tileWidth + this.candyGridOffset.x,
            y: y * GAME_CONFIG.tileHeight + this.candyGridOffset.y,
            gridX: x,
            gridY: y,
        })

        this.candyLayer.add(candy)

        return candy
    }

    public static fillCandy(): Promise<void> {
        return new Promise<void>((resolve) => {
            const veticalGrid: Candy[][] = []
            for (let y = 0; y < GAME_CONFIG.gridWidth; y++) {
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
        if (!firstCandy || !secondCandy) return
        // Get the position of the two candies
        BoardStateMachine.getInstance().updateState(BoardState.SWAP)

        CandySwapper.swapCandies(firstCandy, secondCandy, () => {
            if (
                firstCandy.getSpecialType() === SPECIAL_TYPE.COLOR_BOMB ||
                secondCandy.getSpecialType() === SPECIAL_TYPE.COLOR_BOMB
            ) {
                const bombCandy =
                    firstCandy.getSpecialType() === SPECIAL_TYPE.COLOR_BOMB
                        ? firstCandy
                        : secondCandy
                const otherCandy = firstCandy === bombCandy ? secondCandy : firstCandy

                const matches: IMatch[] = []
                let delay = 0

                if (otherCandy.getSpecialType() === SPECIAL_TYPE.COLOR_BOMB) {
                    const middleX = Math.floor(GAME_CONFIG.gridWidth / 2)

                    for (let i = 0; i < this.grid.length; i++) {
                        for (let j = 0; j < middleX; j++) {
                            const candy = this.grid[i][j]
                            if (candy && candy.getSpecialType() !== SPECIAL_TYPE.COLOR_BOMB) {
                                delay = Math.max(delay, (j + 1) * 100 + 200)
                                CandyRemover.lightningCandy(bombCandy, candy, j * 100, () => {
                                    CandyRemover.removeCandy(candy)
                                    ScoreManager.addScore(1)
                                })
                            }
                        }

                        for (let j = this.grid[i].length - 1; j >= middleX; j--) {
                            const candy = this.grid[i][j]
                            if (candy && candy.getSpecialType() !== SPECIAL_TYPE.COLOR_BOMB) {
                                delay = Math.max(delay, (j + 1) * 100 + 200)
                                CandyRemover.lightningCandy(
                                    otherCandy,
                                    candy,
                                    (this.grid[i].length - j - 1) * 100,
                                    () => {
                                        CandyRemover.removeCandy(candy)
                                        ScoreManager.addScore(1)
                                    }
                                )
                            }
                        }
                    }
                    matches.push({ candies: [otherCandy], type: 'horizontal' })
                } else if (
                    otherCandy.getSpecialType() === SPECIAL_TYPE.VERTICAL_STRIPED ||
                    otherCandy.getSpecialType() === SPECIAL_TYPE.HORIZONTAL_STRIPED ||
                    otherCandy.getSpecialType() === SPECIAL_TYPE.WRAPPED
                ) {
                    const isWrapped = otherCandy.getSpecialType() === SPECIAL_TYPE.WRAPPED
                    for (let i = 0; i < this.grid.length; i++) {
                        for (let j = 0; j < this.grid[i].length; j++) {
                            const candy = this.grid[i][j]
                            if (
                                candy &&
                                candy.getCandyType() === otherCandy.getCandyType() &&
                                candy.getSpecialType() === SPECIAL_TYPE.NONE
                            ) {
                                delay = Math.max(delay, (j + 1) * 100 + 200)
                                const specialType = isWrapped
                                    ? SPECIAL_TYPE.WRAPPED
                                    : Random.Percent(50)
                                    ? SPECIAL_TYPE.VERTICAL_STRIPED
                                    : SPECIAL_TYPE.HORIZONTAL_STRIPED
                                CandyRemover.lightningCandy(bombCandy, candy, j * 100, () => {
                                    candy.setSpecialType(specialType)
                                    matches.push({
                                        candies: [candy],
                                        type: 'horizontal',
                                    })
                                })
                            }
                        }
                    }
                } else {
                    delay = CandyRemover.removeColorCandyByColorBomb(
                        bombCandy,
                        otherCandy.getCandyType(),
                        delay
                    )
                }
                this.scene.time.delayedCall(delay, () => {
                    CandyRemover.removeCandy(bombCandy)
                    CandyRemover.removeCandyGroup(matches)
                })
            } else if (
                (firstCandy.getSpecialType() === SPECIAL_TYPE.HORIZONTAL_STRIPED &&
                    secondCandy.getSpecialType() === SPECIAL_TYPE.HORIZONTAL_STRIPED) ||
                (firstCandy.getSpecialType() === SPECIAL_TYPE.VERTICAL_STRIPED &&
                    secondCandy.getSpecialType() === SPECIAL_TYPE.HORIZONTAL_STRIPED) ||
                (firstCandy.getSpecialType() === SPECIAL_TYPE.VERTICAL_STRIPED &&
                    secondCandy.getSpecialType() === SPECIAL_TYPE.VERTICAL_STRIPED) ||
                (firstCandy.getSpecialType() === SPECIAL_TYPE.HORIZONTAL_STRIPED &&
                    secondCandy.getSpecialType() === SPECIAL_TYPE.VERTICAL_STRIPED)
            ) {
                firstCandy.setSpecialType(SPECIAL_TYPE.VERTICAL_STRIPED)
                secondCandy.setSpecialType(SPECIAL_TYPE.HORIZONTAL_STRIPED)
                const matches: IMatch[] = []
                matches.push({ candies: [firstCandy, secondCandy], type: 'horizontal' })
                CandyRemover.removeCandyGroup(matches)
            } else {
                this.scene.checkMatches()
            }
        })
    }

    public static getHints(): IMatch[] {
        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length - 1; x++) {
                // Swap candies and check for matches
                const a = new Phaser.Math.Vector2(x, y)
                const b = new Phaser.Math.Vector2(x + 1, y)
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
                const a = new Phaser.Math.Vector2(x, y)
                const b = new Phaser.Math.Vector2(x, y + 1)
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

    public static getNeighborCandies(candy: Candy): Candy[] {
        const neighborsOffsets = [
            [0, 1],
            [0, -1],
            [1, 0],
            [-1, 0],
            [1, 1],
            [-1, 1],
            [1, -1],
            [-1, -1],
        ]

        const neighborCandies: Candy[] = []

        for (let i = 0; i < neighborsOffsets.length; i++) {
            const y = candy.gridY + neighborsOffsets[i][0]
            const x = candy.gridX + neighborsOffsets[i][1]

            if (y < 0 || y >= this.grid.length) continue
            if (x < 0 || x >= this.grid[0].length) continue

            const neighborCandy = this.grid[y][x]
            if (neighborCandy) {
                neighborCandies.push(neighborCandy)
            }
        }
        return neighborCandies
    }

    public static getCandyWorldPos(candy: Candy): Phaser.Math.Vector2 {
        return new Phaser.Math.Vector2(
            candy.gridX * GAME_CONFIG.tileWidth + this.candyGridOffset.x,
            candy.gridY * GAME_CONFIG.tileHeight + this.candyGridOffset.y
        )
    }
}

export default CandyGrid
