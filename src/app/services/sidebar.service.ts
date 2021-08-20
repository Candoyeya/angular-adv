import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  public menu: any[] = []

  loadMenu() {
    this.menu = JSON.parse(localStorage.getItem('menu')) || [];
  }
  // menu: any[] = [
  //   {
  //     titulo: 'Dashboard',
  //     icono: 'mdi mdi-gauge',
  //     submenu: [
  //       { titulo: 'Main', url: '/' },
  //       { titulo: 'Gráficas', url: 'grafica1' },
  //       { titulo: 'ProgressBar', url: 'progress' },
  //     ]
  //   },
  //   {
  //     titulo: 'Maintenance',
  //     icono: 'mdi mdi-folder-lock-open',
  //     submenu: [
  //       { titulo: 'Users', url: 'users' },
  //       { titulo: 'Hospitals', url: 'hospitals' },
  //       { titulo: 'Doctors', url: 'doctors' },
  //     ]
  //   },
  // ];
}