import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  username = '';
  password = '';

  constructor(private http: HttpClient, private auth: AuthService, private router: Router) { }

  ngOnInit() {
    if (this.auth.isAuth()) this.router.navigate(['/']);
  }

  onSignIn() {
    this.http.post<any>(
      `${environment.baseUrl + 'authentication/signin'}`,
      { user: { username: this.username, password: this.password } },
      { observe: 'response' }
    ).subscribe((res) => {
      if (res.status == 200) {
        this.auth.setAuth(res.body.user);
        if (this.auth.isAuth()) {
          this.router.navigate(['/']);
        }
      }
    })
  }

}
