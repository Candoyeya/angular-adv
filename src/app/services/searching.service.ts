import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { tap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { environment } from 'src/environments/environment';

import { Users } from '../models/users.model';
import { Hospitals } from '../models/hospitals.model';
import { Doctors } from '../models/doctors.model';

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

  private transformHospitals( results:any[] ):Hospitals[] {
    return results.map( (hospital:any) => new Hospitals(
        hospital.name, 
        hospital._id,
        hospital.user,
        hospital.img,
      )
    );
  }

  private transformDoctors( results:any[] ):Doctors[] {
    return results.map( (hospital:any) => new Doctors(
        hospital.name, 
        hospital._id,
        hospital.hospital,
        hospital.user,
        hospital.img,
      )
    );
  }

  search(type: "users" | "hospitals" | "doctors", value: string) {
    const url = `${baseUrl}/all/collection/${type}/${value}`
    return this.http.get<any[]>(url,this.headers)
      .pipe(
        map( (resp:any) => {
          if(resp.ok) {
            let results = resp.results;
            switch(type) {
              case "users":
                results = this.transformUsers(resp.results);
                break;
              case "hospitals":
                results = this.transformHospitals(resp.results);
                break
              case "doctors":
                results = this.transformDoctors(resp.results);
                break;
            }

            return {
              ...resp,
              results
            };
          }
          return resp;
        })
      );
  }

  searchAll( value: string) {
    const url = `${baseUrl}/all/${value}`
    return this.http.get<any[]>(url,this.headers)
      .pipe(
        map( (resp:any) => {
          if(resp.ok) {
            const users = this.transformUsers(resp.users);
            const hospitals = this.transformHospitals(resp.hospitals);
            const doctors = this.transformDoctors(resp.doctors);

            return {
              ...resp,
              users,
              hospitals,
              doctors
            };
          }
          return resp;
        })
      );
  }
}
