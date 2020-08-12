import {Component, ElementRef,OnInit, ViewChild} from '@angular/core';
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

export class AppComponent implements OnInit{

  title = 'FizzBuzzGame';
  game: string | number;
  user: any;
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
    })
  }

  playGame() {
    type Choice = 'Fizz' | 'Buzz' | 'FizzBuzz' | 'None'
    type Input = Choice | null

    const numberBtn = fromEvent(this.numberButton.nativeElement, 'click');
    const fizzBtn = fromEvent(this.fizzButton.nativeElement, 'click');
    const buzzBtn = fromEvent(this.buzzButton.nativeElement, 'buzzBtn');
    const fizzBuzzBtn = fromEvent(this.fizzBuzzButton.nativeElement, 'click');

    const ChoiceArray = (): Observable<Input> =>
      merge<Choice>(
        numberBtn.pipe(mapTo('Number')),
        fizzBtn.pipe(mapTo('Fizz')),
        buzzBtn.pipe(mapTo('Buzz')),
        fizzBuzzBtn.pipe(mapTo('FizzBuzz')),
        this.fizzBuzzService.numbers$.pipe(mapTo('Number')),
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
      correctAnswer === userAnswer ? score + 1 : score - 1, 0)
    )
    const answers$ = game$.pipe
    (scan<[number, Choice, Input], Answer[]>((answer, [numb, correct, user]) =>
      concat(answer, [{numb, correct, user}]), []))

    const fizzBuzzGame$ = zip<[number, Answer[]]>(score$, answers$).pipe
    (map(([score, answer]) => ({score, answer} as Results))
    )
    // this.onStartClick.subscribe((response) => {
    //   fizzBuzzGame$.subscribe((results: Results) => {
    //     this.fizzBuzzService.numbers$.subscribe((val =>
    //       this.numbers = val));
    //   })
    // })
  }
        //
        // this.fizzBuzzService.fizzBuzz$
        //   .subscribe((res) => {
        //     this.game = res;
        //     (this.user === 'Number' && isNumeric(this.game)) ||
        //     (this.user === this.game) ? this.score += 1 :
        //       ((this.user && this.user !== this.game) ||
        //         ((isNumeric(this.game) === false) && (this.user === '' ||
        //           this.user === undefined)))
        //         ? this.score -= 1 : (this.game && !this.user)
        //         ? this.score += 0 : null;
        //     this.score === -10 ? this.reset() : null;
        //     console.log('game: ', this.game);
        //     console.log('user: ', this.user);
        //     console.log('score: ', this.score);
        //   });
    //  });
    //
    // })
  // }

  // tap(val => console.log(val))

  // playGame(): void {
  //   this.onStartClick.subscribe((response) => {
  //     this.fizzBuzzService.numbers$.subscribe((val =>
  //       this.numbers = val));
  //
  //     this.fizzBuzzService.fizzBuzz$
  //       .subscribe((res) => {
  //         this.game = res;
  //         (this.user === 'Number' && isNumeric(this.game)) ||
  //         (this.user === this.game) ? this.score += 1 :
  //           ((this.user && this.user !== this.game) ||
  //             ((isNumeric(this.game) === false) && (this.user === '' ||
  //               this.user === undefined)))
  //             ? this.score -= 1 : (this.game && !this.user)
  //             ? this.score += 0 : null;
  //         this.score === -10 ? this.reset() : null;
  //         console.log('game: ', this.game);
  //         console.log('user: ', this.user);
  //         console.log('score: ', this.score);
  //       });
  //   });
  //
  // }


  reset(): void {
    alert('Game Over!');
    this.game = null;
    this.fizzBuzzService.restart();
  }
}


// TO DO:
// async? for measuring points (change an order) - different method in Rx JS, fromEvent
// make if ? : else in a  better way?
// write better rules
// fromEvent('click', [Your Element]).pipe(
//   map((event) => event.target.value)
// )
//interfaces+types
//3 input streams
