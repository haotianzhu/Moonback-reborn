import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  signinForm: FormGroup;
  isCorrect = true;
  constructor(private http: HttpClient, private auth: AuthService, private router: Router) { }

  ngOnInit() {
    if (this.auth.isAuth()) this.router.navigate(['/']);
    this.signinForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
      ]),
      password: new FormControl('', [Validators.required]),
    });
  }

  onSignIn() {
    if (this.signinForm.valid) {
      this.http.post<any>(
        `${environment.baseUrl + 'authentication/signin'}`,
        { user: this.signinForm.value },
        { observe: 'response' }
      ).subscribe(
        res => {
          if (res.status == 200) {
            this.auth.setAuth(res.body.user);
            if (this.auth.isAuth()) {
              this.router.navigate(['/']);
            }
          }
        },
        error => {
          this.isCorrect = false;
        }
        
      )

    }
  }

}
