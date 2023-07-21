import { CANDY_COLORS, CANDY_TYPE, SPECIAL_TYPE } from '../../constants/CandyConstant'
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
import BigCandy from '../../objects/BigCandy'
import { CandyRemoveSet } from '../../types/general'
import ParticleManager from '../ParticleManager'

export class CandyGrid {
    private static scene: GameScene
    private static candyLayer: Phaser.GameObjects.Layer
    private static candyMask: Phaser.Display.Masks.GeometryMask
    private static bigCandy: BigCandy
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

        this.bigCandy = new BigCandy({
            x: 50,
            y: 50,
            gridX: 0,
            gridY: 0,
            scene: this.scene,
            candyType: CANDY_TYPE.BLUE,
            specialType: SPECIAL_TYPE.HORIZONTAL_STRIPED,
        })
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
            } else if (firstCandy.isStriped && secondCandy.isStriped) {
                firstCandy.setSpecialType(SPECIAL_TYPE.VERTICAL_STRIPED)
                secondCandy.setSpecialType(SPECIAL_TYPE.HORIZONTAL_STRIPED)
                const matches: IMatch[] = []
                matches.push({ candies: [firstCandy, secondCandy], type: 'horizontal' })
                CandyRemover.removeCandyGroup(matches)
            } else if (
                firstCandy.getSpecialType() === SPECIAL_TYPE.WRAPPED &&
                secondCandy.getSpecialType() === SPECIAL_TYPE.WRAPPED
            ) {
                ParticleManager.playWrappedBigExplode(
                    firstCandy.x,
                    firstCandy.y,
                    CANDY_COLORS[firstCandy.getCandyType()]
                )

                const neighborCandies = this.getNeighborCandies(firstCandy, 3)
                const o: CandyRemoveSet = { removeDelay: 0, candiesToRemove: new Set<Candy>() }

                CandyRemover.removeCandy(firstCandy)
                CandyRemover.removeCandy(secondCandy)

                for (const neighborCandy of neighborCandies) {
                    if (neighborCandy === secondCandy) continue
                    if (neighborCandy.getSpecialType() === SPECIAL_TYPE.NONE) {
                        o.candiesToRemove.delete(neighborCandy)
                        CandyRemover.removeCandy(neighborCandy, 0)
                    } else if (neighborCandy.getSpecialType() === SPECIAL_TYPE.COLOR_BOMB) {
                        o.removeDelay = CandyRemover.removeColorCandyByColorBomb(
                            neighborCandy,
                            firstCandy.getCandyType(),
                            o.removeDelay
                        )
                        o.candiesToRemove.delete(neighborCandy)
                        CandyRemover.removeCandy(neighborCandy, o.removeDelay)
                    } else {
                        o.candiesToRemove.add(neighborCandy)
                    }
                }

                CandyRemover.processCandiesToRemove(o)
                ScoreManager.addScore(neighborCandies.length)

                this.scene.tweens.addCounter({
                    duration: o.removeDelay,
                    onComplete: () => {
                        const matches: IMatch[] = []
                        CandyRemover.removeCandyGroup(matches)
                    },
                })
            } else if (
                (firstCandy.isStriped && secondCandy.getSpecialType() === SPECIAL_TYPE.WRAPPED) ||
                (secondCandy.isStriped && firstCandy.getSpecialType() === SPECIAL_TYPE.WRAPPED)
            ) {
                CandyRemover.removeCandy(firstCandy)
                CandyRemover.removeCandy(secondCandy)

                const o: CandyRemoveSet = { removeDelay: 0, candiesToRemove: new Set<Candy>() }

                const offsets = [-1, 0, 1]
                const { x, y } = this.getCandyWorldPos(firstCandy)
                this.bigCandy.show(
                    x,
                    y,
                    firstCandy.getCandyType(),
                    SPECIAL_TYPE.HORIZONTAL_STRIPED,
                    () => {
                        this.bigCandy.setScale(0)
                        this.scene.cameras.main.shake(100, 0.02)

                        for (const offset of offsets) {
                            const gridY = firstCandy.gridY + offset
                            if (gridY >= this.grid.length || gridY < 0) continue

                            for (let i = firstCandy.gridX; i >= 0; i--) {
                                const c = CandyGrid.grid[gridY][i]
                                CandyRemover.removeCandyByStriped(
                                    this.bigCandy,
                                    c,
                                    30 * (firstCandy.gridX - i + 1),
                                    o
                                )
                            }
                            for (
                                let i = firstCandy.gridX + 1;
                                i < CandyGrid.grid[gridY].length;
                                i++
                            ) {
                                const c = CandyGrid.grid[gridY][i]
                                CandyRemover.removeCandyByStriped(
                                    this.bigCandy,
                                    c,
                                    30 * (i + 1 - firstCandy.gridX),
                                    o
                                )
                            }
                            CandyRemover.processCandiesToRemove(o)
                            ScoreManager.addScore(8)
                        }

                        this.scene.tweens.addCounter({
                            duration: 500,
                            onComplete: () => {
                                this.bigCandy.show(
                                    x,
                                    y,
                                    firstCandy.getCandyType(),
                                    SPECIAL_TYPE.VERTICAL_STRIPED,
                                    () => {
                                        this.bigCandy.setScale(0)
                                        this.scene.cameras.main.shake(100, 0.02)

                                        for (const offset of offsets) {
                                            const gridX = firstCandy.gridX + offset
                                            if (gridX >= this.grid[0].length || gridX < 0) continue

                                            for (let i = firstCandy.gridY; i >= 0; i--) {
                                                const c = CandyGrid.grid[i][gridX]
                                                o.removeDelay = Math.max(
                                                    o.removeDelay,
                                                    30 * (firstCandy.gridY - i + 1)
                                                )
                                                CandyRemover.removeCandyByStriped(
                                                    this.bigCandy,
                                                    c,
                                                    30 * (firstCandy.gridY - i + 1),
                                                    o
                                                )
                                            }

                                            for (
                                                let i = firstCandy.gridY + 1;
                                                i < CandyGrid.grid.length;
                                                i++
                                            ) {
                                                const c = CandyGrid.grid[i][gridX]
                                                o.removeDelay = Math.max(
                                                    o.removeDelay,
                                                    30 * (i + 1 - firstCandy.gridY)
                                                )
                                                CandyRemover.removeCandyByStriped(
                                                    this.bigCandy,
                                                    c,
                                                    30 * (i + 1 - firstCandy.gridY),
                                                    o
                                                )
                                            }
                                            CandyRemover.processCandiesToRemove(o)
                                            ScoreManager.addScore(8)
                                        }

                                        this.scene.tweens.addCounter({
                                            duration: o.removeDelay,
                                            onComplete: () => {
                                                const matches: IMatch[] = []
                                                CandyRemover.removeCandyGroup(matches)
                                            },
                                        })
                                    }
                                )
                            },
                        })
                    }
                )
            } else {
                this.scene.checkMatches()
            }
        })
    }

    public static getHint(): IMatch | null {
        let resolves: IMatch[] = []

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
                    resolves.push(...matches)
                }

                // Swap candies back to original positions
                else CandySwapper.swapCandiesInternal(a, b)
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
                    resolves.push(...matches)
                }

                // Swap candies back to original positions
                else CandySwapper.swapCandiesInternal(a, b)
            }
        }

        resolves = Random.shuffleArray(resolves)

        for (let i = 5; i >= 3; i--) {
            for (const resolve of resolves) {
                if (resolve.candies.length === i) return resolve
            }
        }

        return null
    }

    public static getNeighborCandies(candy: Candy, distance: number): Candy[] {
        const neighborCandies: Candy[] = []

        for (let i = candy.gridY - distance; i <= candy.gridY + distance; i++) {
            for (let j = candy.gridX - distance; j <= candy.gridX + distance; j++) {
                if (i < 0 || i >= this.grid.length) continue
                if (j < 0 || j >= this.grid[0].length) continue

                const neighborCandy = this.grid[i][j]
                if (neighborCandy && neighborCandy !== candy) {
                    neighborCandies.push(neighborCandy)
                }
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
