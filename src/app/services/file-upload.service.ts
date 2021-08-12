import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(
    private http:HttpClient
  ) { }

  async updatePhoto(
    file: File,
    type: 'users'|'doctors'|'hospitals',
    id: string
  ) {
    try {
      const url = `${baseUrl}/uploads/${type}/${id}`;
      const formData = new FormData();
      formData.append('img', file);

      const resp = await fetch(url, {
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token') || ''
        },
        body: formData
      })

      const data = await resp.json();
      if(data.ok) {
        return data.nameFile
      } else {
        console.log(data.msg);
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

}
