import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { environment } from 'src/environments/environment';
import { AuthService } from '../shared/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router,
    private rd: Renderer2,
    private element: ElementRef) { }

  ngOnInit() {
    if (this.auth.isAuth()) { this.router.navigate(['/']); }
    this.signupForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  onSignUp() {
    if (this.signupForm.valid) {
      this.http.post<any>(
        `${environment.baseUrl + 'authentication/signup'}`,
        { user: this.signupForm.value },
        { observe: 'response' }
      ).subscribe(
        res => {
          if (res.status === 200) {
            this.router.navigate(['/signin']);
          }
        },
        error => {
          this.signupForm.controls.username.markAsPristine();
          this.signupForm.controls.password.markAsPristine();
        });
    } else {
      console.log('invalid signup form');
    }
  }
}
