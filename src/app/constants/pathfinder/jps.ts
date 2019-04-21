import * as d3 from "d3";
import { Vertex } from "../vertex";
import { IPathFinder } from "./Ipathfinder";
import { CellType } from "../../constants/index";
import { PlayerService } from 'src/app/services/player.service';
import { GridService } from 'src/app/services/grid.service';
import { StackService } from 'src/app/services/stack.service';

export class JPS extends IPathFinder {
    jumpedpoints: any[];
    bestPoint: Vertex;

    constructor(isUsingDiagonal: boolean, playerService: PlayerService, 
        gridService: GridService, stackService: StackService ) {        
        super(isUsingDiagonal, playerService, gridService, stackService);
        this.jumpedpoints = [];
        this.bestPoint = new Vertex(gridService.startPoint, null);
        this.bestPoint.setH(this.isUsingDiagonal, gridService.finishPoint);
    }

    save(): object {
        return {
            stack: Object.assign(new Array(), this.jumpedpoints), 
            best: this.bestPoint}
    }
    load(data) {
        this.jumpedpoints = data.stack;
        this.bestPoint = data.best;

        this.updateIvents();
    }

    async work(): Promise<Vertex> {
        this.jumpedpoints = [];
        do {
            await this.playerService.whait();
            this.bestPoint = this.step();
            this.setCurrentPoint(this.bestPoint.point);

            this.fillBestJumpPoint(this.bestPoint.point);

        } while (!this.gridService.checkGoal(this.bestPoint.point));

        return this.bestPoint;
    }

    step(): Vertex {
        this.jumpedpoints = this.jumpedpoints.filter(jp => jp.point != this.bestPoint.point);
        let neighbours = this.allNeighbourNodes();
        this.setStackData(this.jumpedpoints.map(x => x.point));
        neighbours.forEach(element => {
            element.setParent(this.bestPoint)
            let result = this.getJumpedPoints(element);

            if (result !== null) {
                this.jumpedpoints.push(result);
            }
        });
        
        this.fillJumpPoints(this.jumpedpoints.map(jp => jp.point));

        let bestPoint = this.jumpedpoints[0];
        this.jumpedpoints.forEach(element => {
            if (element.h < this.bestPoint.h)
                bestPoint = element;
        });

        return bestPoint;
    }

    diagonalN(){
        let neighbors = [];
        let x = this.bestPoint.point[0];
        let y = this.bestPoint.point[1];
        let dx = this.bestPoint.direction[0];
        let dy = this.bestPoint.direction[1];
                
        if (dx !== 0 && dy !== 0) {
            if (this.itIsMovmentPoint([x, y + dy])) {
                neighbors.push(new Vertex([x, y + dy], this.bestPoint));
            }
            if (this.itIsMovmentPoint([x + dx, y])) {
                neighbors.push(new Vertex([x + dx, y], this.bestPoint));
            }
            if (this.itIsMovmentPoint([x + dx, y + dy])) {
                neighbors.push(new Vertex([x + dx, y + dy], this.bestPoint));
            }
            if (!this.itIsMovmentPoint([x - dx, y])) {
                neighbors.push(new Vertex([x - dx, y + dy], this.bestPoint));
            }
            if (!this.itIsMovmentPoint([x, y - dy])) {
                neighbors.push(new Vertex([x + dx, y - dy], this.bestPoint));
            }
        }
        else {
            if(dx === 0) {
                if (this.itIsMovmentPoint([x, y + dy])) {
                    neighbors.push(new Vertex([x, y + dy], this.bestPoint));
                }
                if (!this.itIsMovmentPoint([x + 1, y])) {
                    neighbors.push(new Vertex([x + 1, y + dy], this.bestPoint));
                }
                if (!this.itIsMovmentPoint([x - 1, y])) {
                    neighbors.push(new Vertex([x - 1, y + dy], this.bestPoint));
                }
            }
            else {
                if (this.itIsMovmentPoint([x + dx, y])) {
                    neighbors.push(new Vertex([x + dx, y], this.bestPoint));
                }
                if (!this.itIsMovmentPoint([x, y + 1])) {
                    neighbors.push(new Vertex([x + dx, y + 1], this.bestPoint));
                }
                if (!this.itIsMovmentPoint([x, y - 1])) {
                    neighbors.push(new Vertex([x + dx, y - 1], this.bestPoint));
                }
            }
        }

        return neighbors;
    }

