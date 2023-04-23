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
};

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
