import { IPathFinder } from "./Ipathfinder";
import { Vertex } from "../vertex";
import { PlayerService } from 'src/app/services/player.service';
import { GridService } from 'src/app/services/grid.service';
import { StackService } from 'src/app/services/stack.service';
import { CellType } from '..';

export class Dijkstra extends IPathFinder {
    weight: number[];
    path: [number, any][];
    infinityValue: number;
    openSet: {id: number, w: number}[];

    constructor(isUsingDiagonal: boolean, playerService: PlayerService,
        gridService: GridService, stackService: StackService) {
        super(isUsingDiagonal, playerService, gridService, stackService);

        this.infinityValue = gridService.length * 2;
        this.path = [];
        this.weight = this.createArray(this.infinityValue);

        let id = gridService.toIndex(gridService.startPoint);
        this.weight[id] = 0;
        this.path[id] = [id, null];
        this.openSet = [{id: id, w: 0}];
        this.setStackData(this.openSet.map(x => this.gridService.toPoint(x.id)))        
    }

    createArray(value: any): any[] {
        let result: number[] = [];

        for (let i = 0; i < this.gridService.length; i++) {
            result[i] = value;
            this.path[i] = null;
        }

        return result;
    }

    async work(): Promise<Vertex> {

        while (this.openSet.length > 0) {

            await this.playerService.whait();
            let result = this.step();

            if (result) {
                return result;
            }

        }

        return null;
    }

    step(): Vertex {
        let v = this.getMin();
        this.setStackData(this.openSet.map(x => this.gridService.toPoint(x.id)))
        let point = this.gridService.toPoint(v);


        if (this.gridService.checkGoal(point)) {
            return new Vertex(point, null)
        }

        let neighbours = this.gridService.getNeighboursId(point, this.isUsingDiagonal)
        this.fillNeighbour(neighbours);

        neighbours.forEach(element => {
            let id = this.gridService.toIndex(element);
            let w = this.weight[v] + this.gridService.data[id] + 1;

            if (this.weight[id] > w) {
                this.weight[id] = w;
                this.path[id] = [id,this.path[v]];
                this.openSet.push({id, w});
            }
        });

        return null;
    }

    getMin(): any {
        let min = this.infinityValue;
        let id = -1;
        let splice = -1;

        this.openSet.forEach((element, i) => {
                if (element.w < min) {
                    min = element.w;
                    id = element.id;
                    splice = i;
                }
        });

        this.openSet.splice(splice, 1);

        return id;
    }

    reconstructPath(node: Vertex) {
        let result = [node.point];
        let path = this.path[this.gridService.toIndex(node.point)]

        while (path[1] != null) {
            result.push(this.gridService.toPoint(path[0]))
            path = path[1];
        }

        this.gridService.finish(result);
    }
}