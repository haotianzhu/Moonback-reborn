import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  username = 'you are not signin';
  constructor() {
    if (this.isAuth() || this.isAuth2()) {
      this.username = this.getAuth().username;
    }
  }

  getToken() {
    const token = localStorage.getItem('token');
    if (token && token !== undefined) {
      return token;
    }
    return '';
  }

  setToken(token) {
    if (token && token !== undefined) {
      localStorage.setItem('token', token);
    }
  }


  setToken2(token) {
    if (token && token !== undefined) {
      sessionStorage.setItem('token', token);
    }
  }


  isAuth() {
    const token = localStorage.getItem('token');
    if (token && token !== undefined) {
      return true;
    } else {
      return false;
    }
  }

  isAuth2() {
    const token = sessionStorage.getItem('token');
    if (token && token !== undefined) {
      return true;
    } else {
      return false;
    }
  }


  setAuth(user) {
    this.setToken(user.token);
    localStorage.setItem('authUsername', user.username);
    localStorage.setItem('authId', user.id);
    this.username = user.username;
  }
  setAuth2(user) {
    this.setToken2(user.token);
    sessionStorage.setItem('authUsername', user.username);
    sessionStorage.setItem('authId', user.id);
    this.username = user.username;
  }

  getAuth() {
    if (this.isAuth()) {
      return {
        id: localStorage.getItem('authId'),
        username: localStorage.getItem('authUsername'),
      };
    } else if (this.isAuth2()) {
      return {
        id: sessionStorage.getItem('authId'),
        username: sessionStorage.getItem('authUsername'),
      };
    }

    return null;
  }

  clearAuth() {
    localStorage.removeItem('authUsername');
    localStorage.removeItem('authId');
    localStorage.removeItem('token');
    this.username = 'you are not signin';
  }
}
