import { Vertex } from "../vertex";
import { PathFinder } from "./pathfinder";
import { Grid } from "../grid";
import { Player } from "../player";

export class BFS extends PathFinder {
    queue: Vertex[];
    constructor(grid: Grid, isUsingDiagonal: boolean, player: Player) {
        super(grid, isUsingDiagonal, player);
        let start = new Vertex(this.grid.startPoint, null);
        start.setD(0);
        this.queue = [start];
    }

    async work(): Promise<Vertex> {
        while (this.queue.length > 0) {
            await this.player.whait();
            var result = this.step();  
            this.queue.push(result); //добавить в конец очереди

            if (this.grid.checkGoal(result.point)) { // проверить, не является ли точка финишем
                var result = this.queue.pop();

                return result;
            }          
        }
    }

    step(){
        let node = this.queue.shift();
            let neighbours = this.grid.neighbourNodes(node, this.isUsingDiagonal);

            for (let i = 0; i < neighbours.length; i++) { // все соседи точки
                let child = neighbours[i];

                if (child.parent == null) { // которые ещё не были посещены 
                    child.parent = node;
                    child.setD(node.d + 1);

                    return child;
                }
            }
    }
}