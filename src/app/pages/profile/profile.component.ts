import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'

import { Users } from 'src/app/models/users.model';
import { UsersService } from 'src/app/services/users.service';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {
  public profileForm: FormGroup;
  public user: Users;
  public imgLoading: File;
  public imgTemp: any = null;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private fileUpload: FileUploadService
  ) {
    this.user = usersService.user
  }

  ngOnInit() {
    this.profileForm = this.fb.group({
      name: [this.user.name, Validators.required],
      email: [this.user.email, [Validators.required, Validators.email]],
    })
  }

  updateProfile() {
    this.usersService.updateUser(this.profileForm.value)
      .subscribe(() => {
        const {name, email} = this.profileForm.value;
        this.user.name = name;
        this.user.email = email;
        Swal.fire('Save', 'Updated user', 'success');
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
    this.fileUpload.updatePhoto(this.imgLoading, 'users', this.user.uid)
      .then((img) => {
        if(img) {
          this.user.img = img;
          Swal.fire('Save', 'Updated Avatar', 'success');
        } else {
          // if error exist
          Swal.fire('Error', 'Error saving image', 'error');
        }
      });
  }

}
