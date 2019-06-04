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
  isVerficationFail = false;
  isVerified = false;
  isSent = false;
  isActive: boolean;
  userInfo: any;
  userId: any;
  verifyPasswordForm: any;
  changePasswordForm: any;
  isCodeVerficationFail = false;
  isCodeVerified = false;


  constructor(
    public auth: AuthService,
    private http: HttpClient,
    private router: Router) { }

  ngOnInit() {
    if (this.auth.isAuth()) {
      this.userInfo = this.auth.getAuth();
      this.isActive = (this.userInfo.isActive === 'true');
      this.verifyForm = new FormGroup({
        username: new FormControl(this.userInfo.username, [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email])
      });
    } else {
      this.verifyForm = new FormGroup({
        username: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email])
      });
    }
  }
  onResentEmail() {
    this.http.post<any>(
      `${environment.baseUrl + 'email/s'}`,
      { user: this.verifyForm },
      { observe: 'response' }
    ).subscribe(
      res => {
        if (res.status === 200) {
          this.isSent = true;
        } else {
        }
      }, error => {
        console.log(error);
      });
  }
  
  onVerifyEmail() {
    if (this.verifyForm.valid) {
      this.http.post<any>(
        `${environment.baseUrl + 'email/s'}`,
        {
          username: this.verifyForm.value.username,
          email: this.verifyForm.value.email,
          message: "Here is your verifaction code for reset your password: "
        },
        { observe: 'response' }
      ).subscribe(
        res => {
          if (res.status === 200) {
            this.isVerified = true;
            this.userId = res.body.id;
            this.verifyPasswordForm = new FormGroup({
              code: new FormControl('', [Validators.required]),
            });
          } else {
            this.isVerficationFail = true;
          }
        }, error => {
          console.log(error);
        });
    } else {
      console.log("invalide form")
    }
  }
  onVerify() {
    if (this.verifyPasswordForm.valid) {
      this.http.post<any>(
        `${environment.baseUrl + 'email/v'}`,
        {
          value: this.verifyPasswordForm.value.code,
          id: this.userId
        },
        // { observe: 'response' }
      ).subscribe(
        res => {
          if (res.status === "success") {
            this.isCodeVerified = true;
            this.changePasswordForm = new FormGroup({
              password: new FormControl('', [Validators.required]),
              confirmpassword: new FormControl('', [Validators.required])
            });
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
        `${environment.baseUrl + 'user/' + this.userInfo.id}`,
        { password: this.changePasswordForm.value.password},
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
