import { CANDY_COLORS, SPECIAL_TYPE } from '../constants/CandyConstant'
import { PARTICLE_CONFIGS } from '../constants/ParticleConfigs'
import ConfettiProcessor from '../objects/custom-particles/ConfettiProcessor'
import GameScene from '../scenes/GameScene'
import { Random } from '../utils/Random'

const CONFETTI_COLORS = [
    CANDY_COLORS['blue'],
    CANDY_COLORS['green'],
    CANDY_COLORS['yellow'],
    CANDY_COLORS['purple'],
    CANDY_COLORS['orange'],
    CANDY_COLORS['red'],
]

class ParticleManager {
    private static scene: GameScene

    private static particleEmitters: Map<string, Phaser.GameObjects.Particles.ParticleEmitter>

    public static init(scene: GameScene) {
        this.scene = scene
        this.particleEmitters = new Map<string, Phaser.GameObjects.Particles.ParticleEmitter>()

        PARTICLE_CONFIGS.forEach((particleConfig) => {
            const particle = this.scene.add
                .particles(undefined, undefined, particleConfig.texture, particleConfig.config)
                .stop()

            this.particleEmitters.set(particleConfig.key, particle)

            if (particleConfig.key === 'left-confetti' || particleConfig.key === 'right-confetti') {
                particle.addParticleProcessor(
                    new ConfettiProcessor({
                        dampingX: 0.976,
                        dampingY: 0.99,
                    })
                )
            }
        })

        // this.scene.input.on('pointerdown', () => {
        //     this.playConfettiEffect()
        // })
    }

    public static playCandyExplodeEffect(x: number, y: number, color: number): void {
        const particle1Emitter = this.particleEmitters.get('broken-particle')
        const particle2Emitter = this.particleEmitters.get('twinkle')
        const particle3Emitter = this.particleEmitters.get('ring-impact')
        if (particle1Emitter && particle2Emitter && particle3Emitter) {
            particle1Emitter.particleTint = color
            particle3Emitter.particleTint = color
            particle1Emitter.setDepth(1).emitParticleAt(x, y, Random.Int(2, 3))
            particle2Emitter.setDepth(1).emitParticleAt(x, y, Random.Int(3, 5))
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

    public static playWrappedExplode(x: number, y: number, color: number): void {
        const particleEmitter = this.particleEmitters.get('wrapped-shockwave')

        if (particleEmitter) {
            particleEmitter.particleTint = color
            particleEmitter.setDepth(3)
            particleEmitter.emitParticleAt(x, y)
        }
    }

    public static playWrappedBigExplode(x: number, y: number, color: number): void {
        const particleEmitter = this.particleEmitters.get('wrapped-big-shockwave')

        if (particleEmitter) {
            particleEmitter.particleTint = color
            particleEmitter.setDepth(3)
            particleEmitter.emitParticleAt(x, y)
        }
    }

    public static playConfettiEffect() {
        const leftConfetti = this.particleEmitters.get('left-confetti')
        const rightConfetti = this.particleEmitters.get('right-confetti')

        if (leftConfetti && rightConfetti) {
            leftConfetti.setDepth(1)
            rightConfetti.setDepth(1)

            for (let i = 0; i < 50; i++) {
                leftConfetti.particleTint =
                    CONFETTI_COLORS[Random.Int(0, CONFETTI_COLORS.length - 1)]
                leftConfetti.emitParticleAt(0, this.scene.scale.height / 2 + 100)
            }

            for (let i = 0; i < 50; i++) {
                rightConfetti.particleTint =
                    CONFETTI_COLORS[Random.Int(0, CONFETTI_COLORS.length - 1)]
                rightConfetti.emitParticleAt(
                    this.scene.scale.width,
                    this.scene.scale.height / 2 + 100
                )
            }
        }
    }
}

export default ParticleManager
