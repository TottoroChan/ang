import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { GridComponent } from './grid.component';
import { ControlPanelComponent } from './control-panel.component';
import { AlgorithmComponent } from './algorithm-panel.component';
import { DialogComponent } from './dialog.component';
import {
    MatDialogModule, MatToolbarModule, MatButtonToggleModule,
    MatSlideToggleModule, MatButtonModule, MatCardModule,
    MatInputModule, MatSliderModule, MatSelectModule,
    MatIconModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        BrowserAnimationsModule,
        MatDialogModule,
        MatToolbarModule,
        MatButtonToggleModule,
        MatSlideToggleModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatSliderModule,
        MatSelectModule,
        MatIconModule
    ],
    declarations: [
        GridComponent,
        ControlPanelComponent,
        AlgorithmComponent,
        DialogComponent],
    entryComponents: [
        DialogComponent
    ],
    bootstrap: [
        GridComponent
    ]
})

export class AppModule { }