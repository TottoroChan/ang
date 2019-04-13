import { Vertex } from "../vertex";
import { IPathFinder } from "./Ipathfinder";
import { PlayerService } from 'src/app/services/player.service';
import { GridService } from 'src/app/services/grid.service';
import { StackService } from 'src/app/services/stack.service';

export class Astar extends IPathFinder {
    betterValue: boolean;
    openSet: Vertex[];
    resultSet: Vertex[];
    neighbours: Vertex[];

    constructor(isUsingDiagonal: boolean, playerService: PlayerService,
        gridService: GridService, stackService: StackService) {
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

    step(): Vertex {
        let vertex = this.openSet[0]; //this.vertexWithMinF(); //вершина с самым маленьким F
        this.setCurrentPoint(vertex.point);

        this.openSet.splice(0, 1); // удалям вершину и отправляем ее на изучение
        this.resultSet.push(vertex);
        this.setStackData(this.openSet.map(x => x.point));

        this.neighbours = this.gridService.neighbourNodes(vertex, this.isUsingDiagonal); // список соседних точек	

        let neighbour = null;
        for (let i = 0; i < this.neighbours.length; i++) {
            neighbour = this.neighbours[i];
            if (this.gridService.checkGoal(neighbour.point)) { // если финиш - выходим
                neighbour.parent = vertex;
                return neighbour;
            }
            neighbour = this.checkNeighbours(neighbour, vertex);
        }

        return null;
    }

    checkNeighbours(neighbour: Vertex, vertex: Vertex): any {
        if (this.vertexisExist(this.resultSet, neighbour)) //если уже есть в списке
            return;

        let isDiaginal = neighbour.point[0] - vertex.point[0] != 0 && neighbour.point[1] - vertex.point[1] != 0;
        let diagonalCost = Math.sqrt( Math.pow(neighbour.weight, 2)*2);
        let g_score = vertex.g + (isDiaginal ?  diagonalCost : neighbour.weight); //g для обрабатываеиого соседа
        let node = this.getVertex(this.openSet, neighbour);
        
        if (node)
            neighbour = node;
        
        if (!node || g_score < neighbour.g) {//если нет в списке или можно обновить g   
            neighbour.g = g_score;
            neighbour.setH(this.isUsingDiagonal, this.gridService.finishPoint);
            neighbour.setF();
            neighbour.parent = vertex;

            if (!node) {//если нет в списке
                this.openSet.push(neighbour);

                this.fillNeighbour([neighbour.point]);
            } else {         
                this.updateMetrics(neighbour);
            }
            this.openSet.sort((a, b) => a.f - b.f);
            this.setStackData(this.openSet.map(x => x.point));
        }
    }

    updateMetrics(vertex: Vertex) {
        for (let i = 0; i < this.openSet.length; i++) {
            let point = this.openSet[i].point;
            if (point[0] == vertex.point[0] && point[1] == vertex.point[1]) {
                this.openSet[i].g = vertex.g;
                this.openSet[i].setF();
            }
        }
    }
}
