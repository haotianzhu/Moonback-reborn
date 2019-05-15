import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../authentication/shared/auth.service';
import { filter, map, mapTo } from 'rxjs/operators';
import { Event as MyRouterEvent } from '@angular/router';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  constructor(
    private router: Router,
    private auth: AuthService,
    private location: Location) { }

  viewable = true;

  ngOnInit() {
    this.router.events.pipe(
      filter((e: MyRouterEvent) => e instanceof NavigationEnd),
      map(e => this.checkUrl(this.router.url.split('?')[0]))
    ).subscribe(isNotViewable => {
      this.viewable = !isNotViewable;
    });
  }

  checkUrl(path) {
    const urls = ['/signin', '/signup', '/signout'];
    return urls.some(oneUrl => {
      return (path === oneUrl);
    });
  }

  signUp() {
    this.router.navigate(['/signup']);
  }

  signIn() {
    this.router.navigate(['/signin']);
  }

  signOut() {
    this.router.navigate(['/signout']);
  }

  backTop() {
    window.scroll(0, 0);

  }


}
