import { Component } from '@angular/core';
import * as d3 from "d3";
import { Grid } from './library/grid';

@Component({
    selector: 'ctrl-panel',
    templateUrl: 'templates/control-panel.component.html'
})

export class ControlPanelComponent {
    heightOfCell: number = 30;
    workField: number[] = [10, 10];
    startPoint: number[] = [9, 9];
    finishPoint: number[] = [0, 0];
    grid: any;


    ngOnInit(): void {
        this.grid = new Grid(this.heightOfCell, this.workField, this.startPoint, this.finishPoint);
        this.grid.createGrid();
    }

    redrawField(): void {
        d3.select("#canvas")
            .selectAll("*")
            .remove();

        this.heightOfCell = +d3.select("#fieldH").property("value");
        this.workField = [+d3.select("#fieldR").property("value"), +d3.select("#fieldC").property("value")];
        this.startPoint = [+d3.select("#startX").property("value"), +d3.select("#startY").property("value")];
        this.finishPoint = [+d3.select("#finishX").property("value"), +d3.select("#finishY").property("value")];
        console.log(this)
        this.grid = new Grid(this.heightOfCell, this.workField, this.startPoint, this.finishPoint);
        console.log(this.grid)
        this.grid.createGrid();
    }
}