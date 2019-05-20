import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map, tap } from 'rxjs/operators';
import { Event as MyRouterEvent } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isCollapsed = false;
  viewable = true;
  imgHeader = 'assets/img/main/4.jpg';
  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events.pipe(
      filter((e: MyRouterEvent) => e instanceof NavigationEnd),
      tap(e => this.router.url.split('?')[0]),
      map(() => this.checkUrl(this.router.url.split('?')[0]))
    ).subscribe(isNotViewable => {
      this.viewable = !isNotViewable;
    });
  }
  checkUrl(path) {
    this.randomHeaderImg(path);
    const urls = ['/signin', '/signup', '/signout', '/account/settings', '/404'];
    return urls.some(oneUrl => {
      return (path === oneUrl);
    });
  }
  randomHeaderImg(path) {
    if (path === '/') {
      this.imgHeader = `${'assets/img/main/' + Math.floor((Math.random() * 3) + 1) + '.jpg'}`;
    }
  }
}
