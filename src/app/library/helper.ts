
export enum CellType {
    Empty = 0,
    Wall = 1,
    Neighbour = 2,
}
export enum CellColor {
    Black = "black",
    Empty = ""
}

export class ShiftMatrix {
    readonly normal: number[][];
    readonly diagonal: number[][];

    constructor() {
        this.normal = [[-1, 0], [0, -1], [0, 1], [1, 0]]
        this.diagonal = [[-1, -1], [-1, 1], [1, -1], [1, 1]]
    }
}