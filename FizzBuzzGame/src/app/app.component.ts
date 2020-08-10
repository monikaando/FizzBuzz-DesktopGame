import {Component, OnInit} from '@angular/core';
import {FizzBuzzService} from '../services/fizzBuzz.service';
import {map, switchMap} from 'rxjs/operators';
import {isNumeric} from 'rxjs/internal-compatibility';
import {fromEvent, merge, Subject} from 'rxjs';

const getButton = (id) => {
  const button$ = fromEvent(document.getElementById(id), 'click')
    .pipe(
      map((event) => event.target['value'])
    )
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'FizzBuzzGame';
  game: string | number; // FizzBuzz Values
  user: any;
  numbers: number;
  clickVal: any; // clicked Values
  score = 0;
  public onStartClick = new Subject<boolean>();
  public onButtonClick = new Subject<string>();


  constructor(protected fizzBuzzService: FizzBuzzService) {
  }

  ngOnInit(): void {
    this.playGame();
  }

  playGame(): void {
    this.onStartClick.subscribe((response) => {
      this.fizzBuzzService.numbersStream$.subscribe((val =>
        this.numbers = val));

      this.fizzBuzzService.fizzBuzz()
        .pipe(
          switchMap(this.getButtons))
        .subscribe((response) => {
          this.user = response;
        });

      this.fizzBuzzService.fizzBuzz()

        .subscribe((res) => {
          this.game = res;
          (this.clickVal === 'Number' && isNumeric(this.game)) || (this.clickVal === this.game) ? this.score += 1 :                     // proper button clicked: +1 point
            ((this.clickVal && this.clickVal !== this.game) ||              // if you clicked, but wrong button or
              ((isNumeric(this.game) === false)     // there is a word in game (Fizz, Buzz, FizzBuzz)
                && (this.clickVal === '' || this.clickVal === undefined))) // and you didn't click anything when you supposed to
              ? this.score -= 1 :                                        // then:-1 point
              (this.game && !this.clickVal)                             // if the game is ON but you didn't click anything and there is a number
                ? this.score += 0 : null;                              // do nothing with 'score'
          this.score === -5 ? this.reset() : null;
          console.log('game: ', this.game);
          console.log('clickVal: ', this.clickVal);
          console.log('score: ', this.score);// if you reach -5 points = Game Over! and reset te game
        });
    });

    this.onButtonClick.subscribe((response) => {
      this.clickVal = response;
      // this.clear();
      // console.log('onButtonClick.subscribe', response);

    });
  }

  getButtons() {
    return merge([
      getButton('numberBtn'),
      getButton('fizzBtn'),
      getButton('buzzBtn'),
      getButton('fizzBuzzBtn')
    ])
  }


  // clear(): void {
  //   setTimeout(() => {
  //     this.clickVal = '';
  //   }, 3000);
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
