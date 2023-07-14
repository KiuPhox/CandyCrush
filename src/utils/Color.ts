export class Color {
    public static HexToRRB(hex: number): Phaser.Types.Display.ColorObject {
        return Phaser.Display.Color.IntegerToRGB(hex)
    }

    public static RGBtoHex(rgb: { r: number; b: number; g: number }): number {
        return (rgb.r << 16) + (rgb.g << 8) + rgb.b
    }

    public static Shade(
        rgb: Phaser.Types.Display.ColorObject,
        amount: number
    ): Phaser.Types.Display.ColorObject {
        rgb.r = Math.floor(rgb.r * (1 - amount))
        rgb.g = Math.floor(rgb.g * (1 - amount))
        rgb.b = Math.floor(rgb.b * (1 - amount))
        return rgb
    }
}
