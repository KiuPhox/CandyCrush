abstract class StateMachine<T> {
    private static instance: StateMachine<any>
    protected currentState: T
    protected previousState: T

    public emitter: Phaser.Events.EventEmitter
    protected name: string

    constructor(name: string, initialState: T) {
        this.name = name
        this.currentState = initialState
        this.previousState = initialState
        this.emitter = new Phaser.Events.EventEmitter()
    }

    public static getInstance<T extends StateMachine<any>>(): T {
        if (!this.instance) {
            this.instance = new (this as any)()
        }
        return this.instance as T
    }

    public updateState(newState: T): void {
        if (this.currentState === newState) return

        this.previousState = this.currentState
        this.currentState = newState

        this.handleStateChange()
        this.emitter.emit(this.name + '-state-changed', this.currentState, this.previousState)
    }

    protected abstract handleStateChange(): void

    public getCurrentState(): T | undefined {
        return this.currentState
    }

    public getPreviousState(): T | undefined {
        return this.previousState
    }
}

export default StateMachine
