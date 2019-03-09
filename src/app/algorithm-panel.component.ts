import { Component, Input } from '@angular/core';
import { PathFinder } from './library/pathfinders/pathfinder';
import { Astar } from './library/pathfinders/astar';
import { JPS } from './library/pathfinders/jps';
import { Wave } from './library/pathfinders/wave';
import { BFS } from './library/pathfinders/bfs';
import { Dijkstra } from './library/pathfinders/dijkstra';
import { CellType } from './library/helper';
import * as d3 from 'd3';
import { Player } from './library/player';

@Component({
    selector: 'alg',
    templateUrl: 'templates/algorithm-panel.component.html'
})

export class AlgorithmComponent {
    @Input() gridData: any;
    isUsingDiagonal: boolean = true;
    algorithm: PathFinder = null;
    algorithmId: string = "astar";
    algorithmList: [string, string][] = [["astar", "A*"],
    ["wave", "Wave"],
    ["bfs", "BFS"],
    ["jps", "JPS"],
    ["dk", "Dijkstra's"]];
    player: Player;

    ngOnInit(): void {
        this.disableJPS();
    }

    disableJPS(): any {
        let jps = d3.select("#jps");
        if (this.isUsingDiagonal) {
            jps.property("disabled", false);

        }
        else {
            jps.property("disabled", true);
            this.algorithmId = "astar"
        }
    }

    run() {
        if (this.algorithm != null) {
            this.algorithm.work()
                .then(path => { 
                    this.algorithm.reconstructPath(path) 
                });
            ;
        }
    }

    chooseAlgorithm() {
        this.player = new Player();

        switch (this.algorithmId) {
            case "astar":
                this.algorithm = new Astar(this.gridData, this.isUsingDiagonal, this.player)
                break;
            case "jps":
                this.algorithm = new JPS(this.gridData, this.isUsingDiagonal, this.player)
                break;
            case "wave":
                this.algorithm = new Wave(this.gridData, this.isUsingDiagonal, this.player)
                break;
            case "bfs":
                this.algorithm = new BFS(this.gridData, this.isUsingDiagonal, this.player)
                break;
            case "dk":
                this.algorithm = new Dijkstra(this.gridData, this.isUsingDiagonal, this.player)
                break;
            default:
                console.log("Some error")
                break;
        }
    }

    private clean() {
        d3.selectAll("circle").remove();
        d3.selectAll("text").remove();
        d3.selectAll("#neighbourCell").attr("id", "cell");
        for (var i = 0; i < this.gridData.dataMatrix.length; i++) {
            if (this.gridData.dataMatrix[i] == this.gridData.dataNeighbour)
                this.gridData.dataMatrix[i] = CellType.Empty;
        }
        d3.select("#stack .wraper")
        .selectAll("*")
        .remove();
    }

    play() {
        console.log(this.gridData.dataMatrix)

        this.clean();
        this.chooseAlgorithm();
        this.run()
        this.player.play();
    }

    forward() {
        this.player.forward();
    }

    backward() {
        this.player.backward();
    }

    stop(): void {
        this.player.stop();
    }
}