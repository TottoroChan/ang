import { Vertex } from "../vertex";
import { PathFinder } from "./pathfinder";
import { Grid } from "../grid";
import { Observable, of } from "rxjs";

export class BFS extends PathFinder {
    queue: Vertex[];
    constructor(grid: Grid, isUsingDiagonal: boolean) {
        super(grid, isUsingDiagonal);
        let start = new Vertex(this.grid.startPoint, null);
        start.setD(0);
        this.queue = [start];
    }

    work(): Vertex {
        return null;
      /*  while (this.queue.length > 0) {
            let node = this.queue.shift();
            let neighbours = this.grid.neighbourNodes(node, this.isUsingDiagonal);

            for (let i = 0; i < neighbours.length; i++) { // все соседи точки
                let child = neighbours[i];

                if (child.parent == null) { // которые ещё не были посещены 
                    child.parent = node;
                    child.setD(node.d + 1);
                    this.queue.push(child); //добавить в конец очереди

                    if (this.grid.checkGoal(child.point)) { // проверить, не является ли точка финишем
                        var result = this.queue.pop();
                        return result;
                    }
                }
            }
        }*/
    }
}