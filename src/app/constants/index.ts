export const _shiftMatrix: number[][] = [[0, -1], [-1, 0], [1, 0], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];;
export const _algorithmList: [string, string][] = [["astar", "A*"],
                                                    ["wave", "Wave"],
                                                    ["bfs", "BFS"],
                                                    ["jps", "JPS"],
                                                    ["dk", "Dijkstra's"]];
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