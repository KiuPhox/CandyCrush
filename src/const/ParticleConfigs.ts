import { BlendModes } from 'phaser'
import { IParticleConfig } from '../types/particle'
import { Random } from '../utils/Random'

export const PARTICLE_CONFIGS: IParticleConfig[] = [
    {
        texture: 'particle-1',
        config: {
            lifespan: 500,
            angle: { min: 0, max: 360 },
            rotate: {
                start: Random.Float(0, 360),
                end: Random.Float(0, 360),
            },
            scale: {
                start: Random.Float(0.4, 0.5),
                end: 0,
                ease: 'Back.in',
            },
            speed: { min: 100, max: 120 },
            gravityY: 200,
            duration: 300,
            stopAfter: Random.Int(2, 3),
        },
    },
    {
        texture: 'particle-2',
        config: {
            lifespan: 500,
            angle: { min: 0, max: 360 },
            rotate: {
                min: 0,
                max: 360,
                start: Random.Float(0, 360),
                end: Random.Float(0, 360),
            },
            scale: {
                start: Random.Float(1, 2),
                end: 0,
                ease: 'Back.in',
            },
            speed: { min: 100, max: 120 },
            gravityY: 200,
            duration: 300,
            blendMode: BlendModes.ADD,
            stopAfter: Random.Int(3, 5),
        },
    },
    {
        texture: 'particle-3',
        config: {
            lifespan: 500,
            alpha: { start: 1, end: 0, ease: 'Quad.in' },
            scale: { start: 0, end: 1, ease: 'Quart.out' },
            duration: 300,
            blendMode: BlendModes.ADD,
            stopAfter: 1,
        },
    },
    {
        texture: 'particle-4',
        config: {
            lifespan: 500,
            duration: 300,
            alpha: { start: 0, end: 1, ease: 'Quad.out' },
            blendMode: BlendModes.ADD,
            stopAfter: 1,
        },
    },
]
