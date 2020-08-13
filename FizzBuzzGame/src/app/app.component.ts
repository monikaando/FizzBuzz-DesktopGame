import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FizzBuzzService} from '../services/fizzBuzz.service';
import {map, switchMap, mapTo, first, share, delay, scan} from 'rxjs/operators';
import {isNumeric} from 'rxjs/internal-compatibility';
import {fromEvent, Observable, merge, Subject, zip, Subscription} from 'rxjs';
import {concat} from 'ramda';
import {Choice} from "./models/choice";
import {Input} from "./models/input";
import {Answer} from "./models/answer";
import {Results} from "./models/results";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit{
  title = 'FizzBuzzGame';
  score$ = 0;
  numbers$: Observable<number>;
  answers$: Observable<Answer[]>;
  numbersSub$: Subscription;
  game$: Subscription;
  public onStartClick = new Subject<boolean>();

  constructor(protected fizzBuzzService: FizzBuzzService) {
  }
  @ViewChild('numberButton', {static: true}) numberButton: ElementRef;
  @ViewChild('fizzButton', {static: true}) fizzButton: ElementRef;
  @ViewChild('buzzButton', {static: true}) buzzButton: ElementRef;
  @ViewChild('fizzBuzzButton', {static: true}) fizzBuzzButton: ElementRef;

  ngOnInit(): void {
    this.onStartClick.subscribe((response) => {
      this.playGame();
      this.numbers$ = this.fizzBuzzService.numbers$;
      this.numbersSub$ = this.numbers$.subscribe(val => {
        return val
      });
    });
  }

  playGame() {
    const numberBtn = fromEvent(this.numberButton.nativeElement, 'click');
    const fizzBtn = fromEvent(this.fizzButton.nativeElement, 'click');
    const buzzBtn = fromEvent(this.buzzButton.nativeElement, 'click');
    const fizzBuzzBtn = fromEvent(this.fizzBuzzButton.nativeElement, 'click');

    const ChoiceArray = (): Observable<Input> =>
      merge<Choice>(
        numberBtn.pipe(mapTo('Number')),
        fizzBtn.pipe(mapTo('Fizz')),
        buzzBtn.pipe(mapTo('Buzz')),
        fizzBuzzBtn.pipe(mapTo('FizzBuzz')),
        this.fizzBuzzService.numbers$.pipe(mapTo('-')),
      ).pipe<Input>(
        first(null, null),
      );

    const game$ = zip<[number, Choice, Input, number[]]>(
      this.fizzBuzzService.numbers$,
      this.fizzBuzzService.fizzBuzz$,
      this.fizzBuzzService.numbers$
        .pipe(
          delay(1),
          switchMap(ChoiceArray)
        )
    ).pipe(
      share()
    );

    const score$ = game$.pipe
    (scan((score, [numb, correctAnswer, userAnswer]) =>
      userAnswer && ((isNumeric(correctAnswer) && userAnswer === 'Number') ||
        (correctAnswer === userAnswer)) ? score + 1 : score - 1, 0)
    );

    this.answers$ = zip(game$, score$).pipe
    (scan<[[number, Choice, Input, number[]], number], Answer[]>((answer, [[numb, correct, user], points]) =>
      concat(answer, [{numb, correct, user, points}]), []));

    const fizzBuzzGame$ = zip<[number, Answer[]]>(score$, this.answers$).pipe(
      map(([score, answer]) => ({score, answer} as Results)
      )
    );

    this.game$ = fizzBuzzGame$.subscribe((results: Results) => {
      this.score$ = results.score;
      this.score$ === -1 ? this.reset() : null;
    });
  }

  reset(): void {
    alert('Game Over!');
    this.stopGame();
  }
  stopGame(): void{
    this.score$ = 0;
    this.numbersSub$.unsubscribe();
    this.game$.unsubscribe();
    this.numbers$ = null;
    this.answers$ = null;
  }

  isANumber(val: string): boolean {
    return isNumeric(val) === true;
  }
}
