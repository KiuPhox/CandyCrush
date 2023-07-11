export class Random {
    public static Float(min: number, max: number): number {
        return Math.random() * (max - min) + min
    }

    public static Int(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    public static Percent(percent: number): boolean {
        return this.Float(0, 100) <= percent
    }
}
