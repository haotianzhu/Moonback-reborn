import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, map, tap, distinctUntilChanged } from 'rxjs/operators';
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
  loadingElement: Element;
  imgHeader = 'assets/img/main/1.jpg';
  constructor(
    private router: Router,
    private loading: LoadingService,
    private element: ElementRef,
    private rder: Renderer2
  ) { }

  ngOnInit() {
    this.router.events.pipe(
      filter((e: MyRouterEvent) => e instanceof NavigationEnd),
      tap(e => this.router.url.split('?')[0]),
      map(() => this.checkUrl(this.router.url.split('?')[0]))
    ).subscribe(isNotViewable => {
      this.viewable = !isNotViewable;
    });
    this.loadingElement = this.element.nativeElement.querySelector('#loading-span');
    this.loading.currentLoadingState.pipe(
      distinctUntilChanged()
    ).subscribe(state => {
      if (state) {
        const spinnerElement = this.rder.createElement('div') as Element;
        spinnerElement.setAttribute('role', 'status');
        spinnerElement.classList.add('spinner-border', 'nav-icon-spinner');
        while (this.loadingElement.firstChild) {
          this.loadingElement.removeChild(this.loadingElement.firstChild);
        }
        this.loadingElement.appendChild(spinnerElement);
      } else {
        const imgElement = this.rder.createElement('img') as Element;
        imgElement.setAttribute('src', 'assets/img/main/brand-icon.png');
        imgElement.setAttribute('alt', 'brand');
        imgElement.classList.add('nav-icon-image');
        while (this.loadingElement.firstChild) {
          this.loadingElement.removeChild(this.loadingElement.firstChild);
        }
        this.loadingElement.appendChild(imgElement);
      }
    });
  }

  checkUrl(path) {
    this.randomHeaderImg(path);
    const urls = ['/signin', '/signup', '/signout', '/account/settings', '/404', '/account/reset'];
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
