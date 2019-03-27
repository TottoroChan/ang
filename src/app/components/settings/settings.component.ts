import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
import { GridService } from 'src/app/services/grid.service';
import { GridData } from 'src/app/constants';


@Component({
    selector: 'settings',
    templateUrl: 'settings.component.html'
})

export class SettingsComponent {
    height: number = 30;
    fieldSize: number[] = [10, 10];
    transparency: number = 100;
    list: string[];
    listId: string = "mainList";
    selected: number;

    constructor(private dialog: MatDialog, private gridService: GridService) {

    }

    ngOnInit(): void {
        if (sessionStorage.getItem(this.listId) == null)
            this.list = [];
        else this.list = sessionStorage.getItem(this.listId).split(",");
        this.redrawField();
    }

    redrawField(): void {
        this.gridService.setGrid(this.fieldSize, this.height)
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
        let gridData = new GridData(this.gridService.height, this.gridService.fieldSize,
             this.gridService.startPoint, this.gridService.finishPoint, this.gridService.data)
        sessionStorage.setItem(key, JSON.stringify(gridData));

        this.list.push(key);
        sessionStorage.setItem(this.listId, this.list.toString());
    }

    getGrid() {
        let grid = JSON.parse(sessionStorage.getItem(this.list[this.selected]));
        this.height = grid.height;
        this.fieldSize = grid.fieldSize;

        this.gridService.loadGrid(grid.height, grid.fieldSize,
            grid.startPoint, grid.finishPoint, grid.data);
    }

    removeItem() {
        this.list.splice(this.selected, 1)
    }
}