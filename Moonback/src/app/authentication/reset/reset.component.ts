import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../shared/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {
  verifyEamilForm: FormGroup;
  isVerficationEmailFail = false;
  isVerified = false;
  isSent = false;
  isActive: boolean;
  userInfo: any;

  constructor(
    private auth: AuthService,
    private http: HttpClient) { }

  ngOnInit() {
    this.userInfo = this.auth.getAuth();
    this.isActive = (this.userInfo.isActive === 'true');
    this.verifyEamilForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }
  onVerifyEmail() {
    if (this.verifyEamilForm.value.email === this.auth.getAuth().email) {
      this.isVerified = true;
    } else {
      this.isVerficationEmailFail = true;
    }
  }

  onResentEmail() {
    this.http.post<any>(
      `${environment.baseUrl + 'email/s'}`,
      { username: this.userInfo.username },
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
}
