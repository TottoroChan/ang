import { Vertex } from "../vertex";
import { PathFinder } from "./pathfinder";
import { Grid } from "../grid";
import { Player } from "../player";

export class BFS extends PathFinder {
    queue: Vertex[];
    levels: any[];

    constructor(grid: Grid, isUsingDiagonal: boolean, player: Player) {
        super(grid, isUsingDiagonal, player);

        let start = this.grid.startPoint;
        this.levels = this.setLevels();
        this.levels[this.grid.decryptValue(start)] = 0;
        this.queue = [new Vertex(start, null)]
    }

    async work(): Promise<Vertex> {
        let result = null;
        while (this.queue.length > 0) {
            let vertex = this.queue.shift();

            await this.player.whait();
            result = this.step(vertex);

            if (result) {
                return result;
            }
        }
    }

    step(vertex: Vertex) {
        this.grid.savePoint(vertex);
        let children = this.grid.neighbourNodes(vertex, this.isUsingDiagonal)
        this.grid.fillNeighbour(children.map(r => r.point));

        for (let i = 0; i < children.length; i++) {// все соседи точки
            let child = children[i];
            if (this.levels[this.grid.decryptValue(child.point)] == null) {// которые ещё не были посещены 
                child.parent = vertex;
                this.queue.push(child); //добавить в конец очереди
                this.levels[this.grid.decryptValue(child.point)] = this.levels[this.grid.decryptValue(vertex.point)] + 1;// и пометить как посещённые

                if (this.grid.checkGoal(child.point)) {// проверить, не является ли точка финишем
                    return child;
                }
            }
        }

        return null;
    }

    setLevels(): any[] {
        var l = [];
        for (var i = 0; i < this.grid.dataMatrix.length; i++) {
            l.push(null)
        }
        return l;
    }

}