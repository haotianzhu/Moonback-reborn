import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

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
  }

  getAuth() {
    if (this.isAuth()) {
      return {
        id: localStorage.getItem('authId'),
        username: localStorage.getItem('authUsername'),
      };
    }
    return null;
  }

  clearAuth() {
    localStorage.removeItem('authUsername');
    localStorage.removeItem('authId');
    localStorage.removeItem('token');
  }
}
