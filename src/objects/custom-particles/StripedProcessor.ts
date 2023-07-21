class StripedProcessor extends Phaser.GameObjects.Particles.ParticleProcessor {
    constructor() {
        super()
    }

    update(
        particle: Phaser.GameObjects.Particles.Particle,
        delta: number,
        step: number,
        t: number
    ): void {
        t = Phaser.Math.Easing.Quadratic.Out(t)
        particle.alpha = 1 - Math.abs(t * 2 - 1)
    }
}

export default StripedProcessor
