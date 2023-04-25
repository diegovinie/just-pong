import * as Phaser from 'phaser';
import { gameDefinitions } from '../definitions';

interface IButtonTextProps {
    size?: number;
    color?: string;
    hoverColor?: string;
    pressedColor?: string;
    onClick?: () => void;
    style?: Phaser.Types.GameObjects.Text.TextStyle;
}

export class PausedScene extends Phaser.Scene {
    constructor() {
        super('Paused')
    }

    create() {
        const { screen } = gameDefinitions;

        const onResume = () => {
            this.scene.resume('Play');
            this.scene.stop();
        };

        const paused = this.add.text(screen.width / 2, screen.height / 2 - 20, 'PAUSED', {
            fontSize: '40px',
        });

        paused.setOrigin(0.5, 0.5);


        const resumeButton = this.createTextButton(screen.width / 2, screen.height / 2 + 10, 'RESUME (P)', {
            color: '#AAAAAA',
            hoverColor: 'white',
            pressedColor: 'green',
            onClick: onResume,
            style: {
                fontSize: '18px',
            }
        });

        resumeButton.setOrigin(0.5, 0.5)

        const resumeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

        resumeKey.on('down', onResume, this);

    }

    createTextButton(x: number, y: number, text: string, props: IButtonTextProps): Phaser.GameObjects.Text {
        const {
            style,
            color,
            hoverColor,
            pressedColor,
            onClick,
        } = props;

        const textButton = this.add.text(x, y, text, style);

        textButton.setColor(color);
        textButton.setInteractive();

        textButton.on('pointerover', this.onPointerAction(textButton, hoverColor), this)
            .on('pointerout', this.onPointerAction(textButton, color), this)
            .on('pointerdown', this.onPointerAction(textButton, pressedColor), this)
            .on('pointerup', onClick, this)
            .on('pointerup', this.onPointerAction(textButton, hoverColor), this);

        return textButton;
    }

    onPointerAction(text: Phaser.GameObjects.Text, color: string) {
        return () => text.setColor(color);
    }
}