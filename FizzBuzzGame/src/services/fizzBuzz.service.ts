import {Injectable} from '@angular/core';
import {zip, interval, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FizzBuzzService {
  counter$: Observable<number> = interval(1000).pipe
  (map(n => n += 1));

  fizz$: Observable<string> = this.counter$.pipe
  (map(n => n % 3 === 0 ? 'Fizz' : null));

  buzz$: Observable<string> = this.counter$.pipe
  (map(n => n % 5 === 0 ? 'Buzz' : null));

  fizzBuzz(): Observable<number | string> {
    return zip(this.counter$, this.fizz$, this.buzz$)
      .pipe(
        map(
          ([counter$, fizz$, buzz$]) =>
            ([fizz$ == null && buzz$ == null ? counter$ : null,
              fizz$,
              buzz$])
              .filter((v) => v !== null).join('')
        )
      )
  }
}


// getBreweries(): Observable<BreweryDetails> {
//   return this.http.get(`api/breweries?withLocations=Y&${environment.KEY}`)
//     .pipe(map((response: ApiResponse) => response.data as BreweryDetails));
// }

// const counter$: Observable<number> = interval(1000).pipe
// (map(n => n += 1));
//
// const fizz$: Observable<string> = counter$.pipe
// (map(n => n % 3 === 0 ? 'Fizz' : null));
//
// const buzz$: Observable<string> = counter$.pipe
// (map(n => n % 5 === 0 ? 'Buzz' : null));
//
// const fizzBuzz$ = zip(counter$, fizz$, buzz$)
//   .pipe(
//     map(
//       ([counter$, fizz$, buzz$]) =>
//         ([fizz$ == null && buzz$ == null ? counter$ : null,
//           fizz$,
//           buzz$])
//           .filter((v) => v !== null).join('')
//     )
//   )
// fizzBuzz$.subscribe(v => {
//   console.log(v);
// });
