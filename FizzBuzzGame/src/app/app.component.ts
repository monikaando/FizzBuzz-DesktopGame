import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FizzBuzzService} from '../services/fizzBuzz.service';
import {map, switchMap, mapTo, first, share, delay, scan} from 'rxjs/operators';
import {isNumeric} from 'rxjs/internal-compatibility';
import {fromEvent, Observable, merge, Subject, zip} from 'rxjs';
import {concat} from 'ramda';

//ng if fizzBuzz$ | async as fizzBuzz w html

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'FizzBuzzGame';
  numbers: number;
  score = 0;

  public onStartClick = new Subject<boolean>();

  constructor(protected fizzBuzzService: FizzBuzzService) {
  }

  @ViewChild('numberButton', {static: true}) numberButton: ElementRef;
  @ViewChild('fizzButton', {static: true}) fizzButton: ElementRef;
  @ViewChild('buzzButton', {static: true}) buzzButton: ElementRef;
  @ViewChild('fizzBuzzButton', {static: true}) fizzBuzzButton: ElementRef;

  ngOnInit(): void {
    this.onStartClick.subscribe((response) => {
      this.fizzBuzzService.numbers$.subscribe((val =>
        this.numbers = val))
      this.playGame();
    })
  }

  playGame() {
    type Choice = 'Number' | 'Fizz' | 'Buzz' | 'FizzBuzz'
    type Input = Choice | null

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
        this.fizzBuzzService.numbers$.pipe(mapTo('')),
      ).pipe<Input>(
        first(null, null),
      );

    const game$ = zip<[number, Choice, Input]>(
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

    interface Answer {
      numb: number;
      correct: Choice;
      user: Input;
    }

    interface Results {
      score: number;
      answer: Answer[];
    }

    const score$ = game$.pipe
    (scan((score, [numb, correctAnswer, userAnswer]) =>
      userAnswer && ((isNumeric(correctAnswer) && userAnswer === "Number") ||
        (correctAnswer === userAnswer)) ? score + 1 : score - 1, 0)
    )

    const answers$ = game$.pipe
    (scan<[number, Choice, Input], Answer[]>((answer, [numb, correct, user]) =>
      concat(answer, [{numb, correct, user}]), []))

    const fizzBuzzGame$ = zip<[number, Answer[]]>(score$, answers$).pipe
    (map(([score, answer]) => ({score, answer} as Results))
    )

    fizzBuzzGame$.subscribe((results: Results) => {
      this.score = results.score;
      this.score === -5 ? this.reset() : null;
      console.log('results', results)
    })
  }

  reset(): void {
    alert('Game Over!');
    this.numbers = null;
    this.score = 0;
    this.fizzBuzzService.restart();
  }
}

