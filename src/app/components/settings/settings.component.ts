import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
import { GridService } from 'src/app/services/grid.service';
import { GridData, _height, _fieldSize, _transparency, _listOfFields } from 'src/app/constants';


@Component({
    selector: 'settings',
    templateUrl: 'settings.component.html'
})

export class SettingsComponent {
    height: number = _height;
    fieldSize: number[] = _fieldSize;
    transparency: number = _transparency;
    savedList: string[];
    listOfFields: string = _listOfFields;
    selected: number;

    constructor(private dialog: MatDialog, private gridService: GridService) {

    }

    ngOnInit(): void {
        if (sessionStorage.getItem(this.listOfFields) == null)
            this.savedList = [];
        else this.savedList = sessionStorage.getItem(this.listOfFields).split(",");
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

        this.savedList.push(key);
        sessionStorage.setItem(this.listOfFields, this.savedList.toString());
    }

    getGrid() {
        let grid = JSON.parse(sessionStorage.getItem(this.savedList[this.selected]));
        this.height = grid.height;
        this.fieldSize = grid.fieldSize;

        this.gridService.loadGrid(grid.height, grid.fieldSize,
            grid.startPoint, grid.finishPoint, grid.data);
    }

    removeItem() {
        this.savedList.splice(this.selected, 1)
    }
}