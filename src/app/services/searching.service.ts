import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { tap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { environment } from 'src/environments/environment';

import { Users } from '../models/users.model';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class SearchingService {

  constructor(
    private http: HttpClient,
  ) { }

  get token():string {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  private transformUsers( results:any[] ):Users[] {
    return results.map( (user:any) => new Users(
        user.name, 
        user.email,
        '',
        user.img,
        user.google,
        user.role,
        user.uid
      )
    );
  }

  search(type: "users" | "hospitals" | "doctors", value: string) {
    const url = `${baseUrl}/all/collection/${type}/${value}`
    return this.http.get<any[]>(url,this.headers)
      .pipe(
        map( (resp:any) => {
          if(resp.ok) {
            switch(type) {
              case "users":
                const results = this.transformUsers(resp.results);
                return {
                  ...resp,
                  results
                };
              case "hospitals":
                return resp;
              case "doctors":
                  return resp;
            }
          }
          return resp;
        })
      );
  }
}
