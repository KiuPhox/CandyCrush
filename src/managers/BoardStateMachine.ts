import { BoardState } from '../const/BoardState'
import StateMachine from '../utils/StateMachine'

export class BoardStateMachine extends StateMachine<BoardState> {
    constructor() {
        super('board', BoardState.IDLE)
    }

    protected handleStateChange(): void {
        //
    }
}

export default BoardStateMachine
