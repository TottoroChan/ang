import { Injectable } from '@angular/core';
import { Subject, interval, Subscription } from "rxjs";
import { first } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})

export class PlayerService {
    subject: Subject<{}>;
    player: Subscription;

    constructor() {
        this.subject = new Subject();
    }

    play() {
        this.player = interval(50).subscribe(this.subject);
    }

    forward() {
        this.subject.next();
    }

    stop(): void {
        this.player.unsubscribe();
    }

    wait(): Promise<{}> {
        return this.subject.pipe(first()).toPromise()
    }
}