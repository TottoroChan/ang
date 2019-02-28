import * as d3 from "d3";
import { Vertex } from "./vertex";
import { CellColor, CellType } from "./helper";
import { Player } from "./player";

export class Grid {
    isPenDown: boolean;
    heightOfCell: number;
    workField: number[];
    startPoint: number[];
    finishPoint: number[];
    dataMatrix: Uint8Array;
    currentColor: CellColor;
    shiftMatrix: number[][];

    constructor(heightOfCell: number, workField: number[], startPoint: number[], finishPoint: number[]) {
        this.isPenDown = false;
        this.heightOfCell = heightOfCell;
        this.workField = workField;
        this.startPoint = startPoint;
        this.finishPoint = finishPoint;
        this.dataMatrix = new Uint8Array(this.workField[0] * this.workField[1]);
        this.currentColor = CellColor.Empty;
        this.shiftMatrix = [[-1, 0], [0, -1], [0, 1], [1, 0], [-1, -1], [-1, 1], [1, -1], [1, 1]];
    }

    createGrid() {
        let svg = d3.select("#canvas")
            .append("svg")
            .attr("width", this.heightOfCell * this.workField[0])
            .attr("height", this.heightOfCell * this.workField[1]);

        for (let i = 0; i < this.workField[1]; i++) {
            let rows = svg.append("g");

            for (let j = 0; j < this.workField[0]; j++) {
                rows.append("rect")
                    .attr("x", j * this.heightOfCell)
                    .attr("y", i * this.heightOfCell)
                    .attr("cX", j)
                    .attr("cY", i)
                    .attr("width", this.heightOfCell)
                    .attr("height", this.heightOfCell)
                    .attr("id", "cell");
            }
        }

        this.drawPoint(this.startPoint, "start");
        this.drawPoint(this.finishPoint, "finish");
        this.addIvents();
    }

    private drawPoint(point: number[], id: string) {
        d3.select("svg")
            .append("rect")
            .attr("id", id)
            .attr("x", point[0] * this.heightOfCell)
            .attr("y", point[1] * this.heightOfCell)
            .attr("width", this.heightOfCell)
            .attr("height", this.heightOfCell);
    }

    //создание событий
    private addIvents() {
        console.log("add events")
        d3.selectAll("#cell")
            .on("mousedown", this.fill.bind(this))
            .on("mousemove", this.mousemove.bind(this))
            .on("mouseup", this.mouseup.bind(this));

        d3.select("#start")
            .call(d3.drag()
                .on("start", this.dragstarted)
                .on("drag", this.dragged)
                .on("end", this.dragended.bind(this))
            );
        d3.select("#finish")
            .call(d3.drag()
                .on("start", this.dragstarted)
                .on("drag", this.dragged)
                .on("end", this.dragended.bind(this))
            );
    }

    fillPath(path: number[][]) {
        d3.selectAll("#neighbourCell")
            .each(async function () {
                var item = d3.select(this);
                for (var i = path.length - 1; i >= 0; i--)
                    if (+item.attr("cX") == path[i][0] && +item.attr("cY") == path[i][1]){
                        item.attr("id", "pathCell");
                    }
            });
    }    

    fillNeighbour(map: number[][]) {
        var grid = this;

        d3.selectAll("#mainNeighbourCell").each(function() {
            var item = d3.select(this);
            item.attr("id", "neighbourCell");
        });

        d3.selectAll("#cell").each(function () {
            var item = d3.select(this);
            for (var i = map.length - 1; i >= 0; i--)
                if (+item.attr("cX") == map[i][0] && +item.attr("cY") == map[i][1]) {
                    item.attr("id", "mainNeighbourCell");
                    var index = grid.decryptValue([+item.attr("cX"), +item.attr("cY")]);
                    if (grid.dataMatrix[index] == CellType.Empty)
                        grid.dataMatrix[index] = CellType.Neighbour;
                }
        });
    }

    //Поски всех соседей точки 
    getNeighboursId(p: number[], isUsingDiagonal: boolean): number[][] {
        let result: number[][] = [];
        let n = isUsingDiagonal ? 8 : 4;

        for (let i = 0; i < n; i++) {
            let point = [p[0] + this.shiftMatrix[i][0], p[1] + this.shiftMatrix[i][1]];

            if (point[0] >= 0 && point[0] < this.workField[0] && point[1] >= 0 && point[1] < this.workField[1])
                result.push(point)
        }

        return result;
    }

