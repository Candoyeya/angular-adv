import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Doctors } from 'src/app/models/doctors.model';
import { DoctorsService } from 'src/app/services/doctors.service';
import { ModalImageService } from 'src/app/services/modal-image.service';
import { SearchingService } from 'src/app/services/searching.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styles: []
})
export class DoctorsComponent implements OnInit, OnDestroy {
  public totalDoctors: number = 0;
  public doctors: Doctors[];
  public loading: boolean = true;

  public imgSubs: Subscription;

  constructor(
    private doctorsService: DoctorsService,
    private searchingService: SearchingService,
    private modalImageService: ModalImageService,
    private router:Router
  ) { }

  ngOnInit() {
    this.loadDoctors();
    this.imgSubs = this.modalImageService.newImage
      .pipe(delay(100)).subscribe(img => this.loadDoctors());
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  openModal(doctor: Doctors) {
    this.modalImageService.openModal("doctors", doctor._id, doctor.img);
  }

  loadDoctors() {
    this.loading = true;
    this.doctorsService.getDoctors()
      .subscribe((resp) => {
        if(resp.ok) {
          this.doctors = resp.doctors;
          this.totalDoctors = resp.doctors.length;
        }
        this.loading = false;
      })
  }

  onChangeSearch(value:string) {
    this.loading = true;
    if(value.length) {
      this.searchingService.search('doctors', value)
      .subscribe((resp:any) => {
        if(resp.ok) {
          const { results } = resp;
          this.totalDoctors = results.length;
          this.doctors = results;
        }

        this.loading = false;
      });
    } else {
      this.loadDoctors();
    }
  }

  updateDoctor(doctor: Doctors) {
    this.router.navigateByUrl(`doctors/${doctor._id}`);
  }

  deleteDoctor(doctor: Doctors) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.doctorsService.deleteDoctor(doctor._id)
          .subscribe((resp:any) => {
            if(resp.ok) {
              Swal.fire(
                'Deleted!',
                `Doctor ${doctor.name} deleted`,
                'success'
              );
              this.loadDoctors();
            } else {
              // if error exist
              Swal.fire('Error', 'Error deleting doctor', 'error');
            }
          }, (e) => {
            // if error exist
            Swal.fire('Error', e.error.msg, 'error');
          });
      }
    })
  }

}
