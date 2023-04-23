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

export interface PlayDefinitions {
    action: 'start';
    position: PlayerPosition;
    userId: number;
}
