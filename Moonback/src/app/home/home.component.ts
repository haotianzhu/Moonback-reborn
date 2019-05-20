import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Event as MyRouterEvent } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isCollapsed = false;
  viewable = true;
  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events.pipe(
      filter((e: MyRouterEvent) => e instanceof NavigationEnd),
      map(e => this.checkUrl(this.router.url.split('?')[0]))
    ).subscribe(isNotViewable => {
      this.viewable = !isNotViewable;
    });
  }
  checkUrl(path) {
    const urls = ['/signin', '/signup', '/signout', '/account/settings', '/404'];
    return urls.some(oneUrl => {
      return (path === oneUrl);
    });
  }
}
