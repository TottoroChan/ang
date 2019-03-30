import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})

export class StackService {
    private _data: number[][];
    private _current: number[];
    stackUpdated: Subject<any> = new Subject(); 
    currentUpdated: Subject<any> = new Subject();

    constructor() {
        this._data = [];
        this._current = [];
    }

    updateCurrent(value: number[]){
        this._current = value;
        this.currentUpdated.next(this._current)
    }

    updateStack(value: number[][]) {
         this._data = value; 
         this.stackUpdated.next(this._data);
    }
}