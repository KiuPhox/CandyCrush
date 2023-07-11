import { BoardState } from '../const/BoardState'
import { StateMachine } from '../utils/StateMachine'

export default class BoardStateMachine extends StateMachine<BoardState> {
    constructor() {
        super('board', BoardState.IDLE)
    }

    protected handleStateChange(): void {
        //console.log(this.currentState)
    }
}
