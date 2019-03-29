import { Injectable } from '@angular/core';
import { Vertex } from '../constants/vertex';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})

export class StackService {
    private _data: number[][];
    stackUpdated: Subject<any> = new Subject(); 

    constructor() {
        this._data = [];
    }
s
    updateStack(value: number[][]) {
         this._data = value; 
         this.stackUpdated.next(this._data);
    }
}