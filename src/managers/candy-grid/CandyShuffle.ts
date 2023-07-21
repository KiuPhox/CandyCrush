import { BoardState } from '../../constants/BoardState'
import { SPECIAL_TYPE } from '../../constants/CandyConstant'
import { GAME_CONFIG } from '../../constants/GameConfig'
import Candy from '../../objects/Candy'
import GameScene from '../../scenes/GameScene'
import { Random } from '../../utils/Random'
import BoardStateMachine from '../BoardStateMachine'
import CandyGrid from './CandyGrid'

const ROTATE_TWEEN_DUR = 2000
const MOVE_TWEEN_DUR = 500
const MOVE_TWEEN_DELAY = 500

const DEGREE_ANGLE_OFFSETS = [0, 0, 0, 30, 0, -18, 0, 12.85714286, 0, 0, 0, 0]

class CandyShuffle {
    private static scene: GameScene

    private static shapes: (Phaser.Geom.Polygon | Phaser.Geom.Circle)[]

    public static init(scene: GameScene) {
        this.scene = scene
        this.shapes = []

        const center = new Phaser.Math.Vector2(scene.scale.width / 2, scene.scale.height / 2)

        const radius =
            Math.min(
                GAME_CONFIG.gridWidth * GAME_CONFIG.tileWidth,
                GAME_CONFIG.gridHeight * GAME_CONFIG.tileHeight
            ) / 2

        this.shapes.push(new Phaser.Geom.Circle(center.x, center.y, radius))

        for (let i = 3; i <= 8; i++) {
            this.shapes.push(this.createPolygon(i, center, radius))
        }
    }

    private static createPolygon(
        numVertices: number,
        circleCenter: Phaser.Math.Vector2,
        circleRadius: number
    ): Phaser.Geom.Polygon {
        if (numVertices < 3) {
            throw new Error('A polygon must have at least 3 vertices.')
        }

        const vertices: Phaser.Math.Vector2[] = []
        const angleIncrement = (2 * Math.PI) / numVertices
        const angleOffset = Phaser.Math.DegToRad(DEGREE_ANGLE_OFFSETS[numVertices])

        for (let i = 0; i < numVertices; i++) {
            const x = circleRadius * Math.cos(i * angleIncrement + angleOffset)

            const y = circleRadius * Math.sin(i * angleIncrement + angleOffset)

            vertices.push(new Phaser.Math.Vector2(x + circleCenter.x, y + circleCenter.y))
        }

        return new Phaser.Geom.Polygon(vertices)
    }

    public static shuffle(candies: Candy[], shuffle: boolean): number {
        BoardStateMachine.getInstance().updateState(BoardState.CREATE)

        candies = Random.shuffleArray(candies)
        const shape = this.shapes[Random.Int(0, this.shapes.length - 1)]
        const points = shape.getPoints(candies.length)
        const oneThousandPoints = shape.getPoints(1001)

        for (let i = 0; i < candies.length; i++) {
            const temp = i / candies.length
            const candy = candies[i]

            this.scene.add.tween({
                targets: candy,
                x: points[i].x,
                y: points[i].y,
                duration: MOVE_TWEEN_DUR,
                ease: 'Quad.out',
                onComplete: () => {
                    if (shuffle && candy.getSpecialType() !== SPECIAL_TYPE.COLOR_BOMB) {
                        candy.setCandyType(
                            GAME_CONFIG.candyTypes[
                                Phaser.Math.RND.between(0, GAME_CONFIG.candyTypes.length - 1)
                            ]
                        )
                    }

                    this.scene.tweens.addCounter({
                        from: temp,
                        to: temp + 1,
                        duration: ROTATE_TWEEN_DUR,
                        ease: 'Linear',
                        onComplete: () => {
                            this.scene.add.tween({
                                targets: candy,
                                x: CandyGrid.getCandyWorldPos(candy).x,
                                y: CandyGrid.getCandyWorldPos(candy).y,
                                duration: MOVE_TWEEN_DUR,
                                ease: 'Quad.out',
                                delay: MOVE_TWEEN_DELAY,
                            })
                        },
                        onUpdate: (tween: Phaser.Tweens.Tween) => {
                            let index = tween.getValue()
                            if (index > 1) index -= 1
                            const point = oneThousandPoints[Math.round(index * 1000)]
                            candy.setPosition(point.x, point.y)
                        },
                    })
                },
            })
        }

        return MOVE_TWEEN_DUR + ROTATE_TWEEN_DUR + MOVE_TWEEN_DUR + MOVE_TWEEN_DELAY + 100
    }
}

export default CandyShuffle
