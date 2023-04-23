import * as Phaser from 'phaser';
import { PlayerPosition, PlayDefinitions } from '../definitions';

export let ws: WebSocket;

type RunGame = (message: PlayDefinitions) => void;

interface IButtonTextProps {
    size?: number;
    color?: string;
    hoverColor?: string;
    pressedColor?: string;
    onClick?: () => void;
    style?: Phaser.Types.GameObjects.Text.TextStyle;
}

export class IntroScene extends Phaser.Scene {
    connectButton: Phaser.GameObjects.Text;

    constructor() {
        super('Intro');
    }

    preload() {

    }

    create() {
        const runGame: RunGame = def => {
            this.scene.run('Play', def);
        };

        this.connectButton = this.createTextButton(20, 40, 'Single', {
            onClick: () => {
                runGame({ type: 'single', position: 'a' });
            },
            color: '#ffaaff',
            hoverColor: '#ff0000',
            pressedColor: '#4400ff',
            style: {},
        });

        this.connectButton = this.createTextButton(120, 40, 'Multiplayer', {
            onClick: () => this.connectRoom(runGame),
            color: '#ffaaff',
            hoverColor: '#ff0000',
            pressedColor: '#4400ff',
            style: {},
        });
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

    connectRoom(callback: RunGame) {
        this.connectButton.text = 'Waiting';
        this.connectButton.disableInteractive();

        ws = new WebSocket(`ws://localhost:3000?userId=${Date.now()}`);

        ws.onopen = (e => {

            ws.onmessage = msgEvent => {
                const message = JSON.parse(msgEvent.data);

                if (message.action === 'start') {
                    console.log(message);
                    const gameDefs: PlayDefinitions = {
                        position: message.position,
                        userId: message.userId,
                        type: 'multiplayer',
                        socket: ws,
                    }

                    callback(gameDefs);
                }
            };

        });

    }
}
