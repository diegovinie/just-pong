import * as Phaser from 'phaser';
import { PlayDefinitions, gameDefinitions } from '../definitions';
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
        this.load.audio('hit', 'assets/hit.wav');
    }

    create() {
        const { screen } = gameDefinitions;
        const buttonStyle: Phaser.Types.GameObjects.Text.TextStyle = {
            fontFamily: 'ArcadeFont',
            fontSize: '28px',
        };

        const sfx = this.sound.add('hit') as Phaser.Sound.HTML5AudioSound;

        const runGame: RunGame = def => {
            this.scene.run('Play', def);
        };

        const title = this.add.text(screen.width / 2, screen.height / 2 - 50, 'Just Pong!', {
            fontSize: '56px',
            fontFamily: 'ArcadeFont',
        });

        title.setOrigin(0.5, 0.5);

        this.singleButton = TextButton.create(this, 0, 0, 'Single', {
            onClick: () => {
                runGame({ type: 'single', position: 'a' });
            },
            style: buttonStyle,
            sfx: sfx,
        });

        this.multiplayerButton = TextButton.create(this, 0, 0, 'Multiplayer', {
            onClick: () => this.connectRoom(runGame),
            style: buttonStyle,
            sfx: sfx,
        });

        const grid = new JPong.Grid(this, 1, 2, {
            widthPlaceholder: true,
            center: {
                x: screen.width / 2,
                y: screen.height / 2,
            },
            cellDimensions: {
                width: 140,
                height: 30,
            },
        });

        grid.add(this.singleButton, 1, 1);
        grid.add(this.multiplayerButton, 1, 2);
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
