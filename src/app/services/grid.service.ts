import { Injectable } from '@angular/core';
import { _shiftMatrix, CellType, _startPoint, _finishPoint, } from '../constants';
import { Vertex } from '../constants/vertex';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})

export class GridService {
    private _shiftMatrix: number[][] = _shiftMatrix;
    private _startPoint: number[] = [0, 0];
    private _finishPoint: number[] = [1, 0];
    private _fieldSize: number[] = [10, 10];
    private _height: number = 30;
    private _data: Uint8Array;
    private _fromStorage = false;
    private _length: number;
    workIsFinished: Subject<any> = new Subject(); 
    transparencyChanged: Subject<any> = new Subject(); 
    gridChanged: Subject<any> = new Subject(); 
    isBackwardStep: Subject<any> = new Subject();

    constructor() {
        this._data = new Uint8Array(this._fieldSize[0] * this._fieldSize[1]);
    }


    finish(path: number[][]){
        this.workIsFinished.next(path);
    }

    backwardStep(){
        this.isBackwardStep.next();
    }

    changeTransparency(transparency: number): any {
        this.transparencyChanged.next(transparency)      
    }


    loadGrid(height: any, fieldSize: any, startPoint: any, finishPoint: any, data: any): any {
        this._startPoint = startPoint;
        this._finishPoint = finishPoint;
        this._data = data;
        this._fromStorage = true;
        this.setGrid(fieldSize, height);
    }

    setGrid(size: number[], height: number) {
        this._height = height;
        this._fieldSize = size;
        this._length = size[0] * size[1];
        if (!this._fromStorage){
            this._data = new Uint8Array(this._length);
            this._startPoint = _startPoint;
            this._finishPoint = _finishPoint;  
        }
        this.gridChanged.next() 
        this._fromStorage = false;   
    }

    get length() { return this._length; }
    get height() { return this._height; }

    get fieldSize() { return this._fieldSize; }
    set fieldSize(point: number[]) { this._fieldSize = point; }

    get startPoint() { return this._startPoint; }
    set startPoint(point: number[]) { this._startPoint = point; }

    get finishPoint() { return this._finishPoint; }
    set finishPoint(point: number[]) { this._finishPoint = point; }

    get data() { return this._data; }
    set data(value: Uint8Array) { this._data = value; }

    //Является ли точка финишем 
    checkGoal(point: number[]) {
        if (point[0] == this.finishPoint[0] && point[1] == this.finishPoint[1])
            return true;

        return false;
    }

    //Поски всех соседей точки 
    getNeighbours(p: number[], isUsingDiagonal: boolean): number[][] {
        let result: number[][] = [];
        let n = isUsingDiagonal ? 8 : 4;

        for (let i = 0; i < n; i++) {
            let point = [p[0] + this._shiftMatrix[i][0], p[1] + this._shiftMatrix[i][1]];

            if (point[0] >= 0 && point[0] < this.fieldSize[0] && point[1] >= 0 && point[1] < this.fieldSize[1])
                result.push(point)
        }

        return result;
    }

    neighbourNodes(vertex: Vertex, isUsingDiagonal: boolean): Vertex[] {
        let result: Vertex[] = [];
        let neighbours = this.getNeighbours(vertex.point, isUsingDiagonal);

        for (let i = 0; i < neighbours.length; i++) {
            let node = neighbours[i];
            let id = this.toIndex(node);

            if (id >= 0 && this._data[id] != CellType.Wall && this.checkAngle(vertex.point, node)) {
                let neighbour = new Vertex(node, null);
                neighbour.setWeight(this._data[id])
                result.push(neighbour)
            }
        }
        return result;
    }

    checkAngle(point: number[], node: number[]): boolean {
        let dx = node[0] - point[0];
        let dy = node[1] - point[1];

        if (dx != 0 && dy != 0){
            let neighbour1 = this.toIndex([point[0], point[1]+dy]);
            let neighbour2 = this.toIndex([point[0]+dx, point[1]]);

            if (this.data[neighbour1]!= CellType.Wall && this.data[neighbour2]!= CellType.Wall)
                return true;
            else return false;
        }
        return true;
    }

    getValueByPoint(point: number[]) {
        let id = point[0] + this.fieldSize[0] * point[1];
        return this._data[id];
    };

    toIndex(value: number[]) {
        return value[0] + this.fieldSize[0] * value[1];
    }

    toPoint(value: number) {
        return [value % this.fieldSize[0], Math.ceil((value - value % this.fieldSize[0]) / this.fieldSize[0])];
    }
}