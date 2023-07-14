import { SPECIAL_TYPE } from '../const/CandyConstant'
import { PARTICLE_CONFIGS } from '../const/ParticleConfigs'
import GameScene from '../scenes/GameScene'

class ParticleManager {
    private static scene: GameScene

    private static particleEmitters: Map<string, Phaser.GameObjects.Particles.ParticleEmitter>

    public static init(scene: GameScene) {
        this.scene = scene
        this.particleEmitters = new Map<string, Phaser.GameObjects.Particles.ParticleEmitter>()

        PARTICLE_CONFIGS.forEach((particleConfig) => {
            this.particleEmitters.set(
                particleConfig.key,
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
        const particle1Emitter = this.particleEmitters.get('broken-particle')
        const particle2Emitter = this.particleEmitters.get('twinkle')
        const particle3Emitter = this.particleEmitters.get('ring-impact')

        if (particle1Emitter && particle2Emitter && particle3Emitter) {
            particle1Emitter.particleTint = color
            particle3Emitter.particleTint = color
            particle1Emitter.setDepth(1).emitParticleAt(x, y)
            particle2Emitter.setDepth(1).emitParticleAt(x, y)
            particle3Emitter.emitParticleAt(x, y)
        }
    }

    public static playCandyExplodeByStriped(
        x: number,
        y: number,
        specialType: SPECIAL_TYPE,
        color: number
    ): void {
        const particleEmitter = this.particleEmitters.get('striped-line')

        if (particleEmitter) {
            particleEmitter.particleTint = color
            particleEmitter.particleRotate =
                specialType === SPECIAL_TYPE.HORIZONTAL_STRIPED ? 90 : 0
            particleEmitter.setDepth(3)
            particleEmitter.emitParticleAt(x, y)
        }
    }
}

export default ParticleManager
