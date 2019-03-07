import { Vertex } from "../vertex";
import { PathFinder } from "./pathfinder";
import { Grid } from "../grid";
import { Player } from "../player";

export class Wave extends PathFinder {
    d: number;
    wave: Vertex[];

    constructor(grid: Grid, isUsingDiagonal: boolean, player: Player) {
        super(grid, isUsingDiagonal, player);
        this.d = 0;

        let start = new Vertex(this.grid.startPoint, null);
        start.setD(this.d);
        this.wave = [start];
    }

    async work(): Promise<Vertex> {
        let result = null;
        do {
            this.d++;
            let set = this.wave;
            this.wave = [];
            for (let i = 0; i < set.length; i++) {
                await this.player.whait();
                result = this.step(set[i]);
            if (result) {
                return result;
            }
            }

        } while (this.wave.length > 0);
    }

    step(vertex: Vertex): Vertex {
        this.grid.savePoint(vertex);
        let neighbours = this.grid.neighbourNodes(vertex, this.isUsingDiagonal);
        this.grid.fillNeighbour(neighbours.map(r => r.point));

        for (let i = 0; i < neighbours.length; i++) {
            if (!this.vertexisExist(this.wave, neighbours[i])) {
                neighbours[i].parent = vertex;

                if (this.grid.checkGoal(neighbours[i].point)) {
                    return neighbours[i];
                }
                neighbours[i].setD(this.d);
                this.wave.push(neighbours[i]);
            }
        }

        return null;        
    }
}
