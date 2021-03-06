import * as d3 from 'd3';
import { Component } from '@angular/core';
import { _algorithmList, _heuristicList } from 'src/app/constants';
import { PlayerService } from 'src/app/services/player.service';
import { GridService } from 'src/app/services/grid.service';
import { IPathFinder } from 'src/app/constants/pathfinder/Ipathfinder';
import { Astar } from 'src/app/constants/pathfinder/astar';
import { JPS } from 'src/app/constants/pathfinder/jps';
import { Wave } from 'src/app/constants/pathfinder/wave';
import { BFS } from 'src/app/constants/pathfinder/bfs';
import { Dijkstra } from 'src/app/constants/pathfinder/dijkstra';
import { StackService } from 'src/app/services/stack.service';
import { Greedy } from 'src/app/constants/pathfinder/greedy';

@Component({
    selector: 'algorithms',
    templateUrl: 'algorithms.component.html',
})

export class AlgorithmsComponent {
    isUsingDiagonal: boolean = true;
    algorithm: IPathFinder = null;
    algorithmList: [string, string][] = _algorithmList;
    heuristicList: [string, string][] = _heuristicList;
    algorithmType: string = _algorithmList[0][0];
    heuristicType: string = _heuristicList[0][0];
    state: { grid: string, stack: string, alg: object }[] = [];
    stepCounter: number = null;
    disableSelect: boolean = true;

    constructor(private playerService: PlayerService, private gridService: GridService, private stackService: StackService) { }

    algorithmChanged(){
        if (this.algorithmType == "astar" || this.algorithmType == "jps" || this.algorithmType == "greedy"){
           this.disableSelect = false;
        }
        else{
            this.disableSelect = true;
        }
    }

    run() {
        if (this.algorithm != null) {
            this.algorithm.work()
                .then(result => {
                    if (result == null){
                        d3.select("#errorMessage").style("display", "block")
                    }
                    else{
                        this.algorithm.reconstructPath(result)
                    }
                    this.algorithm = null;
                });
            ;
        }
    }

    chooseAlgorithm() {
        this.playerService = new PlayerService();

        switch (this.algorithmType) {
            case "bfs":
                this.algorithm = new BFS(this.isUsingDiagonal, this.playerService, this.gridService, this.stackService)
                break;
            case "wave":
                this.algorithm = new Wave(this.isUsingDiagonal, this.playerService, this.gridService, this.stackService)
                break;
            case "greedy":
                this.algorithm = new Greedy(this.isUsingDiagonal, this.playerService, this.gridService, this.stackService, this.heuristicType)
                break;
            case "dk":
                this.algorithm = new Dijkstra(this.isUsingDiagonal, this.playerService, this.gridService, this.stackService)
                break;
            case "astar":
                this.algorithm = new Astar(this.isUsingDiagonal, this.playerService, this.gridService, this.stackService, this.heuristicType)
                break;
            case "jps":
                this.algorithm = new JPS(this.isUsingDiagonal, this.playerService, this.gridService, this.stackService, this.heuristicType)
                break;
            default:
                console.log("Ошибка: Выбран несуществующий алгоритм.")
                break;
        }
    }

    private clean() {
        d3.selectAll("circle").remove();
        d3.selectAll("text").remove();
        d3.selectAll("#mainNeighbourCell").attr("id", "cell");
        d3.selectAll("#neighbourCell").attr("id", "cell");
        d3.selectAll("#jumpPoint").attr("id", "cell");
        d3.selectAll(".researchedPoint").attr("class", "");

        d3.select("#stack .wrapper")
            .selectAll("*")
            .remove();

        this.state = [];
        this.stepCounter = null;
    }

    initAlgorithm(): any {
        this.clean();
        this.chooseAlgorithm();
        this.run()
    }

    play() {
        if (this.algorithm == null)
            this.initAlgorithm();
        this.playerService.play();
    }

    forward() {
        if (this.algorithm == null) {
            this.initAlgorithm();
        }
        this.save();
        this.playerService.forward();
    }

    save() {
        this.state.push({
            grid: d3.select("svg").html(),
            stack: d3.select("#stack").html(),
            alg: this.algorithm.save()
        })
        if (this.stepCounter == null) {
            this.stepCounter = 0
        }
        else this.stepCounter++;
    }

    backward() {
        if (this.stepCounter > 0) {
            let state = this.state[this.stepCounter];
            d3.select("svg").html(state.grid),
                d3.select("#stack").html(state.stack),
                this.algorithm.load(state.alg);

            this.state.splice(this.stepCounter, 1)
            this.stepCounter--;
        }
    }

    stop(): void {
        this.playerService.stop();
    }
}