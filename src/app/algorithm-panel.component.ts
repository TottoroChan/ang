import { Component, Input } from '@angular/core';
import { PathFinder } from './library/pathfinders/pathfinder';
import { Astar } from './library/pathfinders/astar';
import { JPS } from './library/pathfinders/jps';
import { Wave } from './library/pathfinders/wave';
import { BFS } from './library/pathfinders/bfs';
import { CellType } from './library/helper';
import * as d3 from 'd3';

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
    ["jps", "JPS"]];

    ngOnInit(): void {
        this.disableJPS();
        console.log(this)
    }

    runAlgorithm() {
        this.clean();
        setTimeout(() => {
            this.chooseAlgorithm();
            this.run();
        }, 1000);
    }

    run() {
        console.log(this.gridData)
        if (this.algorithm != null) {
            let result = this.algorithm.work();
            console.log(result)
            this.algorithm.reconstructPath(result);
        }
    }

    chooseAlgorithm() {
        switch (this.algorithmId) {
            case "astar":
                this.algorithm = new Astar(this.gridData, this.isUsingDiagonal)
                break;
            case "jps":
                this.algorithm = new JPS(this.gridData, this.isUsingDiagonal)
                break;
            case "wave":
                this.algorithm = new Wave(this.gridData, this.isUsingDiagonal)
                break;
            case "bfs":
                this.algorithm = new BFS(this.gridData, this.isUsingDiagonal)
                break;
            default:
                console.log("Some error")
                break;
        }
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

    private clean() {
        d3.selectAll("#pathCell").attr("id", "cell");
        d3.selectAll("#neighbourCell").attr("id", "cell");
        for (var i = 0; i < this.gridData.dataMatrix.length; i++) {
            if (this.gridData.dataMatrix[i] == this.gridData.dataNeighbour)
                this.gridData.dataMatrix[i] = CellType.Empty;
        }
    }
}