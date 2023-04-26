import * as Phaser from 'phaser';
import { PlayDefinitions } from '../definitions';
import { TextButton } from '../components/TextButton';
import { JPong } from '../common/Grid';

type RunGame = (message: PlayDefinitions) => void;

export class IntroScene extends Phaser.Scene {
    singleButton: Phaser.GameObjects.Text;
    multiplayerButton: Phaser.GameObjects.Text;

    constructor() {
        super('Intro');
    }

    preload() {

    }

    create() {
        const runGame: RunGame = def => {
            this.scene.run('Play', def);
        };

        this.scene.run('Score', { a: 4 , b: 0 });
        this.scene.stop();

        this.singleButton = TextButton.create(this, 20, 40, 'Single', {
            onClick: () => {
                runGame({ type: 'single', position: 'a' });
            },
            color: '#ffaaff',
            hoverColor: '#ff0000',
            pressedColor: '#4400ff',
            style: {},
        });

        this.multiplayerButton = TextButton.create(this, 120, 40, 'Multiplayer', {
            onClick: () => this.connectRoom(runGame),
            color: '#ffaaff',
            hoverColor: '#ff0000',
            pressedColor: '#4400ff',
            style: {},
        });
    }

    connectRoom(callback: RunGame) {
        this.multiplayerButton.text = 'Waiting';
        this.multiplayerButton.disableInteractive();

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
