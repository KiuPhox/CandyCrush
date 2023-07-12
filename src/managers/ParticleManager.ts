import { PARTICLE_CONFIGS } from '../const/ParticleConfigs'
import GameScene from '../scenes/GameScene'

export class ParticleManager {
    private static scene: GameScene

    private static particleEmitters: Map<string, Phaser.GameObjects.Particles.ParticleEmitter>

    public static init(scene: GameScene) {
        this.scene = scene
        this.particleEmitters = new Map<string, Phaser.GameObjects.Particles.ParticleEmitter>()

        PARTICLE_CONFIGS.forEach((particleConfig) => {
            this.particleEmitters.set(
                particleConfig.texture,
                this.scene.add.particles(
                    undefined,
                    undefined,
                    particleConfig.texture,
                    particleConfig.config
                )
            )
        })
    }

    public static playCandyExplodeEffect(x: number, y: number, color: number): void {
        const particle1Emitter = this.particleEmitters.get('particle-1')
        const particle2Emitter = this.particleEmitters.get('particle-2')
        const particle3Emitter = this.particleEmitters.get('particle-3')

        if (particle1Emitter && particle2Emitter && particle3Emitter) {
            particle1Emitter.particleTint = color
            particle3Emitter.particleTint = color
            particle1Emitter.emitParticleAt(x, y)
            particle2Emitter.emitParticleAt(x, y)
            particle3Emitter.emitParticleAt(x, y)
        }
    }
}
