import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { Router, Scroll, NavigationEnd, NavigationStart } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { tap, filter, debounceTime, scan } from 'rxjs/operators';
import { Event as MyRouterEvent } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
  title = 'Moonback';
  private scrollPosition: [number, number] = [0, 0];
  private scrollPositionSubscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller
  ) { }

  ngOnInit(): void {
    // https://github.com/angular/angular/issues/24547
    this.scrollPositionSubscription = this.router.events.pipe(
      filter((e: MyRouterEvent) => e instanceof Scroll),
      tap((e: MyRouterEvent) => {
        this.scrollPosition = (e as unknown as Scroll).position ? (e as unknown as Scroll).position : [0, 0];
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.scrollPositionSubscription.unsubscribe();
  }

  getScrollPosition() {
    return this.scrollPosition;
  }

  restoreScrollPosition() {
    this.viewportScroller.scrollToPosition(this.scrollPosition);
  }
}
