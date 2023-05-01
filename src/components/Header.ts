import * as Phaser from 'phaser';
import { JPong } from '../common/Grid';
import { GameComm } from '../definitions';
import { TextButton } from './TextButton';

export class Header {
    scene: Phaser.Scene;
    socket: GameComm;

    constructor(scene: Phaser.Scene, socket: GameComm) {
        this.scene = scene;
        this.socket = socket;

        this.init();
    }

    init() {
        const grid = new JPong.Grid(this.scene, 1, 4, {
            cellDimensions: { width: 80, height: 20 },
            center: { x: 180, y: 20 },
            widthPlaceholder: true,
        });

        const restartButton = TextButton.create(this.scene, 0, 0, 'RESTART', {
            onClick: () => {
                this.scene.scene.restart();
            },
        });

        const pauseButton = TextButton.create(this.scene, 0, 0, 'PAUSE', {
            onClick: () => {
                this.socket.send(JSON.stringify({ action: 'pause' }));
            },
        });

        grid.add(restartButton, 1, 1);
        grid.add(pauseButton, 1, 2);
    }
}