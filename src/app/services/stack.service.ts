import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})

export class StackService {
    private _data: number[][];
    private _current: number[];
    stackUpdated: Subject<any> = new Subject(); 
    currentPointUpdated: Subject<any> = new Subject();
    isBackwardStep: Subject<any> = new Subject();;

    constructor() {
        this._data = [];
        this._current = [];
    }

    updateCurrent(value: number[]){
        this._current = value;
        this.currentPointUpdated.next(this._current)
    }

    backwardStep(){
        this.isBackwardStep.next();
    }

    updateStack(value: number[][]) {
         this._data = value; 
         this.stackUpdated.next(this._data);
    }
}