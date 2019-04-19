import { IPathFinder } from "./Ipathfinder";
import { Vertex } from "../vertex";
import { PlayerService } from 'src/app/services/player.service';
import { GridService } from 'src/app/services/grid.service';
import { StackService } from 'src/app/services/stack.service';

export class Dijkstra extends IPathFinder {
    openSet: Vertex[];
    resultSet: Vertex[];

    constructor(isUsingDiagonal: boolean, playerService: PlayerService,
        gridService: GridService, stackService: StackService) {
        super(isUsingDiagonal, playerService, gridService, stackService);
        this.openSet = []; // Множество вершин, которые предстоит изучить.
        this.resultSet = []; // Множество изученых вершин

        let startPoint = new Vertex(this.gridService.startPoint, null);
        startPoint.setG(this.gridService.startPoint);
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

    step(): Vertex {
        let vertex = this.openSet[0]; //this.vertexWithMinF(); //вершина с самым маленьким F
        this.openSet.splice(0, 1); // удалям вершину и отправляем ее на изучение
        
        this.setCurrentPoint(vertex.point);
        this.resultSet.push(vertex);
        this.setStackData(this.openSet.map(x => x.point));

        let neighbours = this.gridService.neighbourNodes(vertex, this.isUsingDiagonal); // список соседних точек	

        let neighbour = null;
        for (let i = 0; i < neighbours.length; i++) {
            neighbour = neighbours[i];
            if (this.gridService.checkGoal(neighbour.point)) { // если финиш - выходим
                neighbour.parent = vertex;
                return neighbour;
            }
            this.checkNeighbour(neighbour, vertex);
        }

        return null;
    }

    checkNeighbour(neighbour: Vertex, vertex: Vertex): any {
        if (this.vertexisExist(this.resultSet, neighbour)) //если уже есть в списке
            return;

        let isDiaginal = neighbour.point[0] - vertex.point[0] != 0 && neighbour.point[1] - vertex.point[1] != 0;
        let diagonalCost = Math.sqrt(Math.pow(neighbour.weight, 2) * 2);
        let g_score = vertex.g + (isDiaginal ? diagonalCost : neighbour.weight); //g для обрабатываеиого соседа
        let id = this.getElementID(neighbour.point);

        if (!id || g_score < neighbour.g) {//если нет в списке или можно обновить g   
            neighbour.g = g_score;
            neighbour.parent = vertex;

            if (!id) {//если нет в списке
                this.openSet.push(neighbour);

                this.fillNeighbour([neighbour.point]);
            } else {
                this.openSet[id].g = vertex.g;
            }
            this.updateStack(this.openSet)
        }
    }

    getElementID(vertex: number[]) {
        for (let i = 0; i < this.openSet.length; i++) {
            let point = this.openSet[i].point;
            if (point[0] == vertex[0] && point[1] == vertex[1]) {
                return i;
            }
        }
        return null;
    }

    updateStack(array: Vertex[]) {
        array.sort((a, b) => a.g - b.g);
        this.setStackData(array.map(x => x.point));
    }
}