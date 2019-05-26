import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { AuthService } from '../shared/auth.service';


let remember = 0;
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  signinForm: FormGroup;
  isCorrect = true;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router,
    private rd: Renderer2,
    private element: ElementRef) { }

  ngOnInit() {
    if (this.auth.isAuth() || this.auth.isAuth2()) { this.router.navigate(['/']); }
    this.signinForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }


  rememberCheck(checked: boolean) {
    if (checked) {
      remember = 1;
    }
  }

  onSignIn() {
    if (this.signinForm.valid) {
      this.http.post<any>(
        `${environment.baseUrl + 'authentication/signin'}`,
        { user: this.signinForm.value },
        { observe: 'response' }
      ).subscribe(
        res => {
          if (res.status === 200) {
            if (remember === 1) {
              this.auth.setAuth(res.body.user);
              if (this.auth.isAuth()) {
                this.router.navigate(['/']);
              }
            }
            if (remember === 0) {
              this.auth.setAuth2(res.body.user);
              if (this.auth.isAuth2()) {
                this.router.navigate(['/']);
              }
            }
          }
        },
        error => {
          this.isCorrect = false;
          this.signinForm.controls.username.markAsPristine();
          this.signinForm.controls.password.markAsPristine();
        }
      );
    } else {
      if (this.signinForm.controls.password.errors) {
        if (this.signinForm.controls.password.errors.required) {
          this.signinForm.controls.password.markAsTouched();
        }
      }
      if (this.signinForm.controls.username.errors) {
        if (this.signinForm.controls.username.errors.required) {
          this.signinForm.controls.username.markAsTouched();
        }
      }
    }
  }
}
