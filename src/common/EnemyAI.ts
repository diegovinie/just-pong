import { PlayScene } from "../scenes/PlayScene";
import { PlayerMove, IPlayer } from "../definitions";

export class EnemyAI {
    tickerId: number;
    scene: PlayScene;
    player: IPlayer;
    hasActions: boolean;

    constructor(scene: PlayScene) {
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
        }, PlayScene.TICK * (8/9));
    }
}
