import { IPathFinder } from "./Ipathfinder";
import { Vertex } from "../vertex";
import { PlayerService } from 'src/app/services/player.service';
import { GridService } from 'src/app/services/grid.service';
import { StackService } from 'src/app/services/stack.service';
import { CellType } from '..';

export class Dijkstra extends IPathFinder {
    weight: number[];
    visited: boolean[];
    p: object[];
    infinityValue: number;

    constructor(isUsingDiagonal: boolean, playerService: PlayerService, 
        gridService: GridService, stackService: StackService ) {        
        super(isUsingDiagonal, playerService, gridService, stackService);

        this.infinityValue = gridService.length * 2;
        this.visited = [];
        this.p = [];
        this.weight = this.createArray(this.infinityValue);
        let id = gridService.toIndex(gridService.startPoint);
        this.weight[id] = 0;
        this.p[id] = {id};
    }

    createArray(value: any): any[] {
        let result: number[] = [];

        for (let i = 0; i < this.gridService.length; i++) {
            result[i] = value;
            if (this.gridService.data[i] == CellType.Wall)
                this.visited[i] = true;
            else this.visited[i] = false;
            this.p[i] = null;
        }

        return result;
    }

    async work(): Promise<Vertex> {
       return this.djkstra();
    }
    djkstra(): any {
        while(this.notVisitedExist()){
            let v = this.getMin();
            let point = this.gridService.toPoint(v);
            this.visited[v] = true;

            let neighbours = this.gridService.getNeighboursId(point, this.isUsingDiagonal)
            neighbours.forEach(element => {
                let id = this.gridService.toIndex(element);
                let w = this.weight[v] + this.gridService.data[id]+1;

                if(this.weight[id]>w){
                    this.weight[id] = w;
                    this.p[id] = [this.p[v], id];
                }
            });
        }

        console.log("-------------------------------")
        console.log(this.visited)
        console.log(this.p)
        console.log(this.weight)
        return null;
    }
    getMin(): any {
        let min = this.infinityValue;
        let id = -1;

        this.weight.forEach((element, i) => {
            if (this.check(i)) {
                if (element < min) {
                    min = element;
                    id = i;
                }
            }
        });

        return id;
    }
    notVisitedExist(): any {
        for (let i = 0; i < this.visited.length; i++) {
            if (!this.visited[i])
                return true;            
        }

        return false;
    }
    check(index: any): any {
        if (this.visited[index]){
            return  false;
        }
        return true;
    }
}