import { BlendModes } from 'phaser'
import { IParticleConfig } from '../types/particle'
import { Random } from '../utils/Random'

export const PARTICLE_CONFIGS: IParticleConfig[] = [
    {
        key: 'broken-particle',
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
        },
    },
    {
        key: 'twinkle',
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
        },
    },
    {
        key: 'ring-impact',
        texture: 'particle-3',
        config: {
            lifespan: 500,
            alpha: { start: 1, end: 0, ease: 'Quad.in' },
            scale: { start: 0, end: 1, ease: 'Quart.out' },
            duration: 300,
            blendMode: BlendModes.ADD,
        },
    },
    {
        key: 'striped-line',
        texture: 'striped-line',
        config: {
            lifespan: 500,
            duration: 300,
            //alpha: { start: 0, end: 1, ease: 'Quad.out' },
            scale: 2,
            blendMode: BlendModes.ADD,
        },
    },
    {
        key: 'wrapped-shockwave',
        texture: 'particle-5',
        config: {
            lifespan: 500,
            duration: 300,
            alpha: { start: 1, end: 0, ease: 'Quirt.in' },
            scale: { start: 0, end: 4, ease: 'Cubic.out' },
            blendMode: BlendModes.ADD,
        },
    },
    {
        key: 'wrapped-big-shockwave',
        texture: 'particle-5',
        config: {
            lifespan: 500,
            duration: 300,
            alpha: { start: 1, end: 0, ease: 'Quirt.in' },
            scale: { start: 0, end: 8, ease: 'Cubic.out' },
            blendMode: BlendModes.ADD,
        },
    },
    {
        key: 'left-confetti',
        texture: 'square',
        config: {
            lifespan: 5000,
            scaleY: { start: 0.2, end: 1, random: true },
            alpha: { start: 1, end: 0, ease: 'Quart.in' },
            rotate: { start: 0, end: -3000, random: true },
            speedX: { min: 500, max: 2000 },
            speedY: { min: -500, max: -1500 },
            bounce: { min: 6, max: 16 },
            gravityY: 800,
        },
    },
    {
        key: 'right-confetti',
        texture: 'square',
        config: {
            scaleY: { start: 0.2, end: 1, random: true },
            lifespan: 5000,
            alpha: { start: 1, end: 0, ease: 'Quart.in' },
            rotate: { start: 0, end: 3000, random: true },
            speedX: { min: -500, max: -2000 },
            speedY: { min: -500, max: -1500 },
            bounce: { min: 6, max: 16 },
            gravityY: 800,
        },
    },
    {
        key: 'progress-bar-head',
        texture: 'particle-3',
        config: {
            scale: 0.5,
            lifespan: 5000,
            alpha: { start: 1, end: 0, ease: 'Quart.in' },
            rotate: { start: 0, end: 2000, random: true },
            speedX: { min: -500, max: -2000 },
            gravityY: 800,
        },
    },
]
