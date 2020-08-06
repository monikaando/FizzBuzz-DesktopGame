import {Component, OnInit} from '@angular/core';
import {FizzBuzzService} from "../services/fizzBuzz.service";
import {startWith} from "rxjs/operators";
import {isNumeric} from "rxjs/internal-compatibility";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'FizzBuzzGame';
  game: string; //FizzBuzz Values
  clickVal: string; // clicked Values
  score = 0;

  constructor(protected fizzBuzzService: FizzBuzzService) {
  }

  ngOnInit(): void {
  }

  onStartClick(): void {
    this.playGame();
  }

  onFizzClick(): void {
    this.clickVal = 'Fizz';
    this.clear();
  }

  onBuzzClick(): void {
    this.clickVal = 'Buzz';
    this.clear();
  }

  onFizzBuzzClick(): void {
    this.clickVal = 'FizzBuzz';
    this.clear();
  }

  clear(): void {
    setTimeout(() => {
      this.clickVal = '';
    }, 2990);
  }

  playGame(): any {
    this.fizzBuzzService.fizzBuzz()
      .pipe(startWith("GO!"))
      .subscribe((response) => {
        this.game = response
        this.clickVal == this.game ? this.score += 1 :                     // proper button clicked: +1 point
          ((this.clickVal && this.clickVal !== this.game) ||              // if you clicked, but wrong button or
            ((isNumeric(this.game) === false && this.game !== "GO!")     // there is a word in game (Fizz, Buzz, FizzBuzz, GO!)
              && (this.clickVal == '' || this.clickVal === undefined))) // and you didn't click anything when you supposed to
            ? this.score -= 1 :                                        // then:-1 point
            (this.game && !this.clickVal)                             // if the game is on but you didn't click anything (condition for numbers)
              ? this.score += 0 : null;                              // do nothing with 'score'

        this.score === -1 ? this.reset() : null;                    // if you reach -5 points = Game Over! and reset te game
        console.log('clickVal: ', this.clickVal);
        console.log('game: ', this.game);
        console.log('score: ', this.score);
        console.log('number?:', isNumeric(this.game))
      });
  }

  reset() {
    alert('Game Over!');
    this.game = null;
    this.clickVal = null;
    this.score = 0;
    this.playGame().unsubscribe();
  }
}


// TO DO:
// make start button visible after reset
// async? for measuring points (change an order)
// better alert
// click in Rx JS?
