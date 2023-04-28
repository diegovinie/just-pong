import * as Phaser from 'phaser';
import {
    gameDefinitions,
    PlayerPosition,
    PlayDefinitions,
    IPong,
    ICanConnect,
    IHaveEnemyAI,
    GameComm
} from '../definitions';
import { PlayerMove, IPlayer, Paddle, GameKey } from '../definitions';
import { EnemyAI } from '../common/EnemyAI';
import { SocketEmulator } from '../common/SocketEmulator';

export class PlayScene extends Phaser.Scene implements IPong, ICanConnect, IHaveEnemyAI {
    environment: Record<string, Phaser.GameObjects.GameObject>;
    players: Record<PlayerPosition, IPlayer>;
    ball: Phaser.GameObjects.Rectangle;
    position: PlayerPosition;
    userId: number;
    tickerId: number; // NodeJS.Timer;
    socket: GameComm;
    enemy: EnemyAI;
    onPlay: boolean;
    score = { a: 0, b: 0 };
    sounds: Record<string, Phaser.Sound.HTML5AudioSound>;

    constructor(){
        super('Play');
    }

    preload() {
        this.load.audio('bounce', 'assets/bounce.wav');
        this.load.audio('hit', 'assets/hit.wav');
        this.load.audio('score', 'assets/score.wav');
    }

    create(def: PlayDefinitions) {
        if (def.type === 'multiplayer') {
            this.userId = def.userId;
            this.socket = def.socket;

        } else if (def.type === 'single') {
            this.socket = new SocketEmulator();
            this.enemy = new EnemyAI(this);
        }

        this.position = def.position;

        const { screen, walls, paddle, ball } = gameDefinitions;

        this.sounds = {
            bounce: this.sound.add('bounce') as Phaser.Sound.HTML5AudioSound,
            hit: this.sound.add('hit') as Phaser.Sound.HTML5AudioSound,
            score: this.sound.add('score') as Phaser.Sound.HTML5AudioSound,
        };

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

        this.createBall();

        this.environment.goalA = this.getGoal('a');
        this.environment.goalB = this.getGoal('b');

        const paddleA = this.getPaddle('a');
        const paddleB = this.getPaddle('b');

        this.input.keyboard.addCapture([
            Phaser.Input.Keyboard.KeyCodes.UP,
            Phaser.Input.Keyboard.KeyCodes.DOWN,
            Phaser.Input.Keyboard.KeyCodes.W,
            Phaser.Input.Keyboard.KeyCodes.S,
        ]);

        const pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

        pauseKey.on('down', () => {
            this.scene.launch('Paused')
            this.scene.pause();
        }, this);

        this.players = {
            a: { gameObject: paddleA, inputs: {}, position: 'a', inputDef: this.getInputDef('a') },
            b: { gameObject: paddleB, inputs: {}, position: 'b', inputDef: this.getInputDef('b') }
        };

        this.startGame();

        if (def.type === 'single') {
            this.enemy.setPlayer(this.players.b);
            this.enemy.start();
        }

        this.startTicker();

        this.socket.onmessage = msgEvent => {
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
                this.socket.send(JSON.stringify({ action: 'update', player: this.position, inputs }));
            }

        }, gameDefinitions.tick);
    }

    movePlayers() {
        const { paddle } = gameDefinitions;
        const duration = gameDefinitions.tick;

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

    getInputDef(position: PlayerPosition): Record<GameKey, Phaser.Input.Keyboard.Key> {
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

    createBall() {
        const { ball,screen } = gameDefinitions;
        const { topWall, bottomWall } = this.environment;

        const onWallCollide = () => {
            this.sounds.bounce.play();
        };

        this.ball = this.add.rectangle(
            screen.width / 2,
            screen.height / 2,
            ball.size,
            ball.size,
            ball.color,
        );

        this.physics.add.existing(this.ball);

        this.physics.add.collider(this.ball, topWall, onWallCollide);
        this.physics.add.collider(this.ball, bottomWall, onWallCollide);

        const body = this.ball.body as Phaser.Physics.Arcade.Body;

        body.bounce.x = 1.1;
        body.bounce.y = 1.1;
    }

    getPaddle(position: PlayerPosition): Paddle {
        const { screen, paddle } =  gameDefinitions;

        const colliderTop = (paddle, wall) => {
            paddle.y = wall.y + wall.height + paddle.height / 2 + 1;
        };

        const colliderBottom = (paddle, wall) => {
            paddle.y = wall.y - (paddle.height / 2 + 1);
        };

        const onBallCollide = () => {
            this.sounds.hit.play();
        };

        const coordX = position == 'a' ? (2 * screen.padding) : (screen.width - 2 * screen.padding);

        const paddleGO: Paddle = this.add.rectangle(
            coordX,
            screen.height / 2,
            paddle.thickness,
            paddle.length,
            this.position === position ? paddle.playerColor : paddle.color,
        );

        this.physics.add.existing(paddleGO);

        const body = paddleGO.body as Phaser.Physics.Arcade.Body;

        body.pushable = false;
        body.bounce.y = 0;

        const { topWall, bottomWall } = this.environment;

        this.physics.add.collider(paddleGO, topWall, colliderTop);
        this.physics.add.collider(paddleGO, bottomWall, colliderBottom);
        this.physics.add.collider(this.ball, paddleGO, onBallCollide);

        return paddleGO;
    }

    getGoal(position: PlayerPosition): Phaser.GameObjects.Rectangle {
        const { screen } = gameDefinitions;
        const width = 10;
        const coordX = position === 'b' ? 0 : screen.width - width;

        const onBallCollide = () => {
            if (this.onPlay) {
                this.onPlay = false;
                this.score[position]++;
                this.sounds.score.play();

                this.scene.launch('Score', this.score);
            }
        }

        const goal = this.add.rectangle(
            coordX,
            0,
            width,
            screen.height,
            0xbada55,
            0
        ).setOrigin(0, 0);

        this.physics.add.existing(goal);

        this.physics.add.overlap(this.ball, goal, onBallCollide, null, this);

        return goal;
    }

    startGame() {
        const { screen } = gameDefinitions;

        this.onPlay = true;

        this.ball.x = screen.width / 2;
        this.ball.y = screen.height / 2;

        const body = this.ball.body as Phaser.Physics.Arcade.Body;

        body.velocity.x = 50 * (Math.random() > 0.5 ? 1 : -1);
        body.velocity.y = -60;
    }
}