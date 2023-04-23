import * as Phaser from 'phaser';
import { ws } from './IntroScene';
import { gameDefinitions } from '../definitions';

type Rectangle = Phaser.GameObjects.Rectangle;
type PlayerPosition = 'a' | 'b';
type GameKey = 'keyUp' | 'keyDown';

enum PlayerMove {
    UP,
    DOWN,
}

interface IPlayer {
    gameObject: Rectangle;
    inputs: Record<PlayerMove, boolean> | {};
    position: PlayerPosition;
    inputDef: Record<GameKey, Phaser.Input.Keyboard.Key>;
}

export class PlayScene extends Phaser.Scene {
    environment: Record<string, Rectangle>;
    players: Record<string, IPlayer>;
    keys: Record<string, Phaser.Input.Keyboard.Key> = {};
    ball: Rectangle;
    position: string;
    userId: number;
    tickerId: number; // NodeJS.Timer;
    static TICK: number = 100;

    constructor(){
        super('Play');
    }

    preload() {

    }

    create(def) {
        this.position = def.position;
        this.userId = def.userId;

        const { screen, walls, paddle, ball } = gameDefinitions;

        const bg = this.add.rectangle(0, 0, screen.width, screen.height, screen.bgColor).setOrigin(0, 0);

        const topWall = this.add.rectangle(
            screen.padding,
            screen.padding,
            screen.width - 2 * screen.padding,
            walls.thickness,
            walls.color)
            .setOrigin(0, 0);

        const bottomWall = this.add.rectangle(
            screen.padding,
            screen.height - 2 * screen.padding,
            screen.width - 2 * screen.padding,
            walls.thickness,
            walls.color)
            .setOrigin(0, 0);

        this.physics.add.existing(topWall, true);
        this.physics.add.existing(bottomWall, true);

        this.environment = { bg, topWall, bottomWall };

        const paddleA = this.add.rectangle(
            2 * screen.padding,
            screen.height / 2,
            paddle.thickness,
            paddle.length,
            this.position === 'a' ? paddle.playerColor : paddle.color,
        );

        const paddleB = this.add.rectangle(
            screen.width - 2 * screen.padding,
            screen.height / 2,
            paddle.thickness,
            paddle.length,
            this.position === 'b' ? paddle.playerColor : paddle.color,
        );



        this.ball = this.add.rectangle(
            screen.width / 2,
            screen.height / 2,
            ball.size,
            ball.size,
            ball.color,
        );

        this.physics.add.existing(paddleA);
        this.physics.add.existing(paddleB);
        this.physics.add.existing(this.ball);


        paddleA.body.pushable = false;
        paddleA.body.bounce.y = 0;
        paddleB.body.pushable = false;

        const colliderTop = (paddle, wall) => {
            paddle.y = wall.y + wall.height + paddle.height / 2 + 1;
        }
        const colliderBottom = (paddle, wall) => {
            paddle.y = wall.y - (paddle.height / 2 + 1);
        }

        this.physics.add.collider(this.ball, topWall);
        this.physics.add.collider(this.ball, bottomWall);
        this.physics.add.collider(this.ball, paddleA);
        this.physics.add.collider(this.ball, paddleB);
        this.physics.add.collider(paddleA, topWall, colliderTop);
        this.physics.add.collider(paddleA, bottomWall, colliderBottom);
        this.physics.add.collider(paddleB, topWall, colliderTop);
        this.physics.add.collider(paddleB, bottomWall, colliderBottom);

        this.ball.body.velocity.x = 50;
        this.ball.body.velocity.y = -60;
        this.ball.body.bounce.x = 1.1;
        this.ball.body.bounce.y = 1.1;

        this.input.keyboard.addCapture([
            Phaser.Input.Keyboard.KeyCodes.UP,
            Phaser.Input.Keyboard.KeyCodes.DOWN,
            Phaser.Input.Keyboard.KeyCodes.W,
            Phaser.Input.Keyboard.KeyCodes.S,
        ]);


        this.players = {
            a: { gameObject: paddleA, inputs: {}, position: 'a', inputDef: this.createInputDef('a') },
            b: { gameObject: paddleB, inputs: {}, position: 'b', inputDef: this.createInputDef('b') }
        };


        this.startTicker();

        ws.onmessage = msgEvent => {
            const message = JSON.parse(msgEvent.data);

            if (message.action === 'update') {
                this.players[message.player].inputs = { ...message.inputs };

                this.movePlayers();
            }
        }
    }

    update(time: number, delta: number): void {

    }

    startTicker() {
        this.tickerId = setInterval(() => {
            const inputs: IPlayer['inputs'] = {};
            let hadAction = false;
            const player: IPlayer = this.players[this.position];

            if (player.inputDef.keyUp.isDown) {
                inputs[PlayerMove.DOWN] = true;
                hadAction = true;
            }

            if (player.inputDef.keyDown.isDown) {
                inputs[PlayerMove.UP] = true;
                hadAction = true;
            }

            if (hadAction) {
                ws.send(JSON.stringify({ action: 'update', player: this.position, inputs }));
            }

        }, PlayScene.TICK);
    }

    movePlayers() {
        const { paddle } = gameDefinitions;
        const duration = PlayScene.TICK;

        for (const pos in this.players) {
            const player = this.players[pos];

            if (player.inputs[PlayerMove.DOWN]) {
                this.tweens.add({
                    targets: player.gameObject,
                    duration,
                    y: player.gameObject.y - paddle.speed * duration * 1e-3,
                })
            }

            if (player.inputs[PlayerMove.UP]) {
                this.tweens.add({
                    targets: player.gameObject,
                    duration,
                    y: player.gameObject.y + paddle.speed * duration * 1e-3,
                })
            }

            player.inputs = {};
        }
    }

    createInputDef(position: PlayerPosition): Record<GameKey, Phaser.Input.Keyboard.Key> {
        switch (position) {
            case 'b':
                return {
                    keyUp: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
                    keyDown: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
                };
            case 'a':
                return {
                    keyUp: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
                    keyDown: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
                };
            default:
                console.log(`Player ${position} not found`);

                break;
        }
    }
}