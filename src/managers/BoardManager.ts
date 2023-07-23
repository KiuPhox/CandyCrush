import { BoardState } from '../constants/BoardState'

class BoardManager {
    private static currentState: BoardState
    private static previousState: BoardState

    public static emitter: Phaser.Events.EventEmitter

    public static init(): void {
        this.currentState = BoardState.CREATE
        this.previousState = BoardState.CREATE
        this.emitter = new Phaser.Events.EventEmitter()
    }

    public static updateState(newState: BoardState): void {
        if (this.currentState === newState) return

        this.previousState = this.currentState
        this.currentState = newState
        this.emitter.emit('board-state-changed', this.currentState, this.previousState)
    }

    public static getCurrentState(): BoardState {
        return this.currentState
    }

    public static getPreviousState(): BoardState {
        return this.previousState
    }
}

export default BoardManager
