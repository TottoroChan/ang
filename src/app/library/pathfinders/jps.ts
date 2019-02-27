import { Vertex } from "../vertex";
import { PathFinder } from "./pathfinder";
import { CellType } from "../helper";
import { Grid } from "../grid";
import { Observable, of } from "rxjs";

export class JPS extends PathFinder {
    jumpedpoints: any[];
    bestPoint: Vertex;
    constructor(grid: Grid, isUsingDiagonal: boolean) {
        super(grid, isUsingDiagonal);
        this.jumpedpoints = [];
        this.bestPoint = new Vertex(this.grid.startPoint, null);
        this.bestPoint.setH(this.isUsingDiagonal, this.grid.finishPoint);
    }

    work(): Vertex {
        return null;
        /*this.jumpedpoints = [];
        do {
            this.jumpedpoints = this.jumpedpoints.filter(jp => jp.point != this.bestPoint.point);
            var neighbours = this.allNeighbourNodes();
            neighbours.forEach(element => {
                var result = this.getJumpedPoints(element);
                
                if (result !== null) {
                    this.jumpedpoints.push(result);
                }
            });
            this.grid.fillNeighbour(this.jumpedpoints.map(jp => jp.point));
            
            if (this.jumpedpoints.length) {
                this.bestPoint = this.jumpedpoints[0];
            }
            else {
                break;
            }

            this.jumpedpoints.forEach(element => {
                if (element.h < this.bestPoint.h)
                    this.bestPoint = element;
            });

        } while (!this.grid.checkGoal(this.bestPoint.point));
       
        return this.bestPoint;*/
    }

    allNeighbourNodes(): Vertex[] {
        let neighbours: Vertex[] = [];
        
        if (this.bestPoint.parent == null) {
           // neighbours = this.grid.neighbourNodes(this.bestPoint, this.isUsingDiagonal);
        }
        else {
            if (this.itIsMovmentPoint([this.bestPoint.point[0] + this.bestPoint.direction[0], this.bestPoint.point[1] + this.bestPoint.direction[1]])
                && this.isUsingDiagonal) {
                neighbours.push(new Vertex([this.bestPoint.point[0] + this.bestPoint.direction[0], this.bestPoint.point[1] + this.bestPoint.direction[1]], this.bestPoint));
            }
            
            if (this.bestPoint.direction[0] != 0 && this.bestPoint.direction[1] != 0 && this.isUsingDiagonal) {
                if (this.itIsMovmentPoint([this.bestPoint.point[0], this.bestPoint.point[1] + this.bestPoint.direction[1]])) {
                    neighbours.push(new Vertex([this.bestPoint.point[0], this.bestPoint.point[1] + this.bestPoint.direction[1]], this.bestPoint));
                }
                
                if (this.itIsMovmentPoint([this.bestPoint.point[0] + this.bestPoint.direction[0], this.bestPoint.point[1]])) {
                    neighbours.push(new Vertex([this.bestPoint.point[0] + this.bestPoint.direction[0], this.bestPoint.point[1]], this.bestPoint));
                }
            }
            
            let forcedNeighbours = this.findForcedNeighbour(this.bestPoint);
            forcedNeighbours.forEach(element => {
                neighbours.push(new Vertex(element, this.bestPoint));
            });
        }
        neighbours.forEach(element => {
            element.setH(this.isUsingDiagonal, this.grid.finishPoint);
        });

        return neighbours;
    }

    getJumpedPoints(point: Vertex): Vertex {
        this.grid.fillNeighbour([point.point]);

        if (!this.itIsMovmentPoint(point.point)) {
            return null;
        }
        
        if (this.grid.checkGoal(point.point)) {
            return point;
        }
        
        if (this.findForcedNeighbour(point).length) {
            return point;
        }
        
        if (point.direction[0] != 0 && point.direction[1] != 0 && this.isUsingDiagonal) {
            var n1 = [point.point[0], point.point[1] + point.direction[1]];
            var n2 = [point.point[0] + point.direction[0], point.point[1]];
            if (this.itIsMovmentPoint(n1) && this.getJumpedPoints(new Vertex(n1, point)) != null)
                return point;
            
            if (this.itIsMovmentPoint(n2) && this.getJumpedPoints(new Vertex(n2, point)) != null)
                return point;
        }

        var jump = new Vertex([point.point[0] + point.direction[0], point.point[1] + point.direction[1]], point);
        jump.setH(this.isUsingDiagonal, this.grid.finishPoint);
        
        return this.getJumpedPoints(jump);
    }

    findForcedNeighbour(point: Vertex) {
        let set = [];
        if (point.direction[0] != 0 && point.direction[1] != 0 && this.isUsingDiagonal) {
            if (!this.itIsMovmentPoint([point.parent.point[0], point.parent.point[1] + point.direction[1]])
                && this.itIsMovmentPoint([point.point[0] - point.direction[0], point.point[1] + point.direction[1]]))
                set.push([point.point[0] - point.direction[0], point.point[1] + point.direction[1]]);
            if (!this.itIsMovmentPoint([point.parent.point[0] + point.direction[0], point.parent.point[1]])
                && this.itIsMovmentPoint([point.point[0] + point.direction[0], point.point[1] - point.direction[1]]))
                set.push([point.point[0] + point.direction[0], point.point[1] - point.direction[1]]);
        }
        else {
            if (point.direction[0] == 0) {
                if (!this.itIsMovmentPoint([point.parent.point[0] - 1, point.parent.point[1] + point.direction[1]])
                    && this.itIsMovmentPoint([point.point[0] - 1, point.point[1] + point.direction[1]]))
                    set.push([point.point[0] - 1, point.point[1] + point.direction[1]]);
               
                if (!this.itIsMovmentPoint([point.parent.point[0] + 1, point.parent.point[1] + point.direction[1]])
                    && this.itIsMovmentPoint([point.point[0] + 1, point.point[1] + point.direction[1]]))
                    set.push([point.point[0] + 1, point.point[1] + point.direction[1]]);
            }
            else {
                if (!this.itIsMovmentPoint([point.parent.point[0] + point.direction[0], point.parent.point[1] - 1])
                    && this.itIsMovmentPoint([point.point[0] + point.direction[0], point.point[1] - 1]))
                    set.push([point.point[0] + point.direction[0], point.point[1] - 1]);
                
                if (!this.itIsMovmentPoint([point.parent.point[0] + point.direction[0], point.parent.point[1] + 1])
                    && this.itIsMovmentPoint([point.point[0] + point.direction[0], point.point[1] + 1]))
                    set.push([point.point[0] + point.direction[0], point.point[1] + 1]);
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
