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
            }

            if (this.grid.checkGoal(result.point)) {
                return result;
            }

            result.setD(this.d);
            this.wave.push(result);
        } while (this.wave.length > 0);
    }

    step(vertex: Vertex): Vertex {
        let neighbours = this.grid.neighbourNodes(vertex, this.isUsingDiagonal);

        for (let i = 0; i < neighbours.length; i++) {
            if (!this.vertexisExist(this.wave, neighbours[i])) {
                neighbours[i].parent = vertex;

                return neighbours[i];
            }
        }
    }
}
