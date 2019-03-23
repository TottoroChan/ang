import { Injectable } from '@angular/core';
import { Subject, interval, Subscription } from "rxjs";
import { first } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})

export class PlayerService {
    isFinished: Subject<any> = new Subject(); 
    subject: Subject<{}>;
    player: Subscription;
    previous: this;


    constructor() {
        this.subject = new Subject();
    }

    play() {
        this.player = interval(80).subscribe(this.subject);
    }

    forward() {
        this.previous = this;
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

    finish(path: number[][]){
        this.isFinished.next(path);
    }
}