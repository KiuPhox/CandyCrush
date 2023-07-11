import { BlendModes } from 'phaser'
import { CANDY_COLORS, CANDY_TYPE } from '../const/CandyType'
import { CONST } from '../const/const'
import Candy from '../objects/Candy'
import { Random } from '../utils/Random'

export default class GameScene extends Phaser.Scene {
    // Variables
    private canMove: boolean
    private canCheckMatchs: boolean

    // Grid with candies
    private candyGrid: (Candy | undefined)[][]
    private candyGridOffset: Phaser.Math.Vector2

    // Selected candies
    private firstSelectedCandy: Candy | undefined
    private secondSelectedCandy: Candy | undefined

    constructor() {
        super('GameScene')
    }

    init(): void {
        // Init variables
        this.canMove = true
        this.candyGridOffset = new Phaser.Math.Vector2(
            (this.scale.width - CONST.gridWidth * CONST.tileWidth) / 2,
            (this.scale.height - CONST.gridHeight * CONST.tileHeight) / 2
        )

        // set background color
        this.cameras.main.setBackgroundColor(0x78aade)
        this.add
            .rectangle(0, 0, this.scale.width, this.candyGridOffset.y, 0x78aade)
            .setOrigin(0)
            .setDepth(1)

        // Init grid with tiles
        this.candyGrid = []

        for (let y = 0; y < CONST.gridHeight; y++) {
            this.candyGrid[y] = []
            for (let x = 0; x < CONST.gridWidth; x++) {
                this.candyGrid[y][x] = this.addCandy(x, y)
            }
        }

        // Selected Tiles
        this.firstSelectedCandy = undefined
        this.secondSelectedCandy = undefined

        // Input
        this.input.on('gameobjectdown', this.candyDown, this)

        // Check if matches on the start
        this.checkMatches()
    }

    private addCandy(x: number, y: number): Candy {
        // Get a random candy
        const randomCandyType: CANDY_TYPE =
            CONST.candyTypes[Phaser.Math.RND.between(0, CONST.candyTypes.length - 1)]

        // Return the created candy
        return new Candy({
            scene: this,
            candyType: randomCandyType,
            x: x * CONST.tileWidth + this.candyGridOffset.x,
            y: y * CONST.tileHeight + this.candyGridOffset.y,
            texture: randomCandyType,
        })
    }

