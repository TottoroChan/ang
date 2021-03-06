import * as d3 from "d3";
import { Component } from "@angular/core";
import { StackService } from 'src/app/services/stack.service';
import { GridService } from 'src/app/services/grid.service';

@Component({
    selector: 'stack',
    templateUrl: 'stack.component.html',
})

export class StackComponent {

    constructor(private stackService: StackService, private gridService: GridService) {
        this.stackService.currentPointUpdated.subscribe(value => {
            this.setCurrentPoint(value);
        });
        this.stackService.stackUpdated.subscribe(value => {
            value.forEach(element => {
                this.addPointToStack(element);
            });
        });
        this.stackService.isBackwardStep.subscribe(() => {
            this.addEvents();
        });
    }

    setCurrentPoint(point: number[]) {
        let div = d3.select("#stack .current").append("div")
            .attr('class', "stack-element")
            .attr("x", point[0])
            .attr("y", point[1]);
        div.append("p").text("[" + point[0] + "," + point[1] + "]")
    }

    addPointToStack(point: number[]) {
        let div = d3.select("#stack .wrapper").append("div")
            .attr('class', "stack-element")
            .attr("x", point[0])
            .attr("y", point[1]);
        div.append("p").text("[" + point[0] + "," + point[1] + "]")

        this.addEvents();
    }

    addEvents(){
        let stackElement = d3.selectAll(".stack-element");
        if (stackElement) {
            stackElement.on("mouseover", this.stackMouseOver.bind(this))
                .on("mouseout", this.stackMouseOut);
        }
    }
    stackMouseOver(d: any, i: any, n: any): any {
        let element = d3.select(n[i]);
        let isFinishPoint = this.gridService.checkGoal([+element.attr("x"), +element.attr("y")]);

        d3.selectAll("rect").each(function () {
            let item = d3.select(this);
            if (isFinishPoint)
                d3.select("#finish").classed("highlight", true);
            else if (+item.attr("cx") == +element.attr("x") &&
                +item.attr("cy") == +element.attr("y"))
                item.classed("highlight", true);
        });
    }
    stackMouseOut() {
        d3.select(".highlight").classed("highlight", false);
    }
}