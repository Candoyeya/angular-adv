import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChartsModule } from 'ng2-charts';

import { IncreasingComponent } from './increasing/increasing.component';
import { DonnutComponent } from './donnut/donnut.component';

@NgModule({
  declarations: [
    IncreasingComponent,
    DonnutComponent
  ],
  exports: [
    IncreasingComponent,
    DonnutComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ChartsModule
  ]
})
export class ComponentsModule { }
