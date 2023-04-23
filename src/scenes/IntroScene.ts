import * as Phaser from 'phaser';

export let ws: WebSocket;

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
        const runGame = message => {
            console.log('run scene');
            this.scene.run('Play', message);
        };

        this.connectButton = this.createTextButton(60, 40, 'Start', {
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

    connectRoom(callback) {
        this.connectButton.text = 'Waiting';
        this.connectButton.disableInteractive();

        ws = new WebSocket(`ws://localhost:3000?userId=${Date.now()}`);

        ws.onopen = (e => {

            ws.onmessage = msgEvent => {
                const message = JSON.parse(msgEvent.data);

                if (message.action === 'start') {
                    console.log(message);

                    callback(message);
                }
            };

        });

    }
}
