import { PlayerMove, IPlayer, ICanConnect, IHaveEnemyAI, IPong, gameDefinitions, IEnemyAI } from "../definitions";

interface IScene extends Phaser.Scene, ICanConnect, IHaveEnemyAI, IPong {}

export class EnemyAI implements IEnemyAI {
    tickerId: number;
    scene: IScene;
    player: IPlayer;
    hasActions: boolean;

    constructor(scene: IScene) {
        this.scene = scene;
    }

    setPlayer(player: IPlayer) {
        this.player = player;
    }

    planNextAction() {
        const ball = this.scene.ball;
        const paddle = this.player.gameObject;

        if ((ball.y - ball.height / 2) < paddle.y) {
            // DOWN
            this.hasActions = true;
            this.player.inputs[PlayerMove.DOWN] = true;
        } else if ((ball.y + ball.height / 2) > paddle.y) {
            // UP
            this.hasActions = true;
            this.player.inputs[PlayerMove.UP] = true;
        }
    }

    publishActions() {
        this.scene.socket.send(JSON.stringify({
            action: 'update',
            player: this.player.position,
            inputs: this.player.inputs,
        }));
    }

    start() {
        this.tickerId = setInterval(() => {
            this.planNextAction();

            if (this.hasActions) {
                this.publishActions();
            }
        }, gameDefinitions.tick * (8/9));
    }
}
