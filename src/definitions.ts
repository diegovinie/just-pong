export const theme = {
    bright: 0xfffffc,
    primary: 0x95B2B0,
    secondary: 0x647AA3,
    active: 0xC6EBBE,
    panel: 0x334195,
    bg: 0x020887,
};

export const gameDefinitions = {
    screen: {
        landscape: {
            width: 600,
            height: 400,
        },
        vertical: {
            width: 400,
            height: 600,
        },
        current: {
            width: 600,
            height: 400,
        }
    },
    field: {
        width: 550,
        height: 400,
        padding: 20,
        bgColor: theme.bg,
    },
    walls: {
        thickness: 20,
        color: theme.primary,
    },
    paddle: {
        length: 80,
        thickness: 20,
        color: theme.primary,
        playerColor: theme.active,
        speed: 100,
    },

    ball: {
        size: 20,
        color: theme.primary,
    },
    tick: 100,
    theme,
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
    startGame(): void;
}

type ClickCallback = () => void;

export interface IClickable {
    color: number;
    hoverColor: number;
    pressedColor: number;
    onClick: ClickCallback;
    onPointerAction(text: Phaser.GameObjects.GameObject, color: number): ClickCallback;
}
