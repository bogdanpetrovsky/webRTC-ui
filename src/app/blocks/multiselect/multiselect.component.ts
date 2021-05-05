import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { MultiSelect } from '../data-models/Multiselect';

@Component({
  selector: 'app-multiselect',
  templateUrl: './multiselect.component.html',
  styleUrls: ['./multiselect.component.scss']
})
export class MultiselectComponent implements OnInit {
  @Input() config: MultiSelect;
  @Output() changeEvent = new EventEmitter();
  isLoading: boolean;

  constructor() { }

  ngOnInit(): void {
    if (this.config.preloadOptions) {
      this.search('preload');
    }
  }

  onInputChange(event): any {
    if (this.config.preloadOptions) { return false; }
    this.config.query = event.term;
    if (!event.term) {
      this.config.items.length = 0;
    } else {
      this.search(event.term);
    }
  }

  search(query): void {
    this.config.clearInvalidState();
    this.isLoading = true;
    this.config.remoteRequest(query)
      .subscribe((response) => this.parseResponse(response));
  }

  parseResponse(response): void {
    this.config.items.length = 0;
    this.isLoading = false;

    response.forEach((item) => {
      this.config.add(item);
    });
  }

  onSelect(): void {
    this.config.updateSelection();
    this.changeEvent.emit(true);
  }
}
