import { Injectable,EventEmitter } from '@angular/core';
// import { EventEmitter } from 'events';
import { environment } from "src/environments/environment";

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class ModalImageService {
  private _hideModal: boolean = true;
  public type: 'users' | 'hospitals' | 'doctors';
  public id: string;
  public img: string;
  public newImage: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  get hideModal() {
    return this._hideModal;
  }

  get imgUrl() {
    if(this.img) {
      if(this.img.includes('https')) {
        return this.img;
      }
      return `${baseUrl}/uploads/${this.type}/${this.img}`
    } else {
      return `${baseUrl}/uploads/${this.type}/no-img`
    }
  }

  openModal(
    type: 'users' | 'hospitals' | 'doctors', 
    id: string,
    img?: string
  ) {
    this.type = type;
    this.id = id;
    this.img = img;
    this._hideModal = false;
  }

  closeModal() {
    this._hideModal = true;
  }
}
