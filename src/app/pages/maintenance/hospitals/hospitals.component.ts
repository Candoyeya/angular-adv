import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Hospitals } from 'src/app/models/hospitals.model';
import { HospitalsService } from 'src/app/services/hospitals.service';
import { ModalImageService } from 'src/app/services/modal-image.service';
import { SearchingService } from 'src/app/services/searching.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitals',
  templateUrl: './hospitals.component.html',
  styles: []
})
export class HospitalsComponent implements OnInit, OnDestroy {
  public totalHospitals: number = 0;
  public hospitals: Hospitals[];
  public loading: boolean = true;

  public imgSubs: Subscription;

  constructor(
    private hospitalsService: HospitalsService,
    private searchingService: SearchingService,
    private modalImageService: ModalImageService
  ) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit() {
    this.loadHospitals();
    this.imgSubs = this.modalImageService.newImage
      .pipe(delay(100)).subscribe(img => this.loadHospitals());
  }

  loadHospitals() {
    this.loading = true;
    this.hospitalsService.getHospitals()
      .subscribe((resp) => {
        if(resp.ok) {
          this.hospitals = resp.hospitals;
          this.totalHospitals = resp.hospitals.length;
        }
        this.loading = false;
      })
  }

  onChangeSearch(value:string) {
    this.loading = true;
    if(value.length) {
      this.searchingService.search('hospitals', value)
      .subscribe((resp:any) => {
        if(resp.ok) {
          const { results } = resp;
          this.totalHospitals = results.length;
          this.hospitals = results;
        }

        this.loading = false;
      });
    } else {
      this.loadHospitals();
    }
  }

  async createHospital() {
    const { value: name } = await Swal.fire<string>({
      title: 'Create Hospital',
      input: 'text',
      inputLabel: 'Hospital Name',
      inputPlaceholder: 'Enter the Name',
      showCancelButton: true,
    })
    
    if (name.trim().length) {
      this.hospitalsService.createHospital(name.trim())
      .subscribe(resp => {
        Swal.fire('Success', 'Hospital Save', 'success');
        this.loadHospitals();
      }, (e) => {
        // if error exist
        Swal.fire('Error', e.error.msg, 'error');
      })
    }
  }

  updateHospital(hospital: Hospitals) {
    this.hospitalsService.updateHospital(hospital.name, hospital._id)
      .subscribe(resp => {
        Swal.fire('Success', 'Hospital Save', 'success');
      }, (e) => {
        // if error exist
        Swal.fire('Error', e.error.msg, 'error');
      });
  }

  deleteHospital(hospital: Hospitals) {
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
        this.hospitalsService.deleteHospital(hospital._id)
          .subscribe((resp:any) => {
            if(resp.ok) {
              Swal.fire(
                'Deleted!',
                `Hospital ${hospital.name} deleted`,
                'success'
              );
              this.loadHospitals();
            } else {
              // if error exist
              Swal.fire('Error', 'Error deleting hospital', 'error');
            }
          }, (e) => {
            // if error exist
            Swal.fire('Error', e.error.msg, 'error');
          });
      }
    })
  }

  openModal(hospital: Hospitals) {
    this.modalImageService.openModal("hospitals", hospital._id, hospital.img);
  }

}
