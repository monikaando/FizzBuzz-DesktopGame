import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FizzBuzzService} from '../services/fizzBuzz.service';
import {map, switchMap, mapTo, first, share, delay, scan} from 'rxjs/operators';
import {isNumeric} from 'rxjs/internal-compatibility';
import {fromEvent, Observable, merge, Subject, zip} from 'rxjs';
import {concat} from 'ramda';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'FizzBuzzGame';
  score = 0;
  numbers: number;
  answers: any[];

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

    interface Answer {
      numb: number;
      correct: Choice;
      user: Input;
      points: number;
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

    const answers$ = zip(game$, score$).pipe
    (scan<[[number, Choice, Input, number[]], number], Answer[]>((answer, [[numb, correct, user], points]) =>
      concat(answer, [{numb, correct, user, points}]), []))

    const fizzBuzzGame$ = zip<[number, Answer[]]>(score$, answers$).pipe(
      map(([score, answer]) => ({score, answer} as Results)
      )
    )

    fizzBuzzGame$.subscribe((results: Results) => {
      this.score = results.score;
      this.answers = results.answer;
      console.log('results', results)
      this.score === -1 ? this.reset() : null;
    })
  }

  reset(): void {
    alert('Game Over!');
    this.fizzBuzzService.restart();
  }

  isANumber(val: string): boolean {
    return isNumeric(val) === true;
  }
}

//refactor html using observables
//check with tslint
//click on start button without subject
// make a table
