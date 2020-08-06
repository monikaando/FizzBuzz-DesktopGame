import {Component, OnInit} from '@angular/core';
import {FizzBuzzService} from "../services/fizzBuzz.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'FizzBuzzGame';
  gameArray: number | string;

  constructor(protected fizzBuzzService: FizzBuzzService) {
  }

  ngOnInit(): void {

  }

  onStartClick(): any {
    this.game();
  }

  game(): any {
    this.fizzBuzzService.fizzBuzz().subscribe((response) => {
      this.gameArray = response;
      console.log(this.gameArray)
    });
  }
}

