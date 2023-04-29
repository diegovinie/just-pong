import * as Phaser from 'phaser';
import { gameDefinitions } from '../definitions';
import { TextButton } from '../components/TextButton';

export class PausedScene extends Phaser.Scene {
    constructor() {
        super('Paused')
    }

    create() {
        const { field } = gameDefinitions;

        const onResume = () => {
            this.scene.resume('Play');
            this.scene.stop();
        };

        const paused = this.add.text(field.width / 2, field.height / 2 - 20, 'PAUSED', {
            fontSize: '48px',
            fontFamily: 'ArcadeFont',
        });

        paused.setOrigin(0.5, 0.5);


        const resumeButton = TextButton.create(this, field.width / 2, field.height / 2 + 20, 'RESUME (P)', {
            onClick: onResume,
            style: {
                fontSize: '28px',
                fontFamily: 'ArcadeFont',
            }
        });

        resumeButton.setOrigin(0.5, 0.5)

        const resumeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

        resumeKey.on('down', onResume, this);

    }
}
