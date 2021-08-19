import { environment } from "src/environments/environment";
import { Hospitals } from "./hospitals.model";

const baseUrl = environment.baseUrl;

interface _additionalData {
  _id: string,
  name?: string,
  img?: string
}

export class Doctors {
  constructor(
    public name: string,
    public _id?: string,
    public hospital?: Hospitals,
    public user?: _additionalData,
    public img?: string,
  ) {}

  get imgUrl() {
    if(this.img) {
      if(this.img.includes('https')) {
        return this.img;
      }
      return `${baseUrl}/uploads/doctors/${this.img}`
    } else {
      return `${baseUrl}/uploads/doctors/no-img`
    }
  }
} 