import * as d3 from "d3";
import { Vertex } from "../vertex";
import { IPathFinder } from "./Ipathfinder";
import { PlayerService } from 'src/app/services/player.service';
import { GridService } from 'src/app/services/grid.service';
import { StackService } from 'src/app/services/stack.service';

export class Wave extends IPathFinder {
    waveNumber: number;
    wave: Vertex[];
    visited: number[];

    constructor(isUsingDiagonal: boolean, playerService: PlayerService, 
        gridService: GridService, stackService: StackService ) {        
        super(isUsingDiagonal, playerService, gridService, stackService);
        this.waveNumber = 0;
        let start = new Vertex(gridService.startPoint, null);
        start.setWaveNumber(this.waveNumber);
        this.wave = [start];
        this.visited = [];
        for (let i = 0; i < gridService.data.length; i++) {
            this.visited[i] = null;            
        }
        this.visited[gridService.toIndex(start.point)] = this.waveNumber;
    }  
    
    save(): object {
        return {
            visited: Object.assign(new Array(), this.visited), 
            wave: Object.assign(new Array(), this.wave), 
            waveNumber: this.waveNumber}
    }
    load(data) {
        this.visited = data.visited;
        this.wave = data.wave;
        this.waveNumber = data.waveNumber;

        this.updateEvents();
    }

    async work(): Promise<Vertex> {
        let result = null;
        while (this.wave.length > 0) {
            this.waveNumber++;
            let set = this.wave;
            this.wave = [];
            for (let i = 0; i < set.length; i++) {
                await this.playerService.wait();
                result = this.step(set[i]);
                if (result) {
                    console.log("visited");
                    console.log(this.visited);
                    this.rebuildPath(result);
                    return result;
                }
            }
        }
    }

    step(vertex: Vertex): Vertex {
        this.setCurrentPoint(vertex.point);
        let neighbours = this.gridService.neighbourNodes(vertex, this.isUsingDiagonal);
        this.fillNeighbours(neighbours.map(r => r.point));

        for (let i = 0; i < neighbours.length; i++) {
            let node = neighbours[i];

            if (!this.vertexisExist(this.wave, node) && this.visited[this.gridService.toIndex(node.point)] == null) {
                node.parent = vertex;

                if (this.gridService.checkGoal(node.point)) {
                    this.visited[this.gridService.toIndex(node.point)] = node.parent.waveNumber + 1 + node.weight;
                    return node;
                }

                if (!node.waveNumber) {
                    node.setWaveNumber(node.parent.waveNumber + node.weight);
                    this.wave.push(node);
                    this.visited[this.gridService.toIndex(node.point)] = node.waveNumber;

                    this.drawWave(node);
                }
            }
        }
        this.setStackData(this.wave.map(x => x.point));

        return null;
    }

    drawWave(vertex: Vertex) {
        d3.select("svg").append("text")
            .attr("x", vertex.point[0] * this.gridService.height + this.gridService.height/4)
            .attr("y", vertex.point[1] * this.gridService.height + this.gridService.height/3)
            .attr("dy", ".25em")
            .text(vertex.waveNumber.toFixed(1));
    }

    rebuildPath(goal: Vertex) {
        if (this.visited[this.gridService.toIndex(goal.point)] != 0) {
            let neighbours = this.gridService.neighbourNodes(goal, this.isUsingDiagonal);
            let minWaveNumber = this.visited[this.gridService.toIndex(goal.point)];
            let parent = neighbours[0];

            for (let i = 0; i < neighbours.length; i++) {
                let node = neighbours[i];

                let waveNumber = this.visited[this.gridService.toIndex(node.point)]
                if (waveNumber!=null && waveNumber < minWaveNumber){
                    minWaveNumber = this.visited[this.gridService.toIndex(node.point)];
                    parent = node;                    
                }
            }
            
            goal.parent = parent;
            this.rebuildPath(goal.parent);
        }
        return;
    }
}


