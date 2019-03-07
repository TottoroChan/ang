import { Subject, interval, Subscription } from "rxjs";
import { first } from 'rxjs/operators';

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
        return this.subject.pipe(first()).toPromise()
    }
}