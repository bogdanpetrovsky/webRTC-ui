import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  dark: boolean;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.dark = this.authService.getActiveTheme() === 'dark';
  }

  changeHeaderState(): void {
    this.dark = !this.dark;
    this.authService.setTheme(this.dark ? 'dark' : '');
  }
}
