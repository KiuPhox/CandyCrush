class ConfettiProcessor extends Phaser.GameObjects.Particles.ParticleProcessor {
    private dampingX: number
    private dampingY: number

    constructor(param: { dampingX?: number; dampingY?: number }) {
        super()
        this.dampingX = param.dampingX ?? 0.95
        this.dampingY = param.dampingY ?? this.dampingX
    }

    update(
        particle: Phaser.GameObjects.Particles.Particle,
        delta: number,
        step: number,
        t: number
    ): void {
        particle.velocityX *= this.dampingX
        particle.velocityY *= this.dampingY
        particle.scaleX = (((t * Math.ceil(Math.abs(particle.bounce))) % 1) - 0.5) * 2
    }
}

export default ConfettiProcessor
