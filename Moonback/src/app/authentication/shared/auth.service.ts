import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  username = 'you are not signin';
  constructor() {
    if (this.isAuth()) {
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

  isAuth() {
    const token = localStorage.getItem('token');
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
    localStorage.setItem('authEmail', user.email);
    localStorage.setItem('authActive', user.isActivated);
    this.username = user.username;
  }

  getAuth() {
    if (this.isAuth()) {
      return {
        id: localStorage.getItem('authId'),
        username: localStorage.getItem('authUsername'),
        email: localStorage.getItem('authEmail'),
        isActive: localStorage.getItem('authActive'),
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
