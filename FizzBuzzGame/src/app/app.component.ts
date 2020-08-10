import {Component, OnInit} from '@angular/core';
import {FizzBuzzService} from "../services/fizzBuzz.service";
import {startWith} from "rxjs/operators";
import {isNumeric} from "rxjs/internal-compatibility";
import {Observable, Subject} from "rxjs";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'FizzBuzzGame';
  game: string; //FizzBuzz Values
  numbers: number;
  clickVal: string; // clicked Values
  score = 0;
  public onStartClick = new Subject<boolean>();
  public onButtonClick = new Subject<string>();


  constructor(protected fizzBuzzService: FizzBuzzService) {

  }

  ngOnInit(): void {
    this.playGame();
  }

  // onStartClick(): void {
  //   this.playGame();
  // }

  //playGame() {
    // this.fizzBuzzService.fizzBuzz()
    //   .pipe(
    //     startWith("GO!"))
    //   .subscribe((response) => {
    //     this.game = response
    //     this.clickVal == this.game ? this.score += 1 :                     // proper button clicked: +1 point
    //       ((this.clickVal && this.clickVal !== this.game) ||              // if you clicked, but wrong button or
    //         ((isNumeric(this.game) === false && this.game !== "GO!")     // there is a word in game (Fizz, Buzz, FizzBuzz, GO!)
    //           && (this.clickVal == '' || this.clickVal === undefined))) // and you didn't click anything when you supposed to
    //         ? this.score -= 1 :                                        // then:-1 point
    //         (this.game && !this.clickVal)                             // if the game is ON but you didn't click anything and there is a number
    //           ? this.score += 0 : null;                              // do nothing with 'score'
    //
    //     this.score === -2 ? this.reset() : null;                    // if you reach -5 points = Game Over! and reset te game
    //
    //     // console.log('clickVal: ', this.clickVal);
    //     // console.log('game: ', this.game);
    //     // console.log('score: ', this.score);
    //   });
  //}
    playGame() {
      this.onStartClick.subscribe((response)=>{
        this.fizzBuzzService.numbersStream$.subscribe((val =>
          this.numbers = val))
        this.fizzBuzzService.fizzBuzz()
          .pipe(
            startWith("GO!"))
          .subscribe((response) => {
            this.game = response
            this.clickVal == this.game ? this.score += 1 :                     // proper button clicked: +1 point
              ((this.clickVal && this.clickVal !== this.game) ||              // if you clicked, but wrong button or
                ((isNumeric(this.game) === false && this.game !== "GO!")     // there is a word in game (Fizz, Buzz, FizzBuzz, GO!)
                  && (this.clickVal == '' || this.clickVal === undefined))) // and you didn't click anything when you supposed to
                ? this.score -= 1 :                                        // then:-1 point
                (this.game && !this.clickVal)                             // if the game is ON but you didn't click anything and there is a number
                  ? this.score += 0 : null;                              // do nothing with 'score'

            this.score === -2 ? this.reset() : null;                    // if you reach -5 points = Game Over! and reset te game
            //
            // console.log('game: ', this.game);
            // console.log('clickVal: ', this.clickVal);
            // console.log('score: ', this.score);
          })


        console.log('onStartClick.subscribe',response)
      })

    this.onButtonClick.subscribe((response)=>{
      this.clickVal = response;
      this.clear();
      console.log('onButtonClick.subscribe',response)
    })
  }

  clear(): void {
    setTimeout(() => {
      this.clickVal = '';
    }, 1000);
  }

  reset() {
    alert('Game Over!');
    this.game = null;
    this.fizzBuzzService.restart();
  }
}


// TO DO:
// async? for measuring points (change an order) - different method in Rx JS, fromEvent
// make if ? : else in a  better way?
//write better rules
// fromEvent('click', [Your Element]).pipe(
//   map((event) => event.target.value)
// )
