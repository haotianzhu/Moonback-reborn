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
  verifyForm: FormGroup;
  isVerficationFail = false;
  isVerified = false;
  isSent = false;
  isActive: boolean;
  userInfo: any;

  constructor(
    private auth: AuthService,
    private http: HttpClient) { }

  ngOnInit() {
    if(this.auth.isAuth()){
      this.userInfo = this.auth.getAuth();
      this.isActive = (this.userInfo.isActive === 'true');
      this.verifyForm = new FormGroup({
      username: new FormControl(this.userInfo.username, [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email])
    });
    }else {
      this.verifyForm = new FormGroup({
        username: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email])
      });
    }
  }
  onVerifyEmail() {
    if (this.verifyForm.value.email === this.auth.getAuth().email) {
      this.isVerified = true;
    } else {
      this.isVerficationFail = true;
    }
  }
s
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
  onResetPassword(){
    if(this.auth.isAuth()){

    }
    else{

    }
  }
}
