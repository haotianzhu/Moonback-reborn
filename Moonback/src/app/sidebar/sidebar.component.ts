import { Component, OnInit, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { Event as MyRouterEvent } from '@angular/router';
import { ViewportScroller } from '@angular/common';


import { AuthService } from '../authentication/shared/auth.service';



@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller,
    public auth: AuthService) { }

  viewable = true;
  isbackTop = false;

  ngOnInit() {
    this.router.events.pipe(
      filter((e: MyRouterEvent) => e instanceof NavigationEnd),
      map(e => this.checkUrl(this.router.url.split('?')[0]))
    ).subscribe(isNotViewable => {
      this.viewable = !isNotViewable;
    });
  }

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    if (this.viewportScroller.getScrollPosition()[1] >= window.innerHeight) {
      this.isbackTop = true;
    }
    if (this.viewportScroller.getScrollPosition()[1] <= window.innerHeight) {
      this.isbackTop = false;
    }
  }

  checkUrl(path) {
    const urls = ['/signin', '/signup', '/signout', '/account/settings'];
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