    neighbourNodes(vertex: Vertex, isUsingDiagonal: boolean): Vertex[] {
        let result: Vertex[] = [];
        var neighbours = this.getNeighboursId(vertex.point, isUsingDiagonal);

        for (var i = 0; i < neighbours.length; i++) {
            var id = this.decryptValue(neighbours[i]);

            if (id >= 0 && this.dataMatrix[id] != CellType.Wall) {
                result.push(new Vertex(neighbours[i], null))
            }
        }
        	
        this.fillNeighbour(result.map(r => r.point))

        return result;
    }

    //Является ли точка финишем 
    checkGoal(point: number[]) {
        if (point[0] == this.finishPoint[0] && point[1] == this.finishPoint[1])
            return true;

        return false;
    }

    decryptValue(value: number[]) {
        return value[0] + this.workField[0] * value[1];
    }

    encryptValue(value: number) {
        return [Math.ceil(value / this.workField[0]), Math.ceil(value % this.workField[5])];
    }

    //#region рисование 
    private fill(d: any, i: any, n: any) {
        this.isPenDown = true;

        let c = d3.select(n[i]);
        var index = this.decryptValue([+c.attr("cX"), +c.attr("cY")]);
        if (c.style("fill") == CellColor.Black) {
            this.currentColor = CellColor.Empty;
            c.style("fill", this.currentColor);
            this.dataMatrix[index] = CellType.Empty;
        } else {
            this.currentColor = CellColor.Black;
            c.style("fill", this.currentColor);
            this.dataMatrix[index] = CellType.Wall;
        }
    }

    //перемещение мыши
    private mousemove(d: any, i: any, n: any) {
        var c = d3.select(n[i])

        if (this.isPenDown) {
            c.style("fill", this.currentColor)
            var index = this.decryptValue([+c.attr("cX"), +c.attr("cY")]);
            if (this.currentColor == CellColor.Black)
                this.dataMatrix[index] = CellType.Wall;
            else this.dataMatrix[index] = CellType.Empty;
        }
    }

    //поднятие мыши
    private mouseup(d: any, i: any, n: any) {
        this.isPenDown = false;
        this.currentColor = CellColor.Empty;
    }

    //получение координат для рисования
    private getXY(x: number, y: number): number[] {
        let dx = (x % this.heightOfCell);
        let dy = (y % this.heightOfCell);
        let half = this.heightOfCell / 2;
        let coord = [0, 0];

        if (dx > half) {
            coord[0] = x + this.heightOfCell - dx;
        }
        if (dx <= half && dx >= 0) {
            coord[0] = x - dx;
        }
        if (dx < 0) {
            coord[0] = 0;
        }
        if (dy > half) {
            coord[1] = y + this.heightOfCell - dy;
        }
        if (dy <= half && dy >= 0) {
            coord[1] = y - dy;
        }
        if (dy < 0) {
            coord[1] = 0;
        }
        if (x > this.heightOfCell * this.workField[0] - half) {
            coord[0] = this.heightOfCell * this.workField[0] - this.heightOfCell;
        }
        if (y > this.heightOfCell * this.workField[1] - half) {
            coord[1] = this.heightOfCell * this.workField[1] - this.heightOfCell;
        }
        return coord;
    }
    //#endregion

    //#region  перенос точки
    private dragstarted(d: any, i: any, n: any) {
        d3.selectAll("#fillCell").attr("id", "cell");

        d3.select(n[i])
            .raise()
            .classed("active", true);
    }

    //перенос точки
    private dragged(d: any, i: any, n: any) {
        d3.select(n[i])
            .attr("x", d3.event.x)
            .attr("y", d3.event.y);
    }

    //фиксирование точки
    private dragended(d: any, i: any, n: any) {
        var end = d3.select(n[i]);
        var x = +end.attr("x");
        var y = +end.attr("y");
        var coord = this.getXY(x, y);

        end.attr("x", coord[0]);
        end.attr("y", coord[1]);

        if (end.attr("id") == "start") {
            this.startPoint = [coord[0] / this.heightOfCell, coord[1] / this.heightOfCell];
            d3.select("#startX").property("value", this.startPoint[0]);
            d3.select("#startY").property("value", this.startPoint[1]);
        } else {
            this.finishPoint = [coord[0] / this.heightOfCell, coord[1] / this.heightOfCell];
            d3.select("#finishX").property("value", this.finishPoint[0]);
            d3.select("#finishY").property("value", this.finishPoint[1]);
        }
        end.classed("active", false);
    }
    //#endregion
}
