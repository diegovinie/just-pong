import * as Phaser from 'phaser';
import { PlayDefinitions } from '../definitions';
import { TextButton } from '../components/TextButton';

type RunGame = (message: PlayDefinitions) => void;

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

        this.connectButton = TextButton.create(this, 20, 40, 'Single', {
            onClick: () => {
                runGame({ type: 'single', position: 'a' });
            },
            color: '#ffaaff',
            hoverColor: '#ff0000',
            pressedColor: '#4400ff',
            style: {},
        });

        this.connectButton = TextButton.create(this, 120, 40, 'Multiplayer', {
            onClick: () => this.connectRoom(runGame),
            color: '#ffaaff',
            hoverColor: '#ff0000',
            pressedColor: '#4400ff',
            style: {},
        });
    }

    connectRoom(callback: RunGame) {
        this.connectButton.text = 'Waiting';
        this.connectButton.disableInteractive();

        const ws = new WebSocket(`ws://localhost:3000?userId=${Date.now()}`);

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
