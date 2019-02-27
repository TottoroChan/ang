import { CellType } from "./helper";

export class Vertex {
    point: number[];
    parent: Vertex;
    g: number;
    h: number;
    f: number;
    d: number;
    direction: number[];
    isWall: boolean;

    constructor(point: number[], parent: Vertex) {
        this.point = point; // координата
        this.parent = parent;
        this.isWall = false;
        if (parent != null) {
            this.direction = [point[0] - parent.point[0], point[1] - parent.point[1]]
        }
    }

    setG(start: number[]) {
        this.g = Math.abs(start[0] - this.point[0]) + Math.abs(start[1] - this.point[1]);
    }

    setH(useDiagonal: boolean, finish: number[]) {
        if (useDiagonal) {
            this.h = Math.max(Math.abs(this.point[0] - finish[0]), Math.abs(this.point[1] - finish[1]));
        }
        else {
            this.h = Math.abs(this.point[0] - finish[0]) + Math.abs(this.point[1] - finish[1]);
        }
    }

    setF() {
        this.f = this.g + this.f;
    }

    setD(d: number) {
        this.d = d;
    }

    setWall(value: number) {
        if (value != CellType.Wall)
            this.isWall = false;
        else this.isWall = true;
    }

    pathTo(point: number[]): number {
        return Math.abs(point[0] - this.point[0]) + Math.abs(point[1] - this.point[1]);
    }

}