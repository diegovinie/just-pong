import * as Phaser from 'phaser';
import { IntroScene } from './scenes/IntroScene';
import { PlayScene } from './scenes/PlayScene';
import { gameDefinitions } from './definitions';

const config = {
    type: Phaser.AUTO,
    backgroundColor: gameDefinitions.screen.bgColor,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'thegame',
        width: gameDefinitions.screen.width,
        height: gameDefinitions.screen.height,
    },
    physics: {
        default: 'arcade',
    },
    scene: [IntroScene, PlayScene],
};

const game = new Phaser.Game(config);
