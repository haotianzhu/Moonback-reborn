import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

// import { RegistrareService } from './registrate.service';
// import { LoginService } from './login.service';
// import { TokenService } from './token.service';

@Component({
  selector: 'app-login',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})

export class AuthenticationComponent implements OnInit {
  loginInRequestData = {email: '', password: ''};
  signUpRequestData = {email: '', password: ''};
  private loginIsHidden = false ;
  private rememberMeOn = true;
  constructor(private router: Router, private location: Location) {}

  ngOnInit() {
    // const loggedIn = this.tokenserver.loggedIn();
    // const loggedIn = false;
    // if (loggedIn) {
    //   this.router.navigate(['/']);
    // } else {
    //   if (this.location.isCurrentPathEqualTo('/login')) {
    //     this.loginIsHidden = false ;
    //   } else if (this.location.isCurrentPathEqualTo('/signup')) {
    //     this.loginIsHidden = true ;
    //   } else {
    //     console.log('error login unknown url', this.router.url );
    //     this.loginIsHidden = false ;
    //   }
    // }
    // Cute is justice. Three cheers for the dancing girl.
    // const dancingGrilsGif = document.getElementById('girls');
    // dancingGrilsGif.style.position = 'fixed';
  }

  // logIn() {
  //   this.log.loginInRequest(this.loginInRequestData)
  //     .subscribe(
  //       // todo: return a json user, check user's active status
  //       // is actived, save it to cookie and redirected to router
  //       res => {
  //         if (res) {
  //           // if not 'remember me'
  //           if (this.rememberMeOn) {
  //             localStorage.setItem('refreshToken', res.data.refreshToken);
  //             localStorage.setItem('userId', this.loginInRequestData.email);
  //             sessionStorage.removeItem('refreshToken'); // in case
  //             sessionStorage.removeItem('userId');
  //           } else {
  //             sessionStorage.setItem('refreshToken', res.data.refreshToken);
  //             sessionStorage.setItem('userId', this.loginInRequestData.email);
  //             localStorage.removeItem('refreshToken'); // in case
  //             localStorage.removeItem('userId'); // in case
  //           }
  //           sessionStorage.setItem('accessToken', res.data.accessToken);
  //           this.router.navigate(['/']);
  //         }
  //       },
  //       error => console.log(error, 'logIn() error')
  //     );
  // }

  // signUp() {
  //   this.reg.signUpRequest(this.signUpRequestData)
  //     .subscribe(
  //       res => {
  //         this.loginIsHidden = false;
  //       },
  //       error => {
  //         console.log(error, 'signUp() error');
  //         this.loginIsHidden = true;
  //       }
  //     );
  // }

}
