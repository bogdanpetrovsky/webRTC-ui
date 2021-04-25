import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
selected: boolean;
hidden: boolean;
  constructor() { }

  ngOnInit(): void {
  }

  select(): void {
    this.selected = !this.selected;
  }
}
