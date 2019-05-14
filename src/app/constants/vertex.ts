import { CellType } from "../constants/index";

export class Vertex {
    point: number[];
    parent: Vertex;
    g: number;
    h: number;
    f: number;
    weight: number;
    waveNumber: number;
    direction: number[];

    constructor(point: number[], parent: Vertex) {
        this.point = point; // координата
        this.parent = parent;
        this.weight = 1;
        if (parent != null) {
            this.direction = [point[0] - parent.point[0], point[1] - parent.point[1]]
        }
    }

    setWeight(weight: number) {
        this.weight += weight / 100;
    }

    setG(start: number[]) {
        this.g = Math.abs(start[0] - this.point[0]) + Math.abs(start[1] - this.point[1]);
    }

    setH(finish: number[], type: string) {
        let dx: number = Math.abs(this.point[0] - finish[0]);
        let dy: number = Math.abs(this.point[1] - finish[1]);
        switch (type) {
            case "cheb":
                this.h = Math.max(dx, dy)
                break;
            case "manh":
                this.h = dx + dy
                break;
            case "eucl":
                this.h = Math.sqrt(dx * dx + dy * dy); 
                break;
            default:
                break;
        }
    }

    setF() {
        this.f = this.g + this.h;
    }

    setWaveNumber(d: number) {
        this.waveNumber = d;
    }

    setParent(parent: Vertex) {
        this.parent = parent;
        this.direction = [this.point[0] - parent.point[0], this.point[1] - parent.point[1]]
    }

}