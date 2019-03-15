import { Vertex } from "../vertex";
import { PathFinder } from "./pathfinder";
import { CellType } from "../helper";
import { Grid } from "../grid";
import { Player } from "../player";

export class JPS extends PathFinder {
    jumpedpoints: any[];
    bestPoint: Vertex;
    constructor(grid: Grid, isUsingDiagonal: boolean, player: Player) {
        super(grid, isUsingDiagonal, player);
        this.jumpedpoints = [];
        this.bestPoint = new Vertex(this.grid.startPoint, null);
        this.bestPoint.setH(this.isUsingDiagonal, this.grid.finishPoint);
    }

    async work(): Promise<Vertex> {
        this.jumpedpoints = [];
        do {
            await this.player.whait();
            this.bestPoint = this.step();
            this.grid.savePoint(this.bestPoint);

            this.grid.fillBestJumpPoint(this.bestPoint.point);
            //this.grid.fillNeighbour([this.bestPoint.point]);
        } while (!this.grid.checkGoal(this.bestPoint.point));

        return this.bestPoint;
    }

    step(): Vertex {
        this.jumpedpoints = this.jumpedpoints.filter(jp => jp.point != this.bestPoint.point);
        var neighbours = this.allNeighbourNodes();
        neighbours.forEach(element => {
            element.setParent(this.bestPoint)
            var result = this.getJumpedPoints(element);

            if (result !== null) {
                this.jumpedpoints.push(result);
            }
        });
        //this.grid.fillNeighbour(this.jumpedpoints.map(jp => jp.point));
        this.grid.fillJumpPoints(this.jumpedpoints.map(jp => jp.point));

        if (this.jumpedpoints.length) {
            return this.jumpedpoints[0];
        }

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
            neighbours = this.grid.neighbourNodes(this.bestPoint, this.isUsingDiagonal);
        }

        else {
            neighbours = this.isUsingDiagonal ? this.diagonalN() : this.notDiagonalN();
        }

        neighbours.forEach(element => {
            element.setH(this.isUsingDiagonal, this.grid.finishPoint);
        });

        return neighbours;
    }

    getJumpedPoints(point: Vertex): Vertex {
        this.grid.fillResearchedPoint(point.point);
        //this.grid.fillNeighbour([point.point]);

        if (!this.itIsMovmentPoint(point.point)) {
            return null;
        }

        if (this.grid.checkGoal(point.point)) {
            return point;
        }

        if (point.parent != null && this.findForcedNeighbour(point).length) {
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
                //When moving vertically, must check for horizontal jump points
                if (this.getJumpedPoints(new Vertex(neighbour1, point)) || this.getJumpedPoints(new Vertex(neighbour2, point))) {
                    return point;
                }
            }
            else {
                throw new Error("Only horizontal and vertical movements are allowed");
            }
        }

        let jump = new Vertex([x + dx, y + dy], point);
        jump.setH(this.isUsingDiagonal, this.grid.finishPoint);

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
            this.grid.dataMatrix[this.grid.decryptValue(point)] !== CellType.Wall;
    }

    itIsExistPoint(point: number[]) {
        return point[0] < this.grid.workField[1] && point[1] < this.grid.workField[0] &&
            point[0] >= 0 && point[1] >= 0;
    }
}
