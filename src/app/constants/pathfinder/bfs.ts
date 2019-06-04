import { Vertex } from "../vertex";
import { IPathFinder } from "./Ipathfinder";
import { PlayerService } from 'src/app/services/player.service';
import { GridService } from 'src/app/services/grid.service';
import { StackService } from 'src/app/services/stack.service';

export class BFS extends IPathFinder {
    queue: Vertex[];
    levels: number[];

    constructor(isUsingDiagonal: boolean, playerService: PlayerService, 
        gridService: GridService, stackService: StackService ) {        
        super(isUsingDiagonal, playerService, gridService, stackService);

        let start = this.gridService.startPoint;
        this.levels = this.setLevels();
        this.levels[this.gridService.toIndex(start)] = 0;
        this.queue = [new Vertex(start, null)]
    }

    save(): object {
        return {
            queue: Object.assign(new Array(), this.queue), 
            levels: Object.assign(new Array(), this.levels)}
    }
    load(data) {
        this.queue = data.queue;
        this.levels = data.levels;

        this.updateEvents();
    }

    async work(): Promise<Vertex> {
        while (this.queue.length > 0) {
            let vertex = this.queue.shift();
            this.setCurrentPoint(vertex.point);
            this.setStackData(this.queue.map(x => x.point));

            await this.playerService.wait();
            let result = this.step(vertex);

            if (result) {
                return result;
            }
        }
    }

    step(vertex: Vertex) {
        let children = this.gridService.neighbourNodes(vertex, this.isUsingDiagonal)
        this.fillNeighbours(children.map(r => r.point));

        for (let i = 0; i < children.length; i++) {// все соседи точки
            let child = children[i];
            if (this.levels[this.gridService.toIndex(child.point)] == null) {// которые ещё не были посещены 
                child.parent = vertex;
                this.queue.push(child); //добавить в конец очереди
                this.setStackData(this.queue.map(x => x.point));
                this.levels[this.gridService.toIndex(child.point)] = this.levels[this.gridService.toIndex(vertex.point)] + 1;// и пометить как посещённые

                if (this.gridService.checkGoal(child.point)) {// проверить, не является ли точка финишем
                    return child;
                }
            }
        }

        return null;
    }

    setLevels(): any[] {
        let l = [];
        for (let i = 0; i < this.gridService.data.length; i++) {
            l.push(null)
        }
        return l;
    }

}