import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
import { GridService } from 'src/app/services/grid.service';


@Component({
    selector: 'settings',
    templateUrl: 'settings.component.html'
})

export class SettingsComponent {
    height: number = 30;
    fieldSize: number[] = [10, 10];
    transparency: number = 100;
    data: Uint8Array;
    list: string[];
    listId: string = "mainList";
    selected: number;

    constructor(private dialog: MatDialog, private gridService: GridService) { 

    }

    ngOnInit(): void {
        if (sessionStorage.getItem(this.listId) == null)
            this.list = [];
        else this.list =  sessionStorage.getItem(this.listId).split(",");
        // this.grid = new Grid(this.height, this.firldSize);
        // this.grid.createGrid();
        this.redrawField();   
    }

    redrawField(): void {
        this.gridService.setGrid(this.fieldSize, this.height)
        //this.grid = new Grid(this.height, this.firldSize);
        //this.grid.createGrid();
    }

    changeTransparency() {
        this.gridService.changeTransparency(this.transparency);
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
        this.data = this.gridService.data;
        sessionStorage.setItem(key, JSON.stringify(this.gridService));

        this.list.push(key);
        sessionStorage.setItem(this.listId, this.list.toString());
    }

    getGrid() {
        let grid = JSON.parse(sessionStorage.getItem(this.list[this.selected]));
        this.height = grid.height;
        this.fieldSize = grid.fieldSize;
        this.data = grid.data;

        this.gridService.loadGrid(grid.height, grid.fieldSize, 
            grid.startPoint, grid.finishPoint, grid.data);
    }

    removeItem(){
        this.list.splice(this.selected, 1)
    }
}