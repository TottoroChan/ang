import * as d3 from 'd3';
import { Component } from '@angular/core';
import { _algorithmList} from 'src/app/constants';
import { PlayerService } from 'src/app/services/player.service';
import { GridService } from 'src/app/services/grid.service';
import { IPathFinder } from 'src/app/constants/pathfinder/Ipathfinder';
import { Astar } from 'src/app/constants/pathfinder/astar';
import { JPS } from 'src/app/constants/pathfinder/jps';
import { Wave } from 'src/app/constants/pathfinder/wave';
import { BFS } from 'src/app/constants/pathfinder/bfs';
import { Dijkstra } from 'src/app/constants/pathfinder/dijkstra';
import { StackService } from 'src/app/services/stack.service';

@Component({
    selector: 'algorithms',
    templateUrl: 'algorithms.component.html',
})

export class AlgorithmsComponent {
    isUsingDiagonal: boolean = true;
    algorithm: IPathFinder = null;
    algorithmList: [string, string][] = _algorithmList;
    algorithmId: string = _algorithmList[0][0];
    
    constructor(private playerService: PlayerService, private gridService: GridService, private stackService: StackService){}

    run() {
        if (this.algorithm != null) {
            this.algorithm.work()
                .then(result => { 
                    return this.algorithm.reconstructPath(result) 
                })
                .then(path => {
                    this.algorithm = null;
                    this.playerService.finish(path);
                });
            ;
        }
    }

    chooseAlgorithm() {
        this.playerService = new PlayerService();

        switch (this.algorithmId) {
            case "astar":
                this.algorithm = new Astar(this.isUsingDiagonal, this.playerService, this.gridService, this.stackService)
                break;
            case "jps":
                this.algorithm = new JPS(this.isUsingDiagonal, this.playerService, this.gridService, this.stackService)
                break;
            case "wave":
                this.algorithm = new Wave(this.isUsingDiagonal, this.playerService, this.gridService, this.stackService)
                break;
            case "bfs":
                this.algorithm = new BFS(this.isUsingDiagonal, this.playerService, this.gridService, this.stackService)
                break;
            case "dk":
                this.algorithm = new Dijkstra(this.isUsingDiagonal, this.playerService, this.gridService, this.stackService)
                break;
            default:
                console.log("Some error")
                break;
        }
    }

    private clean() {
        d3.selectAll("circle").remove();
        d3.selectAll("text").remove();
        d3.selectAll("#mainNeighbourCell").attr("id", "cell");
        d3.selectAll("#neighbourCell").attr("id", "cell");
        d3.selectAll("#jumpPoint").attr("id", "cell");

        d3.select("#stack .wraper")
        .selectAll("*")
        .remove();
    }

    initAlgorithm(): any {
        this.clean();
        this.chooseAlgorithm();
        this.run()
    }

    play() {
        if (this.algorithm == null){
            this.initAlgorithm();
            this.playerService.play();
        }
    }

    forward() {
        if (this.algorithm == null)
            this.initAlgorithm();
        this.playerService.forward();
    }

    backward() {
        this.playerService.backward();
    }

    stop(): void {
        this.playerService.stop();
        this.algorithm = null;
        this.clean();
    }
}