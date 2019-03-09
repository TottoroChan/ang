import { Vertex } from "../vertex";
import { PathFinder } from "./pathfinder";
import { Grid } from "../grid";
import { Player } from "../player";
import * as d3 from "d3";

export class Wave extends PathFinder {
    d: number;
    wave: Vertex[];
    visited: number[];

    constructor(grid: Grid, isUsingDiagonal: boolean, player: Player) {
        super(grid, isUsingDiagonal, player);
        this.d = 0;

        let start = new Vertex(this.grid.startPoint, null);
        start.setD(this.d);
        this.wave = [start];
        this.visited = [];
        for (let i = 0; i < this.grid.dataMatrix.length; i++) {
            this.visited[i] = null;            
        }
        this.visited[this.grid.decryptValue(start.point)] = 0;
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
                    console.log("visited");
                    console.log(this.visited);
                    this.rebuldPath(result);
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
            let node = neighbours[i];

            if (!this.vertexisExist(this.wave, node) && this.visited[this.grid.decryptValue(node.point)] == null) {
                node.parent = vertex;

                if (this.grid.checkGoal(node.point)) {
                    this.visited[this.grid.decryptValue(node.point)] = node.parent.d + 1 + node.weight;
                    return node;
                }

                if (!node.d && node.parent != null) {
                    node.setD(node.parent.d + 1 + node.weight);
                    this.wave.push(node);
                    this.visited[this.grid.decryptValue(node.point)] = node.d;

                    this.drawWeight(node);
                }
            }
        }

        return null;
    }

    drawWeight(vertex: Vertex) {
        d3.select("svg").append("text")
            .attr("x", vertex.point[0] * this.grid.heightOfCell + this.grid.heightOfCell / 3)
            .attr("y", vertex.point[1] * this.grid.heightOfCell + this.grid.heightOfCell / 2)
            .attr("dy", ".25em")
            .style("font-size", "15px")
            .text(vertex.d);
    }

    rebuldPath(goal: Vertex) {
        if (this.visited[this.grid.decryptValue(goal.point)] != 0) {
            let neighbours = this.grid.neighbourNodes(goal, this.isUsingDiagonal);
            let minD = this.visited[this.grid.decryptValue(neighbours[0].point)];
            let parent = neighbours[0];

            neighbours.forEach(node => {
                if (this.visited[this.grid.decryptValue(node.point)] < minD){
                    minD = this.visited[this.grid.decryptValue(node.point)];
                    parent = node;                    
                }
            })
            goal.parent = parent;
            this.rebuldPath(goal.parent);
        }
        return;
    }
}
