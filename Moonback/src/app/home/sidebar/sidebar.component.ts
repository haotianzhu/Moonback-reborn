import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { AuthService } from '../../authentication/shared/auth.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  constructor(
    private router:Router,
    private auth: AuthService,){}

  ngOnInit() {
  }

  
  signUp(){
  	this.router.navigate(['/signup']);

  }

  signIn(){
  	this.router.navigate(['/signin']);

  }


}
