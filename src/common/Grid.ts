
import * as Phaser from 'phaser';

export namespace JPong {
    type Transform = Phaser.GameObjects.Components.Transform;
    type EventEmitter = Phaser.Events.EventEmitter;
    type Origin = Phaser.GameObjects.Components.Origin;
    type Row = number;
    type Col = number;

    interface Point {
        x: number;
        y: number;
    }

    interface IGridProps {
        center: Point;
        cellDimensions: { width: number; height: number };
        widthPlaceholder?: boolean;
    }

    interface IGridObject extends Transform, EventEmitter, Origin {}

    export class Grid {
        center: { x: number; y: number };
        cellDimensions: { width: number; height: number };
        rows: number;
        cols: number;
        grid: IGridObject[][];

        constructor(scene: Phaser.Scene, rows: number, cols: number, props: IGridProps) {
            const {
                center,
                cellDimensions,
                widthPlaceholder,
            } = props;

            const grid: IGridObject[][] = [];
            this.cellDimensions = cellDimensions;
            this.center = center;
            this.rows = rows;
            this.cols = cols;

            for (let i = 0; i < rows; i++) {
                const row: IGridObject[] = [];

                for (let j = 0; j < cols; j++) {
                    const placeholder = widthPlaceholder ? scene.add.rectangle(0, 0, cellDimensions.width - 2, cellDimensions.height - 2, 0x00ffff, 1.0) : null;

                    row.push(placeholder);
                }
                grid.push(row);
            }

            this.grid = grid
            this.recalculateCoords();

            // console.log('Grid', this.grid);
        }

        add(go: IGridObject, row: Row, col: Col) {
            this.replace(go, row, col);

            this.recalculateCoords();
        }

        replace(go: IGridObject, row: Row, col: Col) {
            const old = this.grid[row - 1][col - 1];

            if (old)
                old.destroy();

            this.grid[row - 1][col - 1] = go;
        }

        addMany(entries: [Row, Col, IGridObject][]) {
            entries.forEach(([row, col, go]) => this.replace(go, row, col));

            this.recalculateCoords();
        }

        recalculateCoords() {
            const { width, height } = this.cellDimensions;
            const totalWidth = width * this.cols;
            const totalHeight = height * this.rows;

            for (let j = 0; j < this.rows; j++) {

                for (let i = 0; i < this.cols; i++) {
                    const go = this.grid[j][i];

                    if (go) {
                        const preX = i * width;
                        const preY = j * height;

                        const x = preX + this.center.x + (width - totalWidth) / 2;
                        const y = preY + this.center.y + (height - totalHeight) / 2;

                        go.x = x;
                        go.y = y;

                        go.setOrigin(0.5, 0.5);
                    }
                }
            }
        }

        setCenter(x: number, y: number) {
            this.center = { x, y };
        }

        setCellDimensions(width: number, height: number) {
            this.cellDimensions = { width, height };
        }
    }
}
