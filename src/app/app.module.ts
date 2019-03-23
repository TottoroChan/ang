import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatDialogModule, MatToolbarModule, MatButtonToggleModule,
  MatSlideToggleModule, MatButtonModule, MatCardModule,
  MatInputModule, MatSliderModule, MatSelectModule,
  MatIconModule
} from '@angular/material';
import { AppComponent } from './app.component';
import { SettingsComponent } from './components/settings/settings.component';
import { AlgorithmsComponent } from './components/algorithms/algorithms.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { GridService } from './services/grid.service';
import { GridComponent } from './components/grid/grid.component';
import { StackComponent } from './components/stack/stack.component';
import { PlayerService } from './services/player.service';
import { StackService } from './services/stack.service';

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
    AppComponent,
    SettingsComponent,
    AlgorithmsComponent,
    DialogComponent,
    GridComponent,
    StackComponent
  ],
  entryComponents: [
    DialogComponent
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [
    GridService,
    PlayerService,
    StackService
  ]
})

export class AppModule { }