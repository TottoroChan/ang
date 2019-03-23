import { Injectable } from '@angular/core';
import { Vertex } from '../constants/vertex';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})

export class StackService {
    private _data: Vertex[];
    stackUpdated: Subject<any> = new Subject(); 

    constructor() {
        this._data = [];
    }

    updateStack(value: Vertex[]) {
         this._data = value; 
         this.stackUpdated.next(this._data);
    }
}