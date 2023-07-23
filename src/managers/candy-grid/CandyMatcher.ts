import { CANDY_TYPE } from '../../constants/CandyConstant'
import { Cell } from '../../types/candy'
import { IMatch } from '../../types/match'

class CandyMatcher {
    private static visited: boolean[][]
    private static matches: IMatch[]
    private static grid: Cell[][]

    public static init(grid: Cell[][]): void {
        this.visited = []
        this.matches = []
        this.grid = grid
    }

    public static getMatches(): IMatch[] {
        this.visited = []
        this.matches = []
        this.initializeVisitedArray()
        this.checkHorizontalMatches()
        this.initializeVisitedArray()
        this.checkVerticalMatches()

        return this.matches
    }

    public static checkHorizontalMatches(): void {
        for (let y = 0; y < this.grid.length; y++) {
            for (let x = 0; x < this.grid[y].length - 2; x++) {
                const candy = this.grid[y][x]

                if (candy && candy.getCandyType() !== CANDY_TYPE.COLOR && !this.visited[y][x]) {
                    const match: IMatch = { candies: [candy], type: 'horizontal' }
                    let matchLength = 1

                    for (let i = x + 1; i < this.grid[y].length; i++) {
                        const nextCandy = this.grid[y][i]

                        if (nextCandy && nextCandy.getCandyType() === candy.getCandyType()) {
                            match.candies.push(nextCandy)
                            matchLength++
                        } else {
                            break
                        }
                    }

                    if (matchLength >= 3) {
                        this.matches.push(match)
                        this.markVisitedCandies(match)
                    }
                }
            }
        }
    }

    private static checkVerticalMatches(): void {
        for (let x = 0; x < this.grid[0].length; x++) {
            for (let y = 0; y < this.grid.length - 2; y++) {
                const candy = this.grid[y][x]

                if (candy && candy.getCandyType() !== CANDY_TYPE.COLOR && !this.visited[y][x]) {
                    const match: IMatch = { candies: [candy], type: 'vertical' }
                    let matchLength = 1

                    for (let i = y + 1; i < this.grid.length; i++) {
                        const nextCandy = this.grid[i][x]

                        if (nextCandy && nextCandy.getCandyType() === candy.getCandyType()) {
                            match.candies.push(nextCandy)
                            matchLength++
                        } else {
                            break
                        }
                    }

                    if (matchLength >= 3) {
                        this.matches.push(match)
                        this.markVisitedCandies(match)
                    }
                }
            }
        }
    }

    public static markVisitedCandies(match: IMatch): void {
        match.candies.forEach((matchCandy) => {
            const candyY = matchCandy.gridY
            const candyX = matchCandy.gridX
            if (this.visited[candyY] && this.visited[candyY][candyX] === false) {
                this.visited[candyY][candyX] = true
            }
        })
    }

    public static initializeVisitedArray(): void {
        for (let y = 0; y < this.grid.length; y++) {
            this.visited[y] = []
            for (let x = 0; x < this.grid[y].length; x++) {
                this.visited[y][x] = false
            }
        }
    }
}

export default CandyMatcher
