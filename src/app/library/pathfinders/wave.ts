import { Vertex } from "../vertex";
import { PathFinder } from "./pathfinder";
import { Grid } from "../grid";
import { Observable, of } from "rxjs";

export class Wave extends PathFinder {
    d: number;

    constructor(grid: Grid,isUsingDiagonal: boolean) {
        super(grid, isUsingDiagonal);
        this.d = 0;
    }
    
    work(): Vertex {
        return null;
      /*  let start = new Vertex(this.grid.startPoint, null);
        start.setD(this.d);
        let wave = [start];
        do {
            this.d++;
            let set = wave;
            wave = [];
            for (let e = 0; e < set.length; e++) {
                let neighbours = this.grid.neighbourNodes(set[e], this.isUsingDiagonal);
                for (let i = 0; i < neighbours.length; i++) {
                    if (!this.vertexisExist(wave, neighbours[i])) {
                        neighbours[i].parent = set[e];
                        if (this.grid.checkGoal(neighbours[i].point)) {
                            return neighbours[i];
                        }
                        neighbours[i].setD(this.d);
                        wave.push(neighbours[i]);
                    }
                }
            }
        } while (wave.length > 0);*/
    }
}
