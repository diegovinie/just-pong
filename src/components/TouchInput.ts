import * as Phaser from 'phaser';

interface IPoint {
    x: number;
    y: number;
}

interface ITouchButton {
    touchable: Phaser.GameObjects.GameObject;
    icon: Phaser.GameObjects.Triangle | Phaser.GameObjects.Rectangle;
    isDown: boolean;
    onPointerDown: () => void;
    onPointerUp: () => void;
}

export class TouchInput {
    alphaBase: number = 0.5;
    scene: Phaser.Scene;
    position: IPoint;
    buttonUp: ITouchButton;
    buttonDown: ITouchButton;

    constructor(scene: Phaser.Scene, position: IPoint) {
        this.scene = scene;
        this.position = position;

        this.buttonUp = this.createButton({ x: position.x, y: position.y - 30 }, 25, Math.PI);
        this.buttonDown = this.createButton({ x: position.x, y: position.y + 30 }, 25, 0);
    }


    createButton(position: IPoint, radius: number, rot: number): ITouchButton {
        const buttonObject: ITouchButton = {
            icon: this.createTriangle(position, radius, rot),
            touchable: this.scene.add.circle(position.x, position.y, radius, 0xffffff, 0.2),
            isDown: false,
            onPointerDown: () => {},
            onPointerUp: () => {},

        };

        buttonObject.onPointerDown = () => {
            buttonObject.icon.setAlpha(1);
            buttonObject.isDown = true;
        };

        buttonObject.onPointerUp = () => {
            buttonObject.icon.setAlpha(this.alphaBase);
            buttonObject.isDown = false;
        };

        buttonObject.touchable.setInteractive();
        buttonObject.touchable.on('pointerdown', buttonObject.onPointerDown);
        buttonObject.touchable.on('pointerup', buttonObject.onPointerUp);

        return buttonObject;
    }

    getTrianglePoints(radius: number, rot: number = 0): { p1: IPoint; p2: IPoint; p3: IPoint} {
        const ang1 = Math.PI * 7 / 6 + rot;
        const ang2 = -Math.PI / 6 + rot;
        const ang3 = Math.PI / 2 + rot;

        return {
            p1: {
                x: Math.cos(ang1) * radius,
                y: Math.sin(ang1) * radius,

            },
            p2: {
                x: Math.cos(ang2) * radius,
                y: Math.sin(ang2) * radius,
            },
            p3: {
                x: Math.cos(ang3) * radius,
                y: Math.sin(ang3) * radius,
            },
        };
    }

    createTriangle(position: IPoint, radius: number, rot: number): Phaser.GameObjects.Triangle {
        const { p1, p2, p3 } = this.getTrianglePoints(radius, rot);

        return this.scene.add.triangle(position.x, position.y, p1.x, p1.y, p2.x, p2.y , p3.x, p3.y, 0x6f00ff)
            .setOrigin(0, 0)
            .setAlpha(this.alphaBase);
    }
}