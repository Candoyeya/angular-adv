import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Doctors } from '../models/doctors.model';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class DoctorsService {

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

  getDoctors() {
    const url = `${baseUrl}/doctors`
    return this.http.get(url,this.headers)
      .pipe(
        map( (resp:any) => {
          if(resp.ok) {
            const doctors = resp.doctors.map( doctor => new Doctors(
              doctor.name,
              doctor._id,
              doctor.hospital,
              doctor.user,
              doctor.img
            ));

            return {
              ...resp,
              doctors
            };
          }
          return resp;
        })
      );
  }

  getDoctorById(id:string) {
    const url = `${baseUrl}/doctors/${id}`
    return this.http.get(url,this.headers)
      .pipe(
        map( (resp:any) => {
          if(resp.ok) {
            const doctor = new Doctors(
              resp.doctor.name,
              resp.doctor._id,
              resp.doctor.hospital,
              resp.doctor.user,
              resp.doctor.img
            )

            return {
              ...resp,
              doctor
            };
          }
          return resp;
        })
      );
  }

  createDoctor(data: {name: string, hospital:string}) {
    return this.http.post(`${baseUrl}/doctors`, data, this.headers);
  }

  updateDoctor(data: {name: string, hospital:string}, id: string) {
    return this.http.put(`${baseUrl}/doctors/${id}`, data, this.headers);
  }

  deleteDoctor(id:string) {
    const url = `${baseUrl}/doctors/${id}`
    return this.http.delete(url,this.headers);
  }
}
