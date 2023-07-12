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

    public static shuffleArray<T>(array: T[]): T[] {
        const shuffledArray = [...array]

        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]
        }

        return shuffledArray
    }
}
