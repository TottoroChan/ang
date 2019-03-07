import { Subject, interval, Subscription } from "rxjs";
import { first } from 'rxjs/operators';

export class Player {
    subject: Subject<{}>;
    player: Subscription;
    previous: this;


    constructor() {
        this.subject = new Subject();
    }

    play() {
        this.player = interval(70).subscribe(this.subject);
    }

    forward() {
        this.previous = this;;
        this.subject.next();
    }

    backward() {
        this.subject = this.previous.subject;
    }

    stop(): void {
        this.player.unsubscribe();
    }

    whait(): Promise<{}> {
        return this.subject.pipe(first()).toPromise()
    }
}