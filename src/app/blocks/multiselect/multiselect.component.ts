import { Component, Input, OnInit, Output } from '@angular/core';
import * as EventEmitter from 'events';

@Component({
  selector: 'app-multiselect',
  templateUrl: './multiselect.component.html',
  styleUrls: ['./multiselect.component.scss']
})
export class MultiselectComponent implements OnInit {
@Input() config: any;
@Output() changeEvent = new EventEmitter();
  isLoading: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  onSelect(): void {
    this.changeEvent.emit(true);
  }

  onInputChange(): void { }
}
