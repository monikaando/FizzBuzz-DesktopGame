import {Component, OnInit} from '@angular/core';
import {FizzBuzzService} from "../services/fizzBuzz.service";
import {startWith} from "rxjs/operators";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'FizzBuzzGame';
  fbVal: number | string; //FizzBuzz Values
  clickVal: string; // clicked Values
  score = 0;

  constructor(protected fizzBuzzService: FizzBuzzService) {
  }

  ngOnInit(): void {
  }

  onStartClick(): void {
    this.game();
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

  game(): any {
    this.fizzBuzzService.fizzBuzz()
      .pipe(startWith("GO!"))
      .subscribe((response) => {
        this.fbVal = response
        if (this.clickVal == this.fbVal) {
          this.score += 1
        }
        else if (this.clickVal && this.clickVal !== this.fbVal) {
          this.score -= 1
        }
        else if (this.fbVal && !this.clickVal) {
          this.score +=0;
        }
        else if (this.score){
          this.score +=100;
        }


        console.log('clickVal: ', this.clickVal);
        console.log('fbVal: ', this.fbVal);
        console.log('score: ', this.score);
      });
  }
}

