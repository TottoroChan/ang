import { Vertex } from "../vertex";
import { PathFinder } from "./pathfinder";
import { Grid } from "../grid";
import { Player } from "../player";
import { platform } from "os";


export class Astar extends PathFinder {
    betterValue: boolean;
    openSet: Vertex[];
    resultSet: Vertex[];
    neighbours:  Vertex[];

    constructor(grid: Grid, isUsingDiagonal: boolean, player: Player) {        
        super(grid, isUsingDiagonal, player);
        this.betterValue = false;
        this.openSet = []; // Множество вершин, которые предстоит изучить.
        this.resultSet = []; // Множество изученых вершин

        let startPoint = new Vertex(this.grid.startPoint, null);
        startPoint.setG(this.grid.startPoint);
        startPoint.setH(this.isUsingDiagonal, this.grid.finishPoint);
        startPoint.setF();
        this.openSet.push(startPoint); //добавление начальной вершины 
    }

    async work(): Promise<Vertex> {        
        while (this.openSet.length > 0) { //пока список изученых не пустой
            await this.player.whait();
            let result = this.step();
            if (result)
                return result;
        }

        throw new Error("I can't find path");
    }

    step(): Vertex{
        let vertex = this.vertexWithMinF(); //вершина с самым маленьким F
        
        if (this.grid.checkGoal(vertex.point)) { // если финиш - выходим
            return vertex;
        }

        let index = this.openSet.indexOf(vertex);
        this.openSet.splice(index, 1); // удалям вершину и отправляем ее на изучение
        this.resultSet.push(vertex);

        this.grid.savePoint(vertex);
        this.neighbours = this.grid.neighbourNodes(vertex, this.isUsingDiagonal); // список соседних точек		
        this.grid.fillNeighbour(this.neighbours.map(r => r.point));
        
        let neighbour = null;
        for (let i = 0; i < this.neighbours.length; i++) {
            neighbour = this.neighbours[i];
            neighbour = this.checkNeighbours(neighbour, vertex);
        }

        return null;
    }

    checkNeighbours(neighbour: Vertex, vertex: Vertex): any {
        if (this.vertexisExist(this.resultSet, neighbour)) //если уже есть в списке
            return;
        
        let g_score = vertex.g + vertex.pathTo(neighbour.point); //g для обрабатываеиого соседа
        let node = this.getVertex(this.openSet, neighbour);
        
        if (node == null) { //соседа нет в списке
            neighbour.setG(this.grid.startPoint);
            neighbour.setH(this.isUsingDiagonal, this.grid.finishPoint);
            neighbour.setF();
            this.openSet.push(neighbour);
            this.betterValue = true; // лучший сосед

            node = neighbour;
        }
        else { //сосед уже есть в списке
            if (g_score < node.g)
                this.betterValue = true; //необходимо обновить значения
            else
                this.betterValue = false;
        }
        
        if (this.betterValue) { // обновление значений
            node.parent = vertex;
            node.g = g_score;
            node.setH(this.isUsingDiagonal, this.grid.finishPoint);
            node.setF();
        }
    }

    vertexWithMinF(): Vertex {
        let minVertex = this.openSet[0];

        for (let i = 0; i < this.openSet.length; i++) {
            if (this.openSet[i].f < minVertex.f) {
                minVertex = this.openSet[i];
            }
        }

        return minVertex;
    }
}
