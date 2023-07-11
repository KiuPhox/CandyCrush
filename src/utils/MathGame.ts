export class MathGame {
    public static Lerp(a: number, b: number, t: number): number {
        return a + t * (b - a)
    }
}