    private candyDown(pointer: PointerEvent, gameobject: Candy | undefined): void {
        if (this.canMove && gameobject) {
            if (!this.firstSelectedCandy) {
                this.firstSelectedCandy = gameobject
            } else {
                // So if we are here, we must have selected a second tile
                this.secondSelectedCandy = gameobject

                const dx =
                    Math.abs(this.firstSelectedCandy.x - this.secondSelectedCandy.x) /
                    CONST.tileWidth
                const dy =
                    Math.abs(this.firstSelectedCandy.y - this.secondSelectedCandy.y) /
                    CONST.tileHeight

                // Check if the selected tiles are both in range to make a move
                if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
                    this.canMove = false
                    this.swapCandies()
                }
            }
        }
    }

    /**
     * This function will take care of the swapping of the two selected tiles.
     * It will only work, if two tiles have been selected.
     */
    private swapCandies(): void {
        if (this.firstSelectedCandy && this.secondSelectedCandy) {
            // Get the position of the two tiles

            const firstX = this.firstSelectedCandy.x - this.candyGridOffset.x
            const secondX = this.secondSelectedCandy.x - this.candyGridOffset.x

            const firstY = this.firstSelectedCandy.y - this.candyGridOffset.y
            const secondY = this.secondSelectedCandy.y - this.candyGridOffset.y

            // Swap them in our grid with the tiles
            this.candyGrid[firstY / CONST.tileHeight][firstX / CONST.tileWidth] =
                this.secondSelectedCandy
            this.candyGrid[secondY / CONST.tileHeight][secondX / CONST.tileWidth] =
                this.firstSelectedCandy

            // Add particle when candies move
            const p1 = this.add.particles(32, 32, 'particle-3', {
                color: [0xfffff],
                lifespan: 500,
                alpha: { start: 1, end: 0, ease: 'Quad.out' },
                scale: { start: 1, end: 0, ease: 'Quart.in' },
                duration: 300,
                blendMode: BlendModes.ADD,
                stopAfter: 1,
            })

            const p2 = this.add.particles(32, 32, 'particle-3', {
                color: [0xfffff],
                lifespan: 500,
                alpha: { start: 1, end: 0, ease: 'Quad.out' },
                scale: { start: 1, end: 0, ease: 'Quart.in' },
                duration: 300,
                blendMode: BlendModes.ADD,
                stopAfter: 1,
            })
            // Move them on the screen with tweens
            this.add.tween({
                targets: this.firstSelectedCandy,
                x: this.secondSelectedCandy.x,
                y: this.secondSelectedCandy.y,
                ease: 'Quad.out',
                duration: 200,
                repeat: 0,
                yoyo: false,
                onUpdate: (tween: Phaser.Tweens.Tween, candy: Candy) => {
                    p1.x = candy.getCenter().x ?? 0
                    p1.y = candy.getCenter().y ?? 0
                },
            })

            this.add.tween({
                targets: this.secondSelectedCandy,
                x: this.firstSelectedCandy.x,
                y: this.firstSelectedCandy.y,
                ease: 'Quad.out',
                duration: 200,
                repeat: 0,
                yoyo: false,
                onUpdate: (tween: Phaser.Tweens.Tween, candy: Candy) => {
                    p2.x = candy.getCenter().x ?? 0
                    p2.y = candy.getCenter().y ?? 0
                },
                onComplete: () => {
                    this.checkMatches()
                },
            })

            this.firstSelectedCandy =
                this.candyGrid[firstY / CONST.tileHeight][firstX / CONST.tileWidth]
            this.secondSelectedCandy =
                this.candyGrid[secondY / CONST.tileHeight][secondX / CONST.tileWidth]
        }
    }

    private checkMatches(): void {
        //Call the getMatches function to check for spots where there is
        //a run of three or more tiles in a row
        const matches = this.getMatches(this.candyGrid as Candy[][])

        //If there are matches, remove them
        if (matches.length > 0) {
            //Remove the tiles
            this.removeCandyGroup(matches)
            // Move the tiles currently on the board into their new positions
            this.resetCandy()
            this.fillCandy().then(() => {
                //Fill the board with new tiles wherever there is an empty spot
                this.candyUp()
                this.checkMatches()
            })
        } else {
            // No match so just swap the tiles back to their original position and reset
            this.swapCandies()
            this.candyUp()
            this.canMove = true
        }
    }

    private resetCandy(): void {
        // Loop through each column starting from the left
        for (let y = this.candyGrid.length - 1; y > 0; y--) {
            // Loop through each tile in the column from bottom to top
            for (let x = this.candyGrid[y].length - 1; x >= 0; x--) {
                const t = y

                // If this space is blank, but the one above it is not, move the one above down
                if (this.candyGrid[t][x] === undefined && this.candyGrid[t - 1][x] !== undefined) {
                    const tempCandy = this.candyGrid[t - 1][x]
                    this.candyGrid[t][x] = tempCandy
                    this.candyGrid[t - 1][x] = undefined

                    this.add.tween({
                        targets: tempCandy,
                        y: CONST.tileHeight * t + this.candyGridOffset.y,
                        ease: 'Bounce.out',
                        duration: 500,
                    })

                    // The positions have changed, so start the process again from the bottom
                    // Set `x` and `y` to their maximum values to restart the loops
                    x = this.candyGrid[t].length
                    y = this.candyGrid.length - 1
                }
            }
        }
    }

    private fillCandy(): Promise<void> {
        return new Promise<void>((resolve) => {
            const veticalGrid: Candy[][] = []
            for (let y = 0; y < CONST.gridHeight; y++) {
                veticalGrid[y] = []
            }
            //Check for blank spaces in the grid and add new tiles at that position
            for (let y = 0; y < this.candyGrid.length; y++) {
                for (let x = 0; x < this.candyGrid[y].length; x++) {
                    if (this.candyGrid[y][x] === undefined) {
                        //Found a blank spot so lets add animate a tile there
                        const candy = this.addCandy(x, y)
                        veticalGrid[x].push(candy)
                        // candy.y -= CONST.tileHeight

                        // this.add.tween({
                        //     targets: candy,
                        //     y: candy.y + CONST.tileHeight,
                        //     ease: 'Bounce.out',
                        //     duration: 500,
                        // })

                        //And also update our "theoretical" grid
                        this.candyGrid[y][x] = candy
                    }
                }
            }

            for (let i = 0; i < veticalGrid.length; i++) {
                for (let j = 0; j < veticalGrid[i].length; j++) {
                    const candy = veticalGrid[i][j]
                    candy.y -= CONST.tileHeight * veticalGrid[i].length
                    this.add.tween({
                        targets: candy,
                        y: candy.y + CONST.tileHeight * veticalGrid[i].length,
                        ease: 'Bounce.out',
                        duration: 500,
                    })
                }
            }

            this.tweens.addCounter({
                duration: 500,
                onComplete: () => {
                    resolve()
                },
            })
        })
    }

    private candyUp(): void {
        // Reset active tiles
        this.firstSelectedCandy = undefined
        this.secondSelectedCandy = undefined
    }

    private removeCandyGroup(matches: Candy[][]): void {
        const flattenedMatches = matches.flat()
        // Loop through all the matches and remove the associated tiles
        for (const candy of flattenedMatches) {
            const candyPos = this.getTilePos(this.candyGrid as Candy[][], candy)

            if (candyPos.x !== -1 && candyPos.y !== -1) {
                candy.destroy()
                this.candyGrid[candyPos.y][candyPos.x] = undefined

                const { x, y } = candy.getCenter()

                this.add.particles(x, y, 'particle-1', {
                    color: [CANDY_COLORS[candy.candyType]],
                    lifespan: 500,
                    angle: { min: 0, max: 360 },
                    rotate: {
                        start: Random.Float(0, 360),
                        end: Random.Float(0, 360),
                    },
                    scale: {
                        start: Random.Float(0.4, 0.5),
                        end: 0,
                        ease: 'Back.in',
                    },
                    speed: { min: 100, max: 120 },
                    gravityY: 200,
                    duration: 300,
                    stopAfter: Phaser.Math.RND.between(2, 3),
                })

                this.add.particles(x, y, 'particle-2', {
                    lifespan: 500,
                    angle: { min: 0, max: 360 },
                    rotate: {
                        min: 0,
                        max: 360,
                        start: Random.Float(0, 360),
                        end: Random.Float(0, 360),
                    },
                    scale: {
                        start: Random.Float(1, 2),
                        end: 0,
                        ease: 'Back.in',
                    },
                    speed: { min: 100, max: 120 },
                    gravityY: 200,
                    duration: 300,
                    blendMode: BlendModes.ADD,
                    stopAfter: Phaser.Math.RND.between(3, 5),
                })

                this.add.particles(x, y, 'particle-3', {
                    color: [CANDY_COLORS[candy.candyType]],
                    lifespan: 500,
                    alpha: { start: 1, end: 0, ease: 'Quad.out' },
                    scale: { start: 0, end: 1, ease: 'Quart.out' },
                    duration: 300,
                    blendMode: BlendModes.ADD,
                    stopAfter: 1,
                })
            }
        }
    }

    private getTilePos(candyGrid: Candy[][], candy: Candy): Phaser.Math.Vector2 {
        const pos = new Phaser.Math.Vector2(-1, -1)

        //Find the position of a specific tile in the grid
        for (let y = 0; y < candyGrid.length; y++) {
            for (let x = 0; x < candyGrid[y].length; x++) {
                //There is a match at this position so return the grid coords
                if (candy === candyGrid[y][x]) {
                    pos.x = x
                    pos.y = y
                    break
                }
            }
        }

        return pos
    }

    private getMatches(candyGrid: Candy[][]): Candy[][] {
        const matches: Candy[][] = []
        const visited: boolean[][] = []

        // Initialize visited array
        for (let y = 0; y < candyGrid.length; y++) {
            visited[y] = []
            for (let x = 0; x < candyGrid[y].length; x++) {
                visited[y][x] = false
            }
        }

        // Check for horizontal matches
        for (let y = 0; y < candyGrid.length; y++) {
            for (let x = 0; x < candyGrid[y].length - 2; x++) {
                const candy = candyGrid[y][x]

                if (candy && !visited[y][x]) {
                    const match: Candy[] = [candy]
                    let matchLength = 1

                    for (let i = x + 1; i < candyGrid[y].length; i++) {
                        const nextCandy = candyGrid[y][i]

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
        for (let x = 0; x < candyGrid[0].length; x++) {
            for (let y = 0; y < candyGrid.length - 2; y++) {
                const candy = candyGrid[y][x]

                if (candy && !visited[y][x]) {
                    const match: Candy[] = [candy]
                    let matchLength = 1

                    for (let i = y + 1; i < candyGrid.length; i++) {
                        const nextCandy = candyGrid[i][x]

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
