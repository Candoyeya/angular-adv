import { Component, Input, Output, } from '@angular/core';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label, Color } from 'ng2-charts';

@Component({
  selector: 'app-donnut',
  templateUrl: './donnut.component.html',
  styles: []
})
export class DonnutComponent {
  // Inputs
  @Input() title: string = 'Without title';
  @Input('labels') doughnutChartLabels: Label[] = ['Label1', 'Label2', 'Label3'];
  @Input('data') doughnutChartData: MultiDataSet = [
    [100, 200, 300],
  ];
  public doughnutChartType: ChartType = 'doughnut';
  public colors: Color[] = [
    { backgroundColor: ['#6857E6','#009FEE','#F02059']}
  ];

}
