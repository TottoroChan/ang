import { IPathFinder } from "./Ipathfinder";
import { Vertex } from "../vertex";
import { PlayerService } from 'src/app/services/player.service';
import { GridService } from 'src/app/services/grid.service';
import { StackService } from 'src/app/services/stack.service';

export class Dijkstra extends IPathFinder {
    valid: boolean[];
    weight: number[];
    infinityValue: number;
    visited: any[];
    goal: boolean;
    path: any[];
    lenght: any[];

    constructor(isUsingDiagonal: boolean, playerService: PlayerService, 
        gridService: GridService, stackService: StackService ) {        
        super(isUsingDiagonal, playerService, gridService, stackService);

        this.valid = this.createArray(true);
        this.infinityValue = gridService.data.length * 2;
        this.weight = this.createArray(this.infinityValue);
        this.weight[gridService.toIndex(gridService.startPoint)] = 0;

        this.visited = []
        this.goal = true;
        this.path = new Array(gridService.data.length);
        this.lenght = new Array(gridService.data.length);
    }

    createArray(value: any): any[] {
        let result: number[] = [];

        for (let i = 0; i < this.gridService.data.length; i++) {
            result[i] = value;
        }

        return result;
    }

    async work(): Promise<Vertex> {

        this.dj();
        return null;

        // for (let i = 0; i < this.grid.data.length; i++) {

        //     await this.player.whait();
        //     this.step();      
        // }

        // console.log("result deekstr")
        // console.log(this.valid)
        // console.log(this.weight)
        // return null;
    }

    step(): any {
        let min = this.infinityValue + 1;
        let id_min = -1;

        for (let i = 0; i < this.weight.length; i++) {
            if (this.valid[i] && this.weight[i] < min) {
                min = this.weight[i];
                id_min = i;
            }
        }

        let neighbours = this.gridService.neighbourNodes(new Vertex(this.gridService.toPoint(id_min), null), this.isUsingDiagonal)
        this.fillNeighbour(neighbours.map(r => r.point));

        for (let i = 0; i < neighbours.length; i++) {
            let weight = this.weight[id_min] + 1;
            if (weight < this.weight[i]) {
                weight[this.gridService.toIndex(neighbours[i].point)] = weight
            }
        }

        this.valid[id_min] = false;
    }

    dj() {
        let start = this.gridService.toIndex(this.gridService.startPoint);
        this.lenght[start] = 0;
        this.path[start] = 0;
        for (let i = 0; i < this.lenght.length; i++) {
            if (i != start)
                this.lenght[i] = 1000 * this.lenght.length;
        }
        console.log("started: " + start + "=== w:" + this.lenght[start])

        while (this.visited.length < this.lenght.length) {
            let v = this.getMin();
            this.visited.push(v);

            var ve = new Vertex(this.gridService.toPoint(v), null);

            let neighbours = this.gridService.neighbourNodes(ve, this.isUsingDiagonal)

            neighbours.forEach(element => {
                let u = this.gridService.toIndex(element.point);
                if (this.check(u)) {
                    if (this.lenght[u] > (this.lenght[v] + element.weight)) {
                        this.lenght[u] = this.lenght[v] + element.weight;
                        this.path[u] = [this.path[v], u]
                    }
                }
            });
        }
        console.log("resuuuuuuult")
        console.log(this.lenght)
        console.log(this.path)
    }
    getMin(): any {
        let min = this.lenght[0];
        let id = 0;

        this.lenght.forEach((element, i) => {
            if (this.check(i)) {
                if (element < min) {
                    min = element;
                    id = i;
                }
            }
        });

        return id;
    }
    check(index: any): any {
        let notexist = true;
        this.visited.forEach(element => {
            if (element == index)
                notexist = false;
        })
        return notexist;
    }

    selectPath(start: Vertex): any {
        let neighbours = this.gridService.neighbourNodes(start, this.isUsingDiagonal)
        let min = this.getMinWeightN(neighbours);
        console.log("then: " + min.point[0] + "," + min.point[1] + "=== w:" + min.weight)
        this.visited.push(min);
        console.log(this.visited)
        this.selectPath(min);
    }


    getMinWeightN(neighbours: Vertex[]): any {
        let min = neighbours[0];

        neighbours.forEach(element => {
            if (element.weight < min.weight)
                min = element;
        });

        return min;
    }
}