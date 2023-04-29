import * as Phaser from 'phaser';
import { IntroScene } from './scenes/IntroScene';
import { PlayScene } from './scenes/PlayScene';
import { PausedScene } from './scenes/PausedScene';
import { ScoreScene } from './scenes/ScoreScene';
import { gameDefinitions } from './definitions';

const config = {
    type: Phaser.AUTO,
    backgroundColor: gameDefinitions.theme.bg,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: 'thegame',
        width: gameDefinitions.screen.current.width,
        height: gameDefinitions.screen.current.height,
    },
    physics: {
        default: 'arcade',
    },
    scene: [IntroScene, PlayScene, PausedScene, ScoreScene],
};

const game = new Phaser.Game(config);
