import { Vertex } from "../vertex";
import { IPathFinder } from "./Ipathfinder";
import * as d3 from "d3";
import { PlayerService } from 'src/app/services/player.service';
import { GridService } from 'src/app/services/grid.service';
import { StackService } from 'src/app/services/stack.service';

export class Astar extends IPathFinder {
    betterValue: boolean;
    openSet: Vertex[];
    resultSet: Vertex[];
    neighbours:  Vertex[];

    constructor(isUsingDiagonal: boolean, playerService: PlayerService, 
        gridService: GridService, stackService: StackService ) {        
        super(isUsingDiagonal, playerService, gridService, stackService);
        this.openSet = []; // Множество вершин, которые предстоит изучить.
        this.resultSet = []; // Множество изученых вершин

        let startPoint = new Vertex(this.gridService.startPoint, null);
        startPoint.setG(this.gridService.startPoint);
        startPoint.setH(this.isUsingDiagonal, this.gridService.finishPoint);
        startPoint.setF();
        this.openSet.push(startPoint); //добавление начальной вершины 
    }

    async work(): Promise<Vertex> {       
        while (this.openSet.length > 0) { //пока список изученых не пустой
            await this.playerService.whait();
            let result = this.step();
            if (result)
                return result;
        }

        throw new Error("I can't find path");
    }

    step(): Vertex{
        let vertex = this.vertexWithMinF(); //вершина с самым маленьким F
        this.setCurrentPoint(vertex.point);
        
        if (this.gridService.checkGoal(vertex.point)) { // если финиш - выходим
            return vertex;
        }

        let index = this.openSet.indexOf(vertex);
        this.openSet.splice(index, 1); // удалям вершину и отправляем ее на изучение
        this.resultSet.push(vertex);
        this.setStackData(this.openSet.map(x => x.point));

        this.neighbours = this.gridService.neighbourNodes(vertex, this.isUsingDiagonal); // список соседних точек		
        this.fillNeighbour(this.neighbours.map(r => r.point));
        
        let neighbour = null;
        for (let i = 0; i < this.neighbours.length; i++) {
            neighbour = this.neighbours[i];
            neighbour = this.checkNeighbours(neighbour, vertex);
        }

        return null;
    }

    checkNeighbours(neighbour: Vertex, vertex: Vertex): any {        
        let betterValue = false;
        if (this.vertexisExist(this.resultSet, neighbour)) //если уже есть в списке
            return;
        
        let g_score = vertex.g + vertex.pathTo(neighbour); //g для обрабатываеиого соседа
        let node = this.getVertex(this.openSet, neighbour);
        
        if (node == null) { //соседа нет в списке
            neighbour.setG(this.gridService.startPoint);
            neighbour.setH(this.isUsingDiagonal, this.gridService.finishPoint);
            neighbour.setF();
            this.openSet.push(neighbour);
            betterValue = true; // лучший сосед

            node = neighbour;
            
            this.setStackData(this.openSet.map(x => x.point));
        }
        else { //сосед уже есть в списке
            if (g_score < node.g)
                betterValue = true; //необходимо обновить значения
            else
                betterValue = false;
        }
        
        if (betterValue) { // обновление значений
            node.parent = vertex;
            node.g = g_score;
            node.setH(this.isUsingDiagonal, this.gridService.finishPoint);
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
