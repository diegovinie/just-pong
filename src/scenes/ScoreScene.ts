import * as Phaser from 'phaser';
import { TextButton } from '../components/TextButton';
import { gameDefinitions } from '../definitions';
import { JPong } from '../common/Grid';

interface IScore {
    a: number;
    b: number;
}

export class ScoreScene extends Phaser.Scene {
    board: Phaser.GameObjects.Rectangle;
    scoreA: Phaser.GameObjects.Text;
    scoreB: Phaser.GameObjects.Text;
    continueButton: TextButton;

    constructor() {
        super('Score');
    }

    create(score: IScore) {
        const { screen } = gameDefinitions;
        console.log('ScoreScene', score);

        const textStyle: Phaser.Types.GameObjects.Text.TextStyle = {
            fontSize: '32px',
        };

        const onContinue = () => {

        };

        const grid = new JPong.Grid(this, 2, 3, {
            // widthPlaceholder: true,
            center: { x: screen.width / 2, y: screen.height / 2 - 20},
            cellDimensions: { width: 80, height: 60 },
        })

        const halfWidth = screen.width / 2;
        const halfHeight = screen.height / 2;

        this.board = this.add.rectangle(halfWidth, halfHeight, halfWidth, halfHeight, 0x000000, 0.5);

        const playerA = this.add.text(0, 0, 'A', textStyle);
        const playerB = this.add.text(0, 0, 'B', textStyle);

        this.scoreA = this.add.text(halfWidth - 20, halfHeight, score.a.toString(), textStyle);
        this.scoreB = this.add.text(halfWidth + 20, halfHeight, score.b.toString(), textStyle);

        grid.addMany([
            [1, 1, playerA],
            [1, 3, playerB],
            [2, 1, this.scoreA],
            [2, 3, this.scoreB],
        ]);

        this.continueButton = TextButton.create(this, halfWidth, halfHeight + 60, 'CONTINUE', {
            onClick: onContinue,
            color: 'white',
            hoverColor: 'yellow',
            // style: textStyle,
        });

        this.continueButton.setOrigin(0.5, 0.5);
    }
}