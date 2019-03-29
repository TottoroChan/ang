import * as d3 from "d3";
import { Vertex } from "../vertex";
import { IPathFinder } from "./Ipathfinder";
import { PlayerService } from 'src/app/services/player.service';
import { GridService } from 'src/app/services/grid.service';
import { StackService } from 'src/app/services/stack.service';

export class Wave extends IPathFinder {
    d: number;
    wave: Vertex[];
    visited: number[];

    constructor(isUsingDiagonal: boolean, playerService: PlayerService, 
        gridService: GridService, stackService: StackService ) {        
        super(isUsingDiagonal, playerService, gridService, stackService);
        this.d = 0;

        let start = new Vertex(gridService.startPoint, null);
        start.setD(this.d);
        this.wave = [start];
        this.visited = [];
        for (let i = 0; i < gridService.data.length; i++) {
            this.visited[i] = null;            
        }
        this.visited[gridService.toIndex(start.point)] = 0;
    }

    async work(): Promise<Vertex> {
        let result = null;
        do {
            this.d++;
            let set = this.wave;
            this.wave = [];
            for (let i = 0; i < set.length; i++) {
                await this.playerService.whait();
                result = this.step(set[i]);
                if (result) {
                    console.log("visited");
                    console.log(this.visited);
                    this.rebuldPath(result);
                    return result;
                }
            }

        } while (this.wave.length > 0);
    }

    step(vertex: Vertex): Vertex {
        this.setStackData(this.wave.map(x => x.point));
        let neighbours = this.gridService.neighbourNodes(vertex, this.isUsingDiagonal);
        this.fillNeighbour(neighbours.map(r => r.point));

        for (let i = 0; i < neighbours.length; i++) {
            let node = neighbours[i];

            if (!this.vertexisExist(this.wave, node) && this.visited[this.gridService.toIndex(node.point)] == null) {
                node.parent = vertex;

                if (this.gridService.checkGoal(node.point)) {
                    this.visited[this.gridService.toIndex(node.point)] = node.parent.d + 1 + node.weight;
                    return node;
                }

                if (!node.d && node.parent != null) {
                    node.setD(node.parent.d + node.weight);
                    this.wave.push(node);
                    this.visited[this.gridService.toIndex(node.point)] = node.d;

                    this.drawWeight(node);
                }
            }
        }

        return null;
    }

    drawWeight(vertex: Vertex) {
        d3.select("svg").append("text")
            .attr("x", vertex.point[0] * this.gridService.height + this.gridService.height/4)
            .attr("y", vertex.point[1] * this.gridService.height + this.gridService.height/3)
            .attr("dy", ".25em")
            .text(vertex.d.toFixed(1));
    }

    rebuldPath(goal: Vertex) {
        if (this.visited[this.gridService.toIndex(goal.point)] != 0) {
            let neighbours = this.gridService.neighbourNodes(goal, this.isUsingDiagonal);
            let minD = this.visited[this.gridService.toIndex(goal.point)];
            let parent = neighbours[0];

            neighbours.forEach(node => {
                let d = this.visited[this.gridService.toIndex(node.point)]
                if (d!=null && d < minD){
                    minD = this.visited[this.gridService.toIndex(node.point)];
                    parent = node;                    
                }
            })
            goal.parent = parent;
            this.rebuldPath(goal.parent);
        }
        return;
    }
}
