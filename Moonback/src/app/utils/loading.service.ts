import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSource = new BehaviorSubject(false);
  currentLoadingState = this.loadingSource.asObservable();

  constructor() {}

  setLoadingTrue() {
    this.loadingSource.next(true);
  }
  setLoadingFalse() {
    this.loadingSource.next(false);
  }
}
