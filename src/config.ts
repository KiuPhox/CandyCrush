import BootScene from './scenes/BootScene'
import GameScene from './scenes/GameScene'

export const GameConfig: Phaser.Types.Core.GameConfig = {
    title: 'Candy crush',
    url: 'https://github.com/digitsensitive/phaser3-typescript',
    version: '2.0',
    scale: {
        width: 520,
        height:
            window.innerHeight > window.innerWidth
                ? (520 * window.innerHeight) / window.innerWidth
                : 700,
        parent: 'phaser-game',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },

    type: Phaser.WEBGL,
    parent: 'game',
    scene: [BootScene, GameScene],
    backgroundColor: '#de3412',
    render: { pixelArt: false, antialias: true },
}
