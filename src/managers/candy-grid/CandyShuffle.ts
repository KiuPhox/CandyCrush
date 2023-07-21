import { BoardState } from '../../constants/BoardState'
import { SPECIAL_TYPE } from '../../constants/CandyConstant'
import { GAME_CONFIG } from '../../constants/GameConfig'
import Candy from '../../objects/Candy'
import GameScene from '../../scenes/GameScene'
import { Random } from '../../utils/Random'
import BoardStateMachine from '../BoardStateMachine'
import CandyGrid from './CandyGrid'

const ROTATE_TWEEN_DUR = 1000
const MOVE_TWEEN_DUR = 500
const MOVE_TWEEN_DELAY = 500

class CandyShuffle {
    private static scene: GameScene

    private static rectangle: Phaser.Geom.Rectangle
    private static circle: Phaser.Geom.Circle
    private static triangle: Phaser.Geom.Triangle

    public static init(scene: GameScene) {
        this.scene = scene

        const center = new Phaser.Math.Vector2(scene.scale.width / 2, scene.scale.height / 2)

        const length = Math.min(
            GAME_CONFIG.gridWidth * GAME_CONFIG.tileWidth,
            GAME_CONFIG.gridHeight * GAME_CONFIG.tileHeight
        )

        this.rectangle = new Phaser.Geom.Rectangle(
            center.x - length / 2,
            center.y - length / 2,
            length,
            length
        )

        this.circle = new Phaser.Geom.Circle(center.x, center.y, length / 2)
        this.triangle = new Phaser.Geom.Triangle(
            center.x,
            center.y - (length * Math.sqrt(3)) / 4,
            center.x - length / 2,
            center.y + (length * Math.sqrt(3)) / 4,
            center.x + length / 2,
            center.y + (length * Math.sqrt(3)) / 4
        )
    }

    public static shuffle(candies: Candy[], shuffle: boolean): number {
        BoardStateMachine.getInstance().updateState(BoardState.CREATE)

        candies = Random.shuffleArray(candies)
        const shape = [this.rectangle, this.circle, this.triangle][Random.Int(0, 2)]
        const points = shape.getPoints(candies.length)

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
                            const point = shape.getPoint(index)
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
