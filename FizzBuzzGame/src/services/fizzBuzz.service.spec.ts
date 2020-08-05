import { TestBed } from '@angular/core/testing';
import {FizzbuzzService} from "./fizzBuzz.service";


describe('FizzBuzzService', () => {
  let service: FizzbuzzService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FizzbuzzService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
