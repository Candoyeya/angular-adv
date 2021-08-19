import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Hospitals } from '../models/hospitals.model';


const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class HospitalsService {

  constructor(
    private router:Router,
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

  getHospitals() {
    const url = `${baseUrl}/hospitals`
    return this.http.get(url,this.headers)
      .pipe(
        map( (resp:any) => {
          if(resp.ok) {
            const hospitals = resp.hospitals.map( hospital => new Hospitals(
              hospital.name,
              hospital._id,
              hospital.user,
              hospital.img
            ));

            return {
              ...resp,
              hospitals
            };
          }
          return resp;
        })
      );
  }

  createHospital(name: string) {
    return this.http.post(`${baseUrl}/hospitals`, {name}, this.headers);
  }

  updateHospital(name: string, id:string) {
    return this.http.put(`${baseUrl}/hospitals/${id}`, {name}, this.headers);
  }

  deleteHospital(id:string) {
    const url = `${baseUrl}/hospitals/${id}`
    return this.http.delete(url,this.headers);
  }
}
