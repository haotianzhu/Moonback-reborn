import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  getToken() {
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imhhb3RpYW56aHVAcXEuY29tIiwiaWQiOiI1Y2M5MDE4ZTQ2YmY2NDIzOWZhZTg3MTIiLCJleHAiOjE1NTkyNjkwMjYsImlhdCI6MTU1NjY3NzAyNn0.uwtbg3ZanFRNe0Rk7zNVD5BJJ5vyvt2gCdzXgHel6TE';
  }
}
