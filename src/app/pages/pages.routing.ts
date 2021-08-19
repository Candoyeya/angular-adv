import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthGuard } from '../guards/auth.guard';

import { PagesComponent } from './pages.component';

// Dashboard
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { ProfileComponent } from './profile/profile.component';

// Maintenance
import { UsersComponent } from './maintenance/users/users.component';
import { HospitalsComponent } from './maintenance/hospitals/hospitals.component';
import { DoctorsComponent } from './maintenance/doctors/doctors.component';
import { DoctorComponent } from './maintenance/doctors/doctor.component';


const routes: Routes = [
  { 
    path: 'dashboard', 
    component: PagesComponent,
    canActivate: [ AuthGuard ],
    children: [
      { path: '', component: DashboardComponent, data: { titulo: 'Dashboard' } },
      // Dashboard
      { path: 'progress', component: ProgressComponent, data: { titulo: 'ProgressBar' }},
      { path: 'grafica1', component: Grafica1Component, data: { titulo: 'Gráfica #1' }},
      { path: 'account-settings', component: AccountSettingsComponent, data: { titulo: 'Ajustes de cuenta' }},
      { path: 'profile', component: ProfileComponent, data: { titulo: 'Profile' }},
      
      // Maintenance
      { path: 'users', component: UsersComponent, data: { titulo: 'User maintenance' }},
      { path: 'hospitals', component: HospitalsComponent, data: { titulo: 'Hospital maintenance' }},
      { path: 'doctors', component: DoctorsComponent, data: { titulo: 'Doctor maintenance' }},
      { path: 'doctors/:id', component: DoctorComponent, data: { titulo: 'Doctor maintenance' }},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
