import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImageService } from 'src/app/services/modal-image.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-image',
  templateUrl: './modal-image.component.html',
  styles: []
})
export class ModalImageComponent implements OnInit {
  public imgLoading: File;
  public imgTemp: any = null;

  constructor(
    public modalImageService: ModalImageService,
    private fileUpload: FileUploadService
  ) {}

  ngOnInit() {
  }

  closeModal() {
    this.imgTemp = null;
    this.modalImageService.closeModal();
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
    const id = this.modalImageService.id;
    const type = this.modalImageService.type;
    this.fileUpload.updatePhoto(this.imgLoading, type, id)
      .then((img) => {
        if(img) {
          this.closeModal();
          this.modalImageService.img = img;
          this.modalImageService.newImage.emit(img);
          Swal.fire('Save', 'Updated image', 'success');
        } else {
          // if error exist
          Swal.fire('Error', 'Error saving image', 'error');
        }
      });
  }

}
