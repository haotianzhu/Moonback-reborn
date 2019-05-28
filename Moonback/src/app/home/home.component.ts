import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map, tap } from 'rxjs/operators';
import { Event as MyRouterEvent } from '@angular/router';
import { LoadingService } from '../utils/loading.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isCollapsed = false;
  viewable = true;
  isLoading: boolean;
  imgHeader = 'assets/img/main/1.jpg';
  constructor(private router: Router, private loading: LoadingService) { }

  ngOnInit() {
    this.router.events.pipe(
      filter((e: MyRouterEvent) => e instanceof NavigationEnd),
      tap(e => this.router.url.split('?')[0]),
      map(() => this.checkUrl(this.router.url.split('?')[0]))
    ).subscribe(isNotViewable => {
      this.viewable = !isNotViewable;
    });
    this.loading.currentLoadingState.subscribe(state => {
      this.isLoading = state;
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
