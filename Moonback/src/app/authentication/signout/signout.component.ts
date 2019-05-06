import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';
import { AuthService } from '../shared/auth.service';


@Component({
  selector: 'app-signout',
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.css']
})
export class SignoutComponent implements OnInit {

  constructor(private http: HttpClient, private auth: AuthService, private router: Router) { }

  ngOnInit() {
    if (!this.auth.isAuth()) {
      this.router.navigate(['/signin']);
      return;
    } else {
      this.http.delete<any>(
        `${environment.baseUrl + 'authentication/signout'}`,
        { observe: 'response' }
      ).subscribe((res) => {
        if (res.status === 200) {
          this.auth.clearAuth();
          this.router.navigate(['/signin']);
          return;
        }
        this.router.navigate(['/']);
        return;
      });
    }
  }



}
