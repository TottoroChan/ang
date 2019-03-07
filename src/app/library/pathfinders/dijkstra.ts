import { PathFinder } from "./pathfinder";
import { Grid } from "../grid";
import { Vertex } from "../vertex";
import { Player } from "../player";

export class Dijkstra extends PathFinder {
    valid: boolean[];
    weight: number[];
    infinityValue: number;

    constructor(grid: Grid, isUsingDiagonal: boolean, player: Player) {
        super(grid, isUsingDiagonal, player);

        this.valid = this.createArray(true);
        this.infinityValue = grid.dataMatrix.length * 2;
        this.weight = this.createArray(this.infinityValue);
        this.weight[grid.decryptValue(grid.startPoint)] = 0;
    }

    createArray(value: any): any[] {
        let result: number[] = [];

        for (let i = 0; i < this.grid.dataMatrix.length; i++) {
            result[i] = value;
        }

        return result;
    }

    async work(): Promise<Vertex> {

        for (let i = 0; i < this.grid.dataMatrix.length; i++) {

            this.step();      
        }

        console.log("result deekstr")
        console.log(this.valid)
        console.log(this.weight)
        return null;
    }

    step(): any {
        let min = this.infinityValue+1;
        let id_min = -1;

        for (let i = 0;i < this.weight.length; i++) {
            if(this.valid[i] && this.weight[i]<min){
                min = this.weight[i];
                id_min = i;
            }             
        }
            
        let neighbours = this.grid.neighbourNodes(new Vertex(this.grid.encryptValue(id_min), null), this.isUsingDiagonal)
        for (let i = 0; i < neighbours.length; i++) {
            let weight = this.weight[id_min]+ 1;
            if(weight < this.weight[i]) {
                weight[this.grid.decryptValue(neighbours[i].point)] = weight
            }               
        }
        
        this.valid[id_min] = false;      
    }   

    // выбрать начальную вершину
    // создать начальную кайму из вершин, соединенных с начальной
    // while вершина назначения не достигнута do
    //     выбрать вершину каймы с кратчайшим расстоянием до начальной
    //     добавить эту вершину и ведущее в нее ребро к дереву
    //     изменить кайму путем добавления к ней вершин, 
    //         соединенных с вновь добавленной
    //     for всякой вершины каймы do
    //         приписать к ней ребро, соединяющее ее с деревом и 
    //             завершающее кратчайший путь к начальной вершине
    //     end for
    // end while
    /*dj(){
        let start = new Vertex(this.grid.startPoint, null);
        let neighbours = this.grid.neighbourNodes(start, this.isUsingDiagonal);
        neighbours.forEach(node => node.setParent(start));
        let goalNotFound = true;
        let tree:Vertex[] = [];

        do{
            let minNode = this.findMinWeight(neighbours);
            tree.push[minNode]
            let newN =  this.grid.neighbourNodes(minNode, this.isUsingDiagonal);
            newN.forEach(node =>{ node.setParent(minNode);  neighbours.push(node)});
           
            for (let i = 0; i < neighbours.length; i++) {
                                
            }


        }while(goalNotFound)
    }*/

    findMinWeight(neighbours: Vertex[]): any {
        let min = neighbours[0].weight;
        let result = neighbours[0];

        for (let i = 0; i < neighbours.length; i++) {
            if(min < neighbours[i].weight){
                min = neighbours[i].weight;
                result = neighbours[i];
            }            
        }

        return result;
    }
}