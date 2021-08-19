import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { Doctors } from 'src/app/models/doctors.model';
import { Hospitals } from 'src/app/models/hospitals.model';
import { DoctorsService } from 'src/app/services/doctors.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { HospitalsService } from 'src/app/services/hospitals.service';
import { ModalImageService } from 'src/app/services/modal-image.service';
import { SearchingService } from 'src/app/services/searching.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styles: []
})
export class DoctorComponent implements OnInit {
  public doctorForm: FormGroup;
  public currentDoctor: Doctors;
  public imgLoading: File;
  public imgTemp: any = null;
  public hospitals: Hospitals[];
  public selectedHospital: Hospitals;
  public doctor: Doctors;

  constructor(
    private doctorsService: DoctorsService,
    private hospitalsService: HospitalsService,
    private router:Router,
    private activatedRoute: ActivatedRoute,
    private fileUpload: FileUploadService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loadHospitals();
    this.activatedRoute.params.subscribe(params => {
      const id = params['id'];
      if(id && id !== 'new') {
        this.getDoctor(id);
      }
    });
    this.doctorForm = this.fb.group({
      name: ['', Validators.required],
      hospital: ['', Validators.required],
    });
    this.doctorForm.get('hospital').valueChanges
      .subscribe(id => {
        this.selectedHospital = this.hospitals.find(item => item._id === id);
      });
    
  }

  loadHospitals() {
    this.hospitalsService.getHospitals()
      .subscribe((resp:any) => {
        if(resp.ok) {
          this.hospitals = resp.hospitals;
        }
      })
  }

  getDoctor(id:string) {
    this.doctorsService.getDoctorById(id)
      .pipe(delay(100))
      .subscribe((resp:any) => {
        if(resp.ok) {
          this.doctor = resp.doctor;
          this.doctorForm.setValue({name: this.doctor.name, hospital: this.doctor.hospital._id});
        } else {
          this.router.navigateByUrl(`/dashboard/doctors`);
        }
      }, (e) => {
        // if error exist
        Swal.fire('Error', e.error.msg, 'error');
        this.router.navigateByUrl(`/dashboard/doctors`);
      });
  }

  saveDoctor() {
    console.log('form==>', this.doctorForm.value);
    if(this.doctor) {
      this.updateDoctor()
    } else {
      this.createDoctor();
    }
    
  }

  createDoctor() {
    this.doctorsService.createDoctor(this.doctorForm.value)
      .subscribe((resp:any) => {
        Swal.fire('Success', `Doctor ${resp.doctor.name} Save`, 'success');
        this.router.navigateByUrl(`/dashboard/doctors/${resp.doctor._id}`)
      }, (e) => {
        // if error exist
        Swal.fire('Error', e.error.msg, 'error');
      })
  }

  updateDoctor() {
    this.doctorsService.updateDoctor(this.doctorForm.value, this.doctor._id)
      .subscribe((resp:any) => {
        Swal.fire('Success', `Doctor ${resp.doctor.name} Save`, 'success');
      }, (e) => {
        // if error exist
        Swal.fire('Error', e.error.msg, 'error');
      });
  }

  changeImg(file: File) {
    this.imgLoading = file;

    if(!file){
      return this.imgTemp = null;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }
  }

  uploadImg() {
    this.fileUpload.updatePhoto(this.imgLoading, 'doctors', this.currentDoctor._id)
      .then((img) => {
        if(img) {
          this.currentDoctor.img = img;
          Swal.fire('Save', 'Updated Avatar', 'success');
        } else {
          // if error exist
          Swal.fire('Error', 'Error saving image', 'error');
        }
      });
  }

}
