import { Subject, interval, Subscription } from "rxjs";
import { first } from 'rxjs/operators';
import { Vertex } from "./vertex";
import * as d3 from "d3";

export class Player {
    subject: Subject<{}>;
    player: Subscription;

    constructor() {
        this.subject = new Subject();
    }

    play(time: number) {
        this.player = interval(time).subscribe(this.subject);
    }

    forward() {
        this.subject.next();
    }

    backward() {

    }

    stop(): void {
        this.player.unsubscribe();
    }

    whait(): Promise<{}> {
        console.log("wait");
        console.log(this.subject);
        return this.subject.pipe(first()).toPromise()
    }
}