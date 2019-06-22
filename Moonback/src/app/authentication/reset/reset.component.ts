import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {
  verifyForm: FormGroup;
  verifyCodeForm: FormGroup;
  changePasswordForm: FormGroup;
  isVerficationFail = false;
  isVerified = false;
  isSent = false;
  isCodeVerficationFail = false;
  isCodeVerified = false;
  isActive: boolean;
  userInfo: any;
  userId: any;
  token: any;

  constructor(
    public auth: AuthService,
    private http: HttpClient,
    private router: Router) { }

  ngOnInit() {
    if (this.auth.isAuth()) {
      this.userInfo = this.auth.getAuth();
      this.isActive = (this.userInfo.isActive === 'true');
      this.userId = this.userInfo.id;
    }else {
      this.isActive = false;
    }

    this.verifyCodeForm = new FormGroup({
      code: new FormControl('', [Validators.required]),
    });
    this.changePasswordForm = new FormGroup({
      password: new FormControl('', [Validators.required]),
      confirmpassword: new FormControl('', [Validators.required])
    });
    this.verifyForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  onSentEmail() {
    if (this.verifyForm.valid) {
      console.log(this.userInfo);
      this.http.post<any>(
        `${environment.baseUrl + 'email/s'}`,
        {
          email: this.verifyForm.value.email,
          username: this.verifyForm.value.username,
          message: 'Here is your verifaction code for email verifacation: '
        },
        { observe: 'response' }
      ).subscribe(
        res => {
          if (res.status === 200) {
            this.isSent = true;
            this.userId = res.body.id;
          } else {
          }
        }, error => {
          console.log(error);
        });
    }
  }
  onCodeVerify() {
    if (this.verifyCodeForm.valid) {
      this.http.post<any>(
        `${environment.baseUrl + 'email/v'}`,
        {
          value: this.verifyCodeForm.value.code,
          id: this.userId
        },
      ).subscribe(
        res => {
          if (res.status === 'success') {
            this.isCodeVerified = true;
            this.auth.setToken(res.user.token);
          }
        },
        error => {
          this.isCodeVerficationFail = true;
        }
      );
    }
  }

  onPatch() {
    if (this.changePasswordForm.valid) {
      this.http.patch<any>(
        `${environment.baseUrl + 'user/' + this.userId}`,
        { user: { password: this.changePasswordForm.value.password } },
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
