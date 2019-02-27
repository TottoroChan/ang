import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { GridComponent } from './grid.component';
import { ControlPanelComponent } from './control-panel.component';
import { AlgorithmComponent } from './algorithm-panel.component';

@NgModule({
    imports: [BrowserModule, FormsModule],
    declarations: [GridComponent, ControlPanelComponent, AlgorithmComponent],
    bootstrap: [GridComponent]
})
export class AppModule { }