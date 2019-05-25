import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/authentication/shared/auth.service';


@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrls: ['./userprofile.component.css']
})
export class UserprofileComponent implements OnInit {
  verifyPasswordForm: FormGroup;
  changePasswordForm: FormGroup;
  userInfo: any;
  isVerified = false;
  isVerficationFail = false;
  postArray = [];

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router) { }

  ngOnInit() {

    if (!this.auth.isAuth()) { this.router.navigate(['/signin']); }
    this.userInfo = this.auth.getAuth();
    if (!this.isVerified) {
      this.verifyPasswordForm = new FormGroup({
        username: new FormControl(this.userInfo.username, [Validators.required]),
        password: new FormControl('', [Validators.required]),
      });
    }
  }

  onVerify() {
    if (this.verifyPasswordForm.valid) {
      this.http.post<any>(
        `${environment.baseUrl + 'authentication/signin'}`,
        { user: this.verifyPasswordForm.value },
        { observe: 'response' }
      ).subscribe(
        res => {
          if (res.status === 200) {
            this.auth.setAuth(res.body.user);
            this.isVerified = true;
            this.changePasswordForm = new FormGroup({
              password: new FormControl('', [Validators.required]),
              confirmpassword: new FormControl('', [Validators.required])
            });
          }
        },
        error => {
          this.isVerficationFail = true;
          this.verifyPasswordForm.controls.username.markAsPristine();
          this.verifyPasswordForm.controls.password.markAsPristine();
        }
      );
    }
  }

  onPatch() {
    if (this.changePasswordForm.valid) {
      this.userInfo.password = this.changePasswordForm.value.password;
      this.http.patch<any>(
        `${environment.baseUrl + 'user/' + this.userInfo.id}`,
        { user: this.userInfo },
        { observe: 'response' }
      ).subscribe(
        res => {
          if (res.status === 200) {
            this.router.navigate(['/signout']);
          }
        },
        error => {
          this.changePasswordForm.controls.username.markAsPristine();
          this.changePasswordForm.controls.confirmpassword.markAsPristine();
        }
      );
    }
  }
}

