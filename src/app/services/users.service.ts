import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { tap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { environment } from 'src/environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { Users } from '../models/users.model';

const baseUrl = environment.baseUrl;
declare const gapi:any;

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  public auth2:any;
  public user:Users;
  constructor(
    private router:Router,
    private http: HttpClient,
    private ngZone: NgZone
  ) {
    this.googleInit();
  }

  get token():string {
    return localStorage.getItem('token') || '';
  }

  get uid():string {
    return this.user.uid || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  createUser(formData: RegisterForm) {
    return this.http.post(
      `${baseUrl}/users`,
      formData
    ).pipe(
      tap((resp:any) => {
        if(resp.ok) {
          localStorage.setItem('token', resp.token);
        }
      })
    );
  }

  updateUser(data: {name:string, email:string, role:string}) {
    data = {
      ...data,
      role: this.user.role
    };
    return this.http.put(`${baseUrl}/users/${this.uid}`, data, this.headers);
  }

  changeRole(user: Users) {
    return this.http.put(`${baseUrl}/users/${user.uid}`, user, this.headers);
  }

  login(formData: LoginForm) {
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
    return this.http.post(
      `${baseUrl}/login/google`,
      {token}
    ).pipe(
      tap((resp:any) => {
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
    return this.http.get(
      `${baseUrl}/login/renew`, {
        headers: {
          'x-token': this.token
        }
      }
    ).pipe(
      map((resp:any) => {
        if(resp.ok) {
          const { email, google, name, role, img = '', uid} = resp.user;
          this.user = new Users(name, email, '', img, google, role, uid);
          localStorage.setItem('token', resp.token);
        }
        return true;
      }),
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

  loadUsers(from: number = 0) {
    const url = `${baseUrl}/users?from=${from}`
    return this.http.get(url,this.headers)
      .pipe(
        map( (resp:any) => {
          if(resp.ok) {
            const users = resp.users.map( user => new Users(
              user.name, 
              user.email,
              '',
              user.img,
              user.google,
              user.role,
              user.uid
            ));

            return {
              ...resp,
              users
            };
          }
          return resp;
        })
      );
  }

  deleteUser(uid:string) {
    console.log('delete===>', uid);
    const url = `${baseUrl}/users/${uid}`
    return this.http.delete(url,this.headers);
  }
}
