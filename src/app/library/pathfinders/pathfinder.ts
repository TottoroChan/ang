import { Vertex } from "../vertex";
import { Grid } from "../grid";

export abstract class PathFinder {

    grid: Grid;
    isUsingDiagonal: boolean;

    constructor(grid: Grid, isUsingDiagonal: boolean) {
        this.grid = grid;
        this.isUsingDiagonal = isUsingDiagonal;
    }

    work(): Vertex {
        throw new Error("Not implemented");
    }

    reconstructPath(node: Vertex) {
        var path = [];
        while (node != null) {
            path.push(node.point)
            node = node.parent;
        }
        this.grid.fillPath(path);
    }

    vertexisExist(set: Vertex[], vertex: Vertex): boolean {
        for (let i = 0; i < set.length; i++) {
            if (set[i].point[0] == vertex.point[0] && set[i].point[1] == vertex.point[1])
                return true;
        }
        return false;
    }

    getVertex(set: Vertex[],vertex: Vertex): Vertex {
        if (set == null)
            return null;
        for (let i = 0; i < set.length; i++) {
            if (set[i] != null && set[i].point[0] == vertex.point[0] && set[i].point[1] == vertex.point[1])
                return set[i];
        }
        return null;
    }
};