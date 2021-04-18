import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  anonymous: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  changeAnonymousState(): void {
    this.anonymous = !this.anonymous;
  }
}
