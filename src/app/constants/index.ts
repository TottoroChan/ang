export const _height: number = 30;
export const _fieldSize: number[] = [10, 10];
export const _transparency: number = 100;
export const _listOfFields: string = "mainList";
export const _shiftMatrix: number[][] = [[0, -1], [-1, 0], [1, 0], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];;
export const _algorithmList: [string, string][] = [["astar", "A*"],
                                                    ["bfs", "Поиск в ширину"],
                                                    ["wave", "Алгоритм Ли"],
                                                    ["dk", "Алгоритм Дейкстры"],
                                                    ["jps", "Прыжковой поиск"]];
export const _heuristicList: [string, string][] = [["cheb", "Чебышева"],
                                                    ["manh", "Манхеттена"],
                                                    ["eucl", "Евклида"]];
export const _startPoint: number[] = [0, 0];
export const _finishPoint: number[] = [1, 0];

export enum CellType {
    Empty = 0,
    Wall = 100,
}
export enum CellColor {
    Black = "black",
    Empty = ""
}

export class GridData{
    height: number; 
    fieldSize: number[];
    startPoint: number[];
    finishPoint: number[];
    data: Uint8Array;

    constructor(height: number, fieldSize: number[], startPoint: number[],
        finishPoint: number[], data: Uint8Array){
        this.height = height;
        this.fieldSize = fieldSize;
        this.startPoint = startPoint;
        this.finishPoint = finishPoint;
        this.data = data;
    }
}