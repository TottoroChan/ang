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
    transparency: number = 100;
    grid: any;


    ngOnInit(): void {
        this.grid = new Grid(this.heightOfCell, this.workField, this.startPoint, this.finishPoint);
        this.grid.createGrid();
    }

    redrawField(): void {
        d3.select("#canvas")
            .selectAll("*")
            .remove();            
        d3.select("#stack .wraper")
            .selectAll("*")
            .remove();
        

        if (this.startPoint[0] > this.workField[0])
            this.startPoint[0] = this.workField[0] -1;
        if (this.startPoint[1] > this.workField[1])
            this.startPoint[1] = this.workField[1] -1;
        if (this.finishPoint[0] > this.workField[0])
            this.finishPoint[0] = this.workField[0] -1;
        if (this.finishPoint[1] > this.workField[1])
            this.finishPoint[1] = this.workField[1] -1;

        this.grid = new Grid(this.heightOfCell, this.workField, this.startPoint, this.finishPoint);
        console.log(this.grid)
        this.grid.createGrid();
    }

    changeTransparency(){
        this.grid.changeTransparency(this.transparency);
    }
}