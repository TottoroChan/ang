import * as d3 from "d3";
import { Component } from "@angular/core";
import { Vertex } from 'src/app/constants/vertex';
import { StackService } from 'src/app/services/stack.service';

@Component({
  selector: 'stack',
  templateUrl: 'stack.component.html',
})

export class StackComponent {

  constructor(private stackService: StackService) {
    this.stackService.stackUpdated.subscribe(value => {
      value.forEach(element => {
        this.savePoint(element);
      });
    });
  }

  savePoint(vertex: Vertex) {
    if (vertex.parent != null) {
      let div = d3.select("#stack .wraper").append("div")
        .attr('class', "stack-element")
        .attr("x", vertex.point[0])
        .attr("y", vertex.point[1]);
      div.append("p").text("Point: [" + vertex.point[0] + "," + vertex.point[1] + "]")
      div.append("p").text("Parent: [" + vertex.parent.point[0] + "," + vertex.parent.point[1] + "]")
    }

    let stackElement = d3.selectAll(".stack-element");
    if (stackElement) {
      stackElement.on("mouseover", this.stackMouseOver)
        .on("mouseout", this.stackMouseOut);
    }

  }
  stackMouseOver(d: any, i: any, n: any): any {
    let element = d3.select(n[i]);

    d3.selectAll("rect").each(function () {
      let item = d3.select(this);
      if (+item.attr("cX") == +element.attr("x") &&
        +item.attr("cY") == +element.attr("y"))
        item.classed("highlight", true);
    });
  }
  stackMouseOut() {
    d3.select(".highlight").classed("highlight", false);
  }
}