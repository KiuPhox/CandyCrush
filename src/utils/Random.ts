import { Color } from './Color'

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

    public static Color(colorA: number, colorB: number): number {
        const rgbA = Color.HexToRRB(colorA)
        const rgbB = Color.HexToRRB(colorB)

        const t = Math.random()

        const r = Phaser.Math.Linear(rgbA.r, rgbB.r, t)
        const g = Phaser.Math.Linear(rgbA.g, rgbB.g, t)
        const b = Phaser.Math.Linear(rgbA.b, rgbB.b, t)

        return Color.RGBtoHex({ r: r, g: g, b: b })
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
