import { Component } from '@angular/core';
@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: []
})
export class Grafica1Component {
  public labelsOne: string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  public dataOne = [
    [350, 450, 100],
  ];

  public labelsTwo: string[] = ['Download Purchases', 'In-Store Purchases', 'Mail-Order Purchases'];
  public dataTwo= [
    [600, 250, 50],
  ];

}
