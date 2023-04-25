export const gameDefinitions = {
    screen: {
        width: 600,
        height: 400,
        padding: 20,
        bgColor: 0x002200,
    },
    walls: {
        thickness: 20,
        color: 0xffF0ff,
    },
    paddle: {
        length: 80,
        thickness: 20,
        color: 0xffF0ff,
        playerColor: 0xaaffff,
        speed: 100,
    },

    ball: {
        size: 20,
        color: 0xffF0ff,
    },
    tick: 100,
};

export enum PlayerMove {
    UP,
    DOWN,
}

export type Paddle = Phaser.GameObjects.Rectangle;

export type GameKey = 'keyUp' | 'keyDown';

export interface IPlayer {
    gameObject: Paddle;
    inputs: Record<PlayerMove, boolean> | {};
    position: PlayerPosition;
    inputDef: Record<GameKey, Phaser.Input.Keyboard.Key>;
}

export type PlayerPosition = 'a' | 'b';

export interface ISingleGame {
    type: 'single';
    position: PlayerPosition;
}

export interface IMultiplayerGame {
    type: 'multiplayer';
    position: PlayerPosition;
    userId: number;
    socket: WebSocket;
}
export type PlayDefinitions = ISingleGame | IMultiplayerGame;

export interface IConnector {
    onmessage: (ev: { data: string; }) => void;
    send(data: string): void;
}

export type GameComm = WebSocket | IConnector;

export interface ICanConnect {
    socket: GameComm;
}

export interface IEnemyAI {}

export interface IHaveEnemyAI {
    enemy: IEnemyAI;
}

export interface IPong {
    ball: Phaser.GameObjects.Rectangle;
    environment: Record<string, Phaser.GameObjects.GameObject>;
}

type ClickCallback = () => void;

export interface IClickable {
    color: string;
    hoverColor: string;
    pressedColor: string;
    onClick: ClickCallback;
    onPointerAction(text: Phaser.GameObjects.GameObject, color: string): ClickCallback;
}
