import { Component } from '@angular/core';
import * as d3 from "d3";
import { Grid } from './library/grid';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DialogComponent } from './dialog.component';

@Component({
    selector: 'ctrl-panel',
    templateUrl: 'templates/control-panel.component.html'
})

export class ControlPanelComponent {
    heightOfCell: number = 30;
    workField: number[] = [10, 10];
    transparency: number = 100;
    dataMatrix: Uint8Array;
    grid: any;
    list: string[];
    listId: string = "mainList";
    selected: number;

    constructor(private dialog: MatDialog) { }

    ngOnInit(): void {
        if (sessionStorage.getItem(this.listId) == null)
            this.list = [];
        else this.list =  sessionStorage.getItem(this.listId).split(",");
        this.grid = new Grid(this.heightOfCell, this.workField);
        this.grid.createGrid();
    }

    redrawField(): void {
        this.clearField();

        this.grid = new Grid(this.heightOfCell, this.workField);
        console.log(this.grid)
        this.grid.createGrid();
    }

    changeTransparency() {
        this.grid.changeTransparency(this.transparency);
    }

    openPopup() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.width = "500px";
        dialogConfig.height = "200px";
        dialogConfig.disableClose = true;
        dialogConfig.data = "";

        const dialogRef = this.dialog.open(DialogComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(result => {
            if (result.length > 0)
                this.saveGrid(result);               

        });
    }

    saveGrid(key: string) {
        this.dataMatrix = this.grid.dataMatrix;
        sessionStorage.setItem(key, JSON.stringify(this.grid));

        this.list.push(key);
        sessionStorage.setItem(this.listId, this.list.toString());
    }

    getGrid() {
        this.clearField();

        let grid = JSON.parse(sessionStorage.getItem(this.list[this.selected]));
        this.heightOfCell = grid.heightOfCell;
        this.workField = grid.workField;
        this.dataMatrix = grid.dataMatrix;

        this.grid.createGridFromStorage(grid.heightOfCell, grid.workField, 
            grid.startPoint, grid.finishPoint, grid.dataMatrix);
    }

    removeItem(){
        this.list.splice(this.selected, 1)
    }

    clearField(){        
        d3.select("#canvas")
            .selectAll("*")
            .remove();
        d3.select("#stack .wraper")
            .selectAll("*")
            .remove();
    }
}