    notDiagonalN(){
        let neighbors = [];
        let x = this.bestPoint.point[0];
        let y = this.bestPoint.point[1];
        let dx = this.bestPoint.direction[0];
        let dy = this.bestPoint.direction[1];

        if (dx !== 0) {
            if (this.itIsMovmentPoint([x, y - 1])) {
                neighbors.push(new Vertex([x, y - 1], this.bestPoint));
            }
            if (this.itIsMovmentPoint([x, y + 1])) {
                neighbors.push(new Vertex([x, y + 1], this.bestPoint));
            }
            if (this.itIsMovmentPoint([x + dx, y])) {
                neighbors.push(new Vertex([x + dx, y], this.bestPoint));
            }
        }
        else if (dy !== 0) {
            if (this.itIsMovmentPoint([x - 1, y])) {
                neighbors.push(new Vertex([x - 1, y], this.bestPoint));
            }
            if (this.itIsMovmentPoint([x + 1, y])) {
                neighbors.push(new Vertex([x + 1, y], this.bestPoint));
            }
            if (this.itIsMovmentPoint([x, y + dy])) {
                neighbors.push(new Vertex([x, y + dy], this.bestPoint));
            }
        }

        return neighbors;
    }

    allNeighbourNodes(): Vertex[] {
        let neighbours: Vertex[] = [];

        if (this.bestPoint.parent == null) {
            neighbours = this.gridService.neighbourNodes(this.bestPoint, this.isUsingDiagonal);
        }

        else {
            neighbours = this.isUsingDiagonal ? this.diagonalN() : this.notDiagonalN();
        }

        neighbours.forEach(element => {
            element.setH(this.isUsingDiagonal, this.gridService.finishPoint);
        });

        return neighbours;
    }

    getJumpedPoints(point: Vertex): Vertex {
        this.fillResearchedPoint(point.point);

        if (!this.itIsMovmentPoint(point.point)) {
            return null;
        }

        if (this.gridService.checkGoal(point.point)) {
            return point;
        }

        if (this.isUsingDiagonal && point.parent != null && this.findForcedNeighbour(point).length) {
            return point;
        }

        let x = point.point[0];
        let y = point.point[1];
        let dx = point.direction[0];
        let dy = point.direction[1];

        if (this.isUsingDiagonal) {
            if (dx != 0 && dy != 0) {
                let neighbour1 = [x, y + dy];
                let neighbour2 = [x + dx, y];

                if (this.itIsMovmentPoint(neighbour1) && this.getJumpedPoints(new Vertex(neighbour1, point)) != null)
                    return point;

                if (this.itIsMovmentPoint(neighbour2) && this.getJumpedPoints(new Vertex(neighbour2, point)) != null)
                    return point;
            }
        }
        else {
            if (dx !== 0) {
                if ((this.itIsMovmentPoint([x, y - 1]) && !this.itIsMovmentPoint([x - dx, y - 1])) ||
                    (this.itIsMovmentPoint([x, y + 1]) && !this.itIsMovmentPoint([x - dx, y + 1]))) {
                    return point;
                }
            }
            else if (dy !== 0) {
                let neighbour1 = [x - 1, y];
                let neighbour2 = [x + 1, y];
                if ((this.itIsMovmentPoint(neighbour1) && !this.itIsMovmentPoint([x - 1, y - dy])) ||
                    (this.itIsMovmentPoint(neighbour2) && !this.itIsMovmentPoint([x + 1, y - dy]))) {
                    return point;
                }
                
                if (this.getJumpedPoints(new Vertex(neighbour1, point)) || this.getJumpedPoints(new Vertex(neighbour2, point))) {
                    return point;
                }
            }
            else {
                throw new Error("Only horizontal and vertical movements are allowed");
            }
        }

        let jump = new Vertex([x + dx, y + dy], point);
        jump.setH(this.isUsingDiagonal, this.gridService.finishPoint);

        return this.getJumpedPoints(jump);
    }

    findForcedNeighbour(point: Vertex) {
        let set = [];
        let x = point.point[0];
        let y = point.point[1];
        let px = point.parent.point[0];
        let py = point.parent.point[1];
        let dx = point.direction[0];
        let dy = point.direction[1];

        if (dx != 0 && dy != 0 && this.isUsingDiagonal) {
            if (!this.itIsMovmentPoint([px, py + dy]) && this.itIsMovmentPoint([x - dx, y + dy]))
                set.push([x - dx, y + dy]);
            if (!this.itIsMovmentPoint([px + dx, py]) && this.itIsMovmentPoint([x + dx, y - dy]))
                set.push([x + dx, y - dy]);
        }
        else {
            if (dx == 0) {
                if (!this.itIsMovmentPoint([px - 1, py + dy]) && this.itIsMovmentPoint([x - 1, y + dy]))
                    set.push([x - 1, y + dy]);

                if (!this.itIsMovmentPoint([px + 1, py + dy]) && this.itIsMovmentPoint([x + 1, y + dy]))
                    set.push([x + 1, y + dy]);
            }
            else {
                if (!this.itIsMovmentPoint([px + dx, py - 1]) && this.itIsMovmentPoint([x + dx, y - 1]))
                    set.push([x + dx, y - 1]);

                if (!this.itIsMovmentPoint([px + dx, py + 1]) && this.itIsMovmentPoint([x + dx, y + 1]))
                    set.push([x + dx, y + 1]);
            }
        }

        return set;
    }

    itIsMovmentPoint(point: number[]) {
        return this.itIsExistPoint(point) &&
            this.gridService.data[this.gridService.toIndex(point)] !== CellType.Wall;
    }

    itIsExistPoint(point: number[]) {
        return point[0] < this.gridService.fieldSize[0] 
            && point[1] < this.gridService.fieldSize[1] 
            && point[0] >= 0 && point[1] >= 0;
    }

    
    fillResearchedPoint(point: number[]) {
        d3.selectAll("#cell")
            .each(function () {
                let item = d3.select(this);
                if (+item.attr("cX") == point[0] && + item.attr("cY") == point[1]) {
                    item.attr("class", "researchedPoint");
                }
            });
        d3.selectAll("#neighbourCell")
            .each(function () {
                let item = d3.select(this);
                if (+item.attr("cX") == point[0] && + item.attr("cY") == point[1]) {
                    item.attr("class", "researchedPoint");
                }
            });
    }
    fillJumpPoints(map: number[][]) {
        d3.selectAll("#cell")
            .each(function () {
                let item = d3.select(this);
                for (let i = map.length - 1; i >= 0; i--)
                    if (+item.attr("cX") == map[i][0] && +item.attr("cY") == map[i][1]) {
                        item.attr("id", "jumpPoint");
                    }
            });
        d3.selectAll("#neighbourCell")
            .each(function () {
                let item = d3.select(this);
                for (let i = map.length - 1; i >= 0; i--)
                    if (+item.attr("cX") == map[i][0] && +item.attr("cY") == map[i][1]) {
                        item.attr("id", "jumpPoint");
                    }
            });
    }
    fillBestJumpPoint(point: number[]) {
        d3.selectAll("#jumpPoint")
            .each(function () {
                let item = d3.select(this);
                if (+item.attr("cX") == point[0] && + item.attr("cY") == point[1]) {
                    item.attr("class", "bestJumpPoint");
                } else {
                    item.attr("class", "");
                }
            });
    }
}
