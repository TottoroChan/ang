import * as d3 from "d3";
import { Component } from '@angular/core';
import { CellColor, CellType } from 'src/app/constants';
import { GridService } from 'src/app/services/grid.service';
import { PlayerService } from 'src/app/services/player.service';

@Component({
    selector: 'grid',
    templateUrl: 'grid.component.html',
})

export class GridComponent {
    height: number = 30;
    isPenDown: boolean;
    currentColor: CellColor = CellColor.Empty;
    transparency: number;

    constructor(private gridService: GridService,private playerService: PlayerService ) {
        this.gridService.workIsFinished.subscribe(value => {
              this.fillPath(value); 
            }); 
        this.gridService.trancparencyChanged.subscribe(value => {
              this.transparency = value; 
            }); 
        this.gridService.gridChanged.subscribe(() => {
              this.build(); 
            }); 

        //this.build();
    }

    rebuildGrid(height: number, fieldSize: number[]) {
        this.height = height;
        this.gridService.setGrid(fieldSize, height);
    }

    clear(){        
        d3.select("#canvas")
            .selectAll("*")
            .remove();
        d3.select("#stack .wraper")
            .selectAll("*")
            .remove();
    }

    build() {
        this.clear();

        let svg = d3.select("#canvas")
            .append("svg")
            .attr("width", this.height * this.gridService.fieldSize[0])
            .attr("height", this.height * this.gridService.fieldSize[1]);

        for (let i = 0; i < this.gridService.fieldSize[1]; i++) {
            let rows = svg.append("g");

            for (let j = 0; j < this.gridService.fieldSize[0]; j++) {
                let cell = this.gridService.getValueByPoint([j, i]);;
                let rect = rows.append("rect")
                    .attr("x", j * this.height)
                    .attr("y", i * this.height)
                    .attr("cX", j)
                    .attr("cY", i)
                    .attr("width", this.height)
                    .attr("height", this.height)
                    .attr("id", "cell");

                if (cell == CellType.Wall) {
                    rect.style("fill", CellColor.Black)
                }
                else {
                    if (cell != CellType.Empty) {
                        rect.style("fill", CellColor.Black)
                        rect.style("opacity", cell / 100);
                    }
                }
            }
        }

        this.drawPoint(this.gridService.startPoint, "start");
        this.drawPoint(this.gridService.finishPoint, "finish");
        this.addIvents();
    }

    private drawPoint(point: number[], id: string) {
        d3.select("svg")
            .append("rect")
            .attr("id", id)
            .attr("x", point[0] * this.height)
            .attr("y", point[1] * this.height)
            .attr("width", this.height)
            .attr("height", this.height);
    }

    //создание событий
    private addIvents() {
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
        for (let i = path.length - 1; i >= 0; i--)
            d3.select("svg").insert("circle")
                .attr("id", "pathCell")
                .attr("cx", path[i][0]*this.height + this.height/2)
                .attr("cy", path[i][1]*this.height +  this.height/2)
                .attr("r", this.height / 4);
    }

    //#region рисование 
    private fill(d: any, i: any, n: any) {
        this.isPenDown = true;
        let element = d3.select(n[i]);
        let index = this.gridService.toIndex([+element.attr("cX"), +element.attr("cY")]);

        if (element.style("fill") == CellColor.Black) {
            this.currentColor = CellColor.Empty;
            this.gridService.data[index] = CellType.Empty;
            element.style("fill", this.currentColor);
        }
        else {
            this.currentColor = CellColor.Black;

            if (this.transparency == CellType.Wall)
                this.gridService.data[index] = CellType.Wall;
            else this.gridService.data[index] = this.transparency;

            element.style("fill", this.currentColor);
            element.style("opacity", this.transparency / 100);
        }
    }

    //перемещение мыши
    private mousemove(d: any, i: any, n: any) {
        let element = d3.select(n[i])
        let transparency = 0;

        if (this.isPenDown) {
            let index = this.gridService.toIndex([+element.attr("cX"), +element.attr("cY")]);

            if (this.currentColor == CellColor.Black) {
                this.gridService.data[index] = this.transparency;
                transparency = this.transparency / 100;
                element.style("opacity", transparency == 0 ? "" : transparency);
            }
            else {
                this.gridService.data[index] = CellType.Empty;
            }

            element.style("fill", this.currentColor)
        }
    }

    //поднятие мыши
    private mouseup(d: any, i: any, n: any) {
        this.isPenDown = false;
        this.currentColor = CellColor.Empty;
    }

    //получение координат для рисования
    private getXY(x: number, y: number): number[] {
        let dx = (x % this.height);
        let dy = (y % this.height);
        let half = this.height / 2;
        let coord = [0, 0];

        if (dx > half) {
            coord[0] = x + this.height - dx;
        }
        if (dx <= half && dx >= 0) {
            coord[0] = x - dx;
        }
        if (dx < 0) {
            coord[0] = 0;
        }
        if (dy > half) {
            coord[1] = y + this.height - dy;
        }
        if (dy <= half && dy >= 0) {
            coord[1] = y - dy;
        }
        if (dy < 0) {
            coord[1] = 0;
        }
        if (x > this.height * this.gridService.fieldSize[0] - half) {
            coord[0] = this.height * this.gridService.fieldSize[0] - this.height;
        }
        if (y > this.height * this.gridService.fieldSize[1] - half) {
            coord[1] = this.height * this.gridService.fieldSize[1] - this.height;
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
        let end = d3.select(n[i]);
        let x = +end.attr("x");
        let y = +end.attr("y");
        let coord = this.getXY(x, y);

        end.attr("x", coord[0]);
        end.attr("y", coord[1]);

        if (end.attr("id") == "start") {
            this.gridService.startPoint = [coord[0] / this.height, coord[1] / this.height];
            d3.select("#startX").property("value", this.gridService.startPoint[0]);
            d3.select("#startY").property("value", this.gridService.startPoint[1]);
        }
        else {
            this.gridService.finishPoint = [coord[0] / this.height, coord[1] / this.height];
            d3.select("#finishX").property("value", this.gridService.finishPoint[0]);
            d3.select("#finishY").property("value", this.gridService.finishPoint[1]);
        }
        end.classed("active", false);
    }
    //#endregion

}