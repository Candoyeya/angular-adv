import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

@Component({
  selector: 'app-increasing',
  templateUrl: './increasing.component.html',
  styles: [
  ]
})
export class IncreasingComponent implements OnInit {
  ngOnInit() {
    this.btnClass = `btn btn-${this.btnClass}`;
  }

  @Input('value') progress: number = 40;
  @Input() btnClass: string = 'primary';
  @Output() valueOutput: EventEmitter<number> = new EventEmitter();

  changeValue( value: number) {
    if (this.progress >= 100 && value >= 0) {
      this.valueOutput.emit(100);
      return this.progress = 100;
    }

    if (this.progress <= 0 && value < 0) {
      this.valueOutput.emit(0);
      return this.progress = 0;
    }
    
    this.progress = this.progress + value;
    this.valueOutput.emit(this.progress);
  }

  onChange( value: number ) {
    if( value >=100 ) {
      this.progress = 100;
    } else if ( value <= 0 ) {
      this.progress = 0
    } else {
      this.progress = value;
    }

    this.valueOutput.emit(this.progress);
  }

}
