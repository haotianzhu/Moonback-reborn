import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  username = '';
  password = '';

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  onSignIn() {
    console.log(this.username, this.password)
    this.http.post<any>(
      `${environment.baseUrl + 'authentication/signin'}`,
      { user: { username: this.username, password: this.password } }
    ).subscribe((res) => {
      if (res.length > 0) {
        this.postArray = res.posts;
      }
    })
  }

}
