import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Doctors } from 'src/app/models/doctors.model';
import { Hospitals } from 'src/app/models/hospitals.model';
import { Users } from 'src/app/models/users.model';
import { SearchingService } from 'src/app/services/searching.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styles: []
})
export class SearchComponent implements OnInit {
  public users: Users[] = [];
  public hospitals: Hospitals[] = [];
  public doctors: Doctors[] = [];

  constructor(
    private router: Router,
    private activateRoute: ActivatedRoute,
    private searchingService: SearchingService
  ) { }

  ngOnInit() {
    this.activateRoute.params
      .subscribe(({value}) => {
        this.search(value);
      })
  }

  search(value:string) {
    this.searchingService.searchAll(value)
          .subscribe((resp:any) => {
            console.log('resp==>', resp);
            this.users = resp.users;
            this.hospitals = resp.hospitals;
            this.doctors = resp.doctors;
          });
  }

  openDoctor(doctor: Doctors) {
    this.router.navigateByUrl(`/dashboard/doctors/${doctor._id}`);
  }

}
