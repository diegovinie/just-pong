import * as Phaser from 'phaser';
import { IClickable } from '../definitions';

export interface ITextButtonProps {
    color?: string;
    hoverColor?: string;
    pressedColor?: string;
    onClick?: () => void;
    style?: Phaser.Types.GameObjects.Text.TextStyle;
}

export class TextButton extends Phaser.GameObjects.Text implements IClickable {
    color: string;
    hoverColor: string;
    pressedColor: string;
    onClick: () => void;

    constructor(scene: Phaser.Scene, x: number, y: number, text: string, props: ITextButtonProps) {
        const {
            style,
            color,
            hoverColor,
            pressedColor,
            onClick,
        } = props;

        super(scene, x, y, text, style);

        if (color)
            this.color = color;

        if (hoverColor)
            this.hoverColor = hoverColor;

        if (pressedColor)
            this.pressedColor = pressedColor;

        if (onClick)
            this.onClick = onClick;

        scene.add.existing(this);

        this.setColor(color);
        this.setInteractive();

        this.on('pointerover', this.onPointerAction(this, this.hoverColor), scene)
            .on('pointerout', this.onPointerAction(this, this.color), scene)
            .on('pointerdown', this.onPointerAction(this, this.pressedColor), scene)
            .on('pointerup', onClick, scene)
            .on('pointerup', this.onPointerAction(this, hoverColor), scene);
    }

    onPointerAction(text: Phaser.GameObjects.Text, color: string): () => void {
        return () => { text.setColor(color); }
    }

    static create(scene: Phaser.Scene, x: number, y: number, text: string, props: ITextButtonProps): TextButton {
        return new TextButton(scene, x, y, text, props);
    }
}