import {Choice} from "./choice";
import {Input} from "./input";

export interface Answer {
  numb: number;
  correct: Choice;
  user: Input;
  points: number;
}
