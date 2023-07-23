import { CANDY_TYPE, SPECIAL_TYPE } from '../constants/CandyConstant'
import { ICandy } from '../types/candy'
import Candy from './Candy'

class BigCandy extends Candy {
    constructor(c: ICandy) {
        super(c)
        this.setScale(0)
    }

    public show(
        x: number,
        y: number,
        candyType: CANDY_TYPE,
        specialType: SPECIAL_TYPE,
        onComplete?: () => void
    ): void {
        this.setScale(0)
        this.setPosition(x, y)
        this.setCandyType(candyType)
        this.setSpecialType(specialType)

        this.scene.tweens.add({
            targets: this,
            scale: 1,
            duration: 300,
            ease: 'Back.out',
            onComplete: () => {
                if (onComplete) onComplete()
            },
        })
    }
}

export default BigCandy
