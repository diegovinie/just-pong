import * as Phaser from 'phaser';
import { IClickable, gameDefinitions } from '../definitions';

const { theme } = gameDefinitions;

const hexToString = (hex: number) => `#${hex.toString(16)}`;

export interface ITextButtonProps {
    color?: number;
    hoverColor?: number;
    pressedColor?: number;
    onClick?: () => void;
    style?: Phaser.Types.GameObjects.Text.TextStyle;
    sfx?: Phaser.Sound.HTML5AudioSound;
}

export class TextButton extends Phaser.GameObjects.Text implements IClickable {
    color: number = theme.secondary;
    hoverColor: number = theme.bright;
    pressedColor: number = theme.active;
    onClick: () => void;
    sfx?: Phaser.Sound.HTML5AudioSound;

    constructor(scene: Phaser.Scene, x: number, y: number, text: string, props: ITextButtonProps) {
        const {
            style,
            color,
            hoverColor,
            pressedColor,
            onClick,
            sfx,
        } = props;

        super(scene, x, y, text, style);

        if (color)
            this.color = color;

        if (hoverColor)
            this.hoverColor = hoverColor;

        if (pressedColor)
            this.pressedColor = pressedColor;

        if (sfx)
            this.sfx = sfx;

        if (onClick)
            this.onClick = onClick;

        scene.add.existing(this);

        this.setColor(hexToString(this.color));
        this.setInteractive();

        this.on('pointerover', this.onPointerAction(this, this.hoverColor), scene)
            .on('pointerout', this.onPointerAction(this, this.color), scene)
            .on('pointerdown', this.onPointerAction(this, this.pressedColor), scene)
            .on('pointerdown', () => { this.sfx?.play(); }, scene)
            .on('pointerup', onClick, scene)
            .on('pointerup', this.onPointerAction(this, this.hoverColor), scene);
    }

    onPointerAction(text: Phaser.GameObjects.Text, color: number): () => void {
        return () => { text.setColor(hexToString(color)); }
    }

    static create(scene: Phaser.Scene, x: number, y: number, text: string, props: ITextButtonProps): TextButton {
        return new TextButton(scene, x, y, text, props);
    }
}