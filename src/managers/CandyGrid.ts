import { BlendModes } from 'phaser'
import { CANDY_TYPE } from '../const/CandyType'
import { GAME_CONFIG } from '../const/GameConfig'
import Candy from '../objects/Candy'
import GameScene from '../scenes/GameScene'
import { BoardState } from '../const/BoardState'
import BoardStateMachine from './BoardStateMachine'

export default class CandyGrid {
    private static scene: GameScene

    public static grid: (Candy | undefined)[][]
    public static candyGridOffset: Phaser.Math.Vector2

    public static init(scene: GameScene): void {
        this.scene = scene
        this.grid = []
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
        for (let y = 0; y < GAME_CONFIG.gridHeight; y++) {
            this.grid[y] = []
            for (let x = 0; x < GAME_CONFIG.gridWidth; x++) {
                this.grid[y][x] = this.addCandy(x, y)
            }
        }
        return this.grid
    }

    private static addCandy(x: number, y: number): Candy {
        // Get a random candy
        const randomCandyType: CANDY_TYPE =
            GAME_CONFIG.candyTypes[Phaser.Math.RND.between(0, GAME_CONFIG.candyTypes.length - 1)]

        // Return the created candy
        return new Candy({
            scene: this.scene,
            candyType: randomCandyType,
            x: x * GAME_CONFIG.tileWidth + this.candyGridOffset.x,
            y: y * GAME_CONFIG.tileHeight + this.candyGridOffset.y,
            gridX: x,
            gridY: y,
            texture: randomCandyType,
        })
    }

    public static fillCandy(): Promise<void> {
        return new Promise<void>((resolve) => {
            const veticalGrid: Candy[][] = []
            for (let y = 0; y < GAME_CONFIG.gridHeight; y++) {
                veticalGrid[y] = []
            }
            //Check for blank spaces in the grid and add new tiles at that position
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
                duration: 500,
                onComplete: () => {
                    resolve()
                },
            })
        })
    }

    public static resetCandy(): void {
        // Loop through each column starting from the left
        for (let y = this.grid.length - 1; y > 0; y--) {
            // Loop through each tile in the column from bottom to top
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

    public static swapCandies(firstCandy: Candy | undefined, secondCandy: Candy | undefined): void {
        if (firstCandy && secondCandy) {
            // Get the position of the two tiles
            BoardStateMachine.getInstance().updateState(BoardState.SWAP)

            const firstX = firstCandy.gridX
            const firstY = firstCandy.gridY

            const secondX = secondCandy.gridX
            const secondY = secondCandy.gridY
            // Swap them in our grid with the tiles
            this.grid[firstY][firstX] = secondCandy
            this.grid[secondY][secondX] = firstCandy

            secondCandy.setGrid(firstX, firstY)
            firstCandy.setGrid(secondX, secondY)

            // Add particle when candies move
            const p1 = this.scene.add.particles(32, 32, 'particle-3', {
                color: [0xfffff],
                lifespan: 500,
                alpha: { start: 1, end: 0, ease: 'Quad.out' },
                scale: { start: 1, end: 0, ease: 'Quart.in' },
                duration: 300,
                blendMode: BlendModes.ADD,
                stopAfter: 1,
            })

            const p2 = this.scene.add.particles(32, 32, 'particle-3', {
                color: [0xfffff],
                lifespan: 500,
                alpha: { start: 1, end: 0, ease: 'Quad.out' },
                scale: { start: 1, end: 0, ease: 'Quart.in' },
                duration: 300,
                blendMode: BlendModes.ADD,
                stopAfter: 1,
            })
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
                    this.scene.checkMatches()
                },
            })

            // firstCandy = this.grid[firstY][firstX]
            // secondCandy = this.grid[secondY][secondX]
        }
    }

    public static removeCandyGroup(candyGroup: Candy[][]): void {
        const flattenedGroup = candyGroup.flat()
        // Loop through all the matches and remove the associated tiles
        for (const candy of flattenedGroup) {
            const candyPos = this.getTilePos(candy)

            if (candyPos.x !== -1 && candyPos.y !== -1) {
                candy.destroy()
                this.grid[candyPos.y][candyPos.x] = undefined
            }
        }
    }

    private static getTilePos(candy: Candy): Phaser.Math.Vector2 {
        const pos = new Phaser.Math.Vector2(-1, -1)

        //Find the position of a specific tile in the grid
        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length; x++) {
                //There is a match at this position so return the grid coords
                if (candy === this.grid[y][x]) {
                    pos.x = x
                    pos.y = y
                    break
                }
            }
        }

        return pos
    }

    public static getHints(): Candy[][] {
        const swapCandies = (a: Phaser.Math.Vector2, b: Phaser.Math.Vector2) => {
            if (a && b) {
                const candyA = this.grid[a.x][a.y] as Candy
                const candyB = this.grid[b.x][b.y] as Candy

                const temp = candyA
                this.grid[a.x][a.y] = candyB
                this.grid[b.x][b.y] = temp
            }
        }

        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length - 1; x++) {
                // Swap candies and check for matches
                const a = new Phaser.Math.Vector2(y, x)
                const b = new Phaser.Math.Vector2(y, x + 1)
                swapCandies(a, b)
                const matches = this.getMatches()

                // If matches are found, this is a valid hint
                if (matches.length > 0) {
                    swapCandies(a, b) // Swap back to original positions
                    return matches
                }

                // Swap candies back to original positions
                swapCandies(a, b)
            }
        }

        // Check for vertical hints
        for (let x = 0; x < this.grid[0].length; x++) {
            for (let y = 0; y < this.grid.length - 1; y++) {
                // Swap candies and check for matches
                const a = new Phaser.Math.Vector2(y, x)
                const b = new Phaser.Math.Vector2(y + 1, x)
                swapCandies(a, b)
                const matches = this.getMatches()

                // If matches are found, this is a valid hint
                if (matches.length > 0) {
                    swapCandies(a, b) // Swap back to original positions
                    return matches
                }

                // Swap candies back to original positions
                swapCandies(a, b)
            }
        }
        return []
    }

    public static getMatches(): Candy[][] {
        const matches: Candy[][] = []
        const visited: boolean[][] = []

        // Initialize visited array
        for (let y = 0; y < this.grid.length; y++) {
            visited[y] = []
            for (let x = 0; x < this.grid[y].length; x++) {
                visited[y][x] = false
            }
        }

        // Check for horizontal matches
        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length - 2; x++) {
                const candy = this.grid[y][x]

                if (candy && !visited[y][x]) {
                    const match: Candy[] = [candy]
                    let matchLength = 1

                    for (let i = x + 1; i < this.grid[y].length; i++) {
                        const nextCandy = this.grid[y][i]

                        if (nextCandy && nextCandy.candyType === candy.candyType) {
                            match.push(nextCandy)
                            matchLength++
                        } else {
                            break
                        }
                    }

                    if (matchLength >= 3) {
                        matches.push(match)
                        match.forEach((matchCandy) => {
                            const candyY = matchCandy.y
                            const tileX = matchCandy.x
                            if (visited[candyY] && visited[candyY][tileX] === false) {
                                visited[candyY][tileX] = true
                            }
                        })
                    }
                }
            }
        }

        // Check for vertical matches
        for (let x = 0; x < this.grid[0].length; x++) {
            for (let y = 0; y < this.grid.length - 2; y++) {
                const candy = this.grid[y][x]

                if (candy && !visited[y][x]) {
                    const match: Candy[] = [candy]
                    let matchLength = 1

                    for (let i = y + 1; i < this.grid.length; i++) {
                        const nextCandy = this.grid[i][x]

                        if (nextCandy && nextCandy.candyType === candy.candyType) {
                            match.push(nextCandy)
                            matchLength++
                        } else {
                            break
                        }
                    }

                    if (matchLength >= 3) {
                        matches.push(match)
                        match.forEach((matchCandy) => {
                            const candyY = matchCandy.y
                            const tileX = matchCandy.x
                            if (visited[candyY] && visited[candyY][tileX] === false) {
                                visited[candyY][tileX] = true
                            }
                        })
                    }
                }
            }
        }

        return matches
    }
}
