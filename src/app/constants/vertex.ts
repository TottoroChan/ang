import { CellType } from "../constants/index";

export class Vertex {
    point: number[];
    parent: Vertex;
    g: number;
    h: number;
    f: number;
    d: number;
    direction: number[];
    isWall: boolean;
    weight: number;

    constructor(point: number[], parent: Vertex) {
        this.point = point; // координата
        this.parent = parent;
        this.isWall = false;
        this.weight = 1;
        if (parent != null) {
            this.direction = [point[0] - parent.point[0], point[1] - parent.point[1]]
        }
    }

    setWeight(weight: number){
        this.weight+= weight/100;
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
        this.f = this.g + this.h + this.weight - 1;
    }

    setD(d: number) {
        this.d = d;
    }

    setParent(parent: Vertex) {
        this.parent = parent;
        this.direction = [this.point[0] - parent.point[0], this.point[1] - parent.point[1]]
    }

    setWall(value: number) {
        if (value != CellType.Wall)
            this.isWall = false;
        else this.isWall = true;
    }

    pathTo(neighbour: Vertex): number {
        return Math.abs(neighbour.point[0] - this.point[0]) + Math.abs(neighbour.point[1] - this.point[1])+neighbour.weight-1;
    }

}