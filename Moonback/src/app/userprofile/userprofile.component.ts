import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { AuthService } from '../authentication/shared/auth.service';

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

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private router: Router) { }

  ngOnInit() {
    if (!this.auth.isAuth()) { this.router.navigate(['/signin']); }
    this.userInfo = this.auth.getAuth();

    if (!this.isVerified) {
      this.verifyPasswordForm = new FormGroup({
        username: new FormControl({ value: this.userInfo.username, disabled: true }, [Validators.required]),
        password: new FormControl('', [Validators.required]),
      });
    } else {
      this.changePasswordForm = new FormGroup({
        password: new FormControl('', [Validators.required]),
        confirmpassword: new FormControl('', [Validators.required])
      });
    }
  }

}
