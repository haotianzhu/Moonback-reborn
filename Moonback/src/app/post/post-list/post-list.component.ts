import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  public postArray = new Array<any>();

  constructor(private http: HttpClient) { }

  ngOnInit() {
    // api/post/user/id
    console.log(environment.baseUrl)
    var secondHeaders = new HttpHeaders({
      'Authorization': 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imhhb3RpYW56aHVAcXEuY29tIiwiaWQiOiI1Y2M5MDE4ZTQ2YmY2NDIzOWZhZTg3MTIiLCJleHAiOjE1NTkyNjkwMjYsImlhdCI6MTU1NjY3NzAyNn0.uwtbg3ZanFRNe0Rk7zNVD5BJJ5vyvt2gCdzXgHel6TE'
    });

    this.http.get<any>(
      `${environment.baseUrl + 'posts/user/' + '5cc9018e46bf64239fae8712'}`,
      { headers: secondHeaders }
    ).subscribe( (res) => {
      if ( res.length > 0 ) {
        this.postArray = res.posts;
      }
    })
  }

}
