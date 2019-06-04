import * as d3 from "d3";
import { Vertex } from "../vertex";
import { PlayerService } from 'src/app/services/player.service';
import { GridService } from 'src/app/services/grid.service';
import { StackService } from 'src/app/services/stack.service';

export abstract class IPathFinder {
    isUsingDiagonal: boolean;

    constructor(isUsingDiagonal: boolean, protected playerService: PlayerService,
        protected gridService: GridService, protected stackService: StackService) {
        this.isUsingDiagonal = isUsingDiagonal;
    }

    save(): object {
        throw new Error("Not implemented");
    }
    load(data) {
        throw new Error("Not implemented");
    }
    updateEvents(){
        this.stackService.backwardStep();
        this.gridService.backwardStep();
    }

    async work(): Promise<Vertex> {
        throw new Error("Not implemented");
    }

    reconstructPath(node: Vertex) {
        let path = [];
        while (node != null) {
            path.push(node.point)
            node = node.parent;
        }
        this.gridService.finish(path);
    }

    vertexisExist(set: Vertex[], vertex: Vertex): boolean {
        for (let i = 0; i < set.length; i++) {
            if (set[i].point[0] == vertex.point[0] && set[i].point[1] == vertex.point[1])
                return true;
        }
        return false;
    }

    getVertex(set: Vertex[], vertex: Vertex): Vertex {
        if (set == null)
            return null;
        for (let i = 0; i < set.length; i++) {
            if (set[i] != null && set[i].point[0] == vertex.point[0] && set[i].point[1] == vertex.point[1])
                return set[i];
        }
        return null;
    }

    setStackData(array: number[][]) {
        d3.select("#stack .wrapper")
            .selectAll("*")
            .remove();

        this.stackService.updateStack(array);
    }

    setCurrentPoint(point: number[]) {
        d3.select("#stack .current")
            .selectAll("*")
            .remove();

        this.stackService.updateCurrent(point);
    }


    fillNeighbours(map: number[][]) {
        d3.selectAll("#currentpoint").each(function () {
            let item = d3.select(this);
            item.attr("id", "neighbourCell");
        });

        let cells = d3.selectAll("#cell");
        cells.each(function () {
            let item = d3.select(this);
            for (let i = map.length - 1; i >= 0; i--)
                if (+item.attr("cx") == map[i][0] && +item.attr("cy") == map[i][1]) {
                    item.attr("id", "neighbourCell");
                }
        });
    }
};