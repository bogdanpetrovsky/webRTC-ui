import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private changeTheme = new Subject<string>();
  changeTheme$ = this.changeTheme.asObservable();
  private activeTheme: string = this.getActiveTheme();

  constructor() {}

  getActiveTheme(): any {
    return localStorage.getItem('theme');
  }

  setTheme(name?: string): void {
    this.changeTheme.next(name);
  }

  themeChanged(name?: string): void {
    this.activeTheme = name || null;
    name ? localStorage.setItem('theme', name) : localStorage.removeItem('theme');
  }

  isSignedIn(): boolean {
    return false;
  }
}
