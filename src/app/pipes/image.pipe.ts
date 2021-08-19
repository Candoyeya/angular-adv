import { Pipe, PipeTransform } from '@angular/core';
import { environment } from "src/environments/environment";

const baseUrl = environment.baseUrl;

@Pipe({
  name: 'image'
})
export class ImagePipe implements PipeTransform {

  transform(img: string, type: 'users' | 'hospitals' | 'doctors'): string {
    if(img) {
      if(img.includes('https')) {
        return img;
      }
      return `${baseUrl}/uploads/${type}/${img}`
    } else {
      return `${baseUrl}/uploads/${type}/no-img`
    }
    // return 'Hello World' + img + type;
  }

}
