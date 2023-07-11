export default class Pool<T> {
    private pool: T[]
    private createObject: () => T
    private getObject: (obj: T) => void
    private resetObject: (obj: T) => void

    constructor(createObject: () => T, getObject: (obj: T) => void, resetObject: (obj: T) => void) {
        this.pool = []
        this.createObject = createObject
        this.getObject = getObject
        this.resetObject = resetObject
    }

    public get(): T {
        let p = null
        if (this.pool.length === 0) {
            p = this.createObject()
        } else {
            p = this.pool.pop() as T
        }
        this.getObject(p)
        return p
    }

    public release(obj: T): void {
        if (this.pool.indexOf(obj) === -1) {
            this.resetObject(obj)
            this.pool.push(obj)
        }
    }

    public clear(): void {
        this.pool.length = 0
    }
}
