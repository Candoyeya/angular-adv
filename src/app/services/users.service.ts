import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';

const baseUrl = environment.baseUrl;
declare const gapi:any;

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  public auth2:any;
  constructor(
    private router:Router,
    private http: HttpClient,
    private ngZone: NgZone
  ) {
    this.googleInit();
  }

  createUser(formData: RegisterForm) {
    console.log('Creating User===>');
    return this.http.post(
      `${baseUrl}/users`,
      formData
    ).pipe(
      tap((resp:any) => {
        console.log('Tap Resp===>', resp);
        if(resp.ok) {
          localStorage.setItem('token', resp.token);
        }
      })
    );
  }

  login(formData: LoginForm) {
    console.log('Login User===>');
    return this.http.post(
      `${baseUrl}/login`,
      formData
    ).pipe(
      tap((resp:any) => {
        console.log('Tap Resp===>', resp);
        if(resp.ok) {
          localStorage.setItem('token', resp.token);
        }
      })
    );
  }

  loginGoogle(token) {
    console.log('Login User===>');
    return this.http.post(
      `${baseUrl}/login/google`,
      {token}
    ).pipe(
      tap((resp:any) => {
        console.log('Tap Resp===>', resp);
        if(resp.ok) {
          localStorage.setItem('token', resp.token);
        }
      })
    );
  }

  async googleInit() {
    return new Promise(resolve => {
      gapi.load('auth2', () => {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        this.auth2 = gapi.auth2.init({
          client_id: '647268818251-711k4l7k6o9jts8j4e6aafsp1csphq8o.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });

        resolve();
      });
    });
  }

  validateToken():Observable<boolean> {
    const token = localStorage.getItem('token') || '';
    return this.http.get(
      `${baseUrl}/login/renew`, {
        headers: {
          'x-token': token
        }
      }
    ).pipe(
      tap((resp:any) => {
        console.log('Tap Resp===>', resp);
        if(resp.ok) {
          localStorage.setItem('token', resp.token);
        }
      }),
      map( resp => true),
      catchError(error => of(false))
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.auth2.signOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      })
      console.log('User signed out.');
    });
  }
}
