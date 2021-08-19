import { environment } from "src/environments/environment";

const baseUrl = environment.baseUrl;

interface _hospitalUser {
  _id: string,
  name?: string,
  img?: string
}

export class Hospitals {
  constructor(
    public name: string,
    public _id?: string,
    public user?: _hospitalUser,
    public img?: string,
  ) {}

  get imgUrl() {
    if(this.img) {
      if(this.img.includes('https')) {
        return this.img;
      }
      return `${baseUrl}/uploads/hospitals/${this.img}`
    } else {
      return `${baseUrl}/uploads/hospitals/no-img`
    }
  }
} 