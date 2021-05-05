import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IUser, User } from '../../blocks/data-models/User';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UsersService } from './users.service';

export interface LoginResponseInterface {
  user: IUser;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: User;
  token: string;
  private changeTheme = new Subject<string>();
  changeTheme$ = this.changeTheme.asObservable();
  private activeTheme: string = this.getActiveTheme();

  constructor(private http: HttpClient,
              private usersService: UsersService) {}

  initialize(): any {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token && user) {
      this.token = token;
      this.user = new User(user);
      return this.getRemoteUser();
    }
  }

  getRemoteUser(): void {
    this.usersService.getById(this.getUserId()).toPromise()
      .then((response: IUser) => this.setUser(response));
  }

  signUp(user): Promise<IUser> {
    return this.http.post<IUser>(environment.apiUrl + '/sign-up', user).toPromise();
  }

  signIn(user): Observable<LoginResponseInterface> {
    const params = { email: user.email, password: user.password };
    return this.http.post<LoginResponseInterface>(environment.apiUrl + '/sign-in', params);
  }

  logOut(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.user = null;
    this.token = null;
  }

  setToken(token: string): any {
    if (!token) { return false; }
    localStorage.setItem('token', token);
    this.token = token;
  }

  setUser(user: IUser): any {
    if (!user) { return false; }
    this.user ? this.user.init(user) : this.user = new User(user);
    this.saveUserToLocalStorage();
  }

  saveUserToLocalStorage(): void {
    localStorage.setItem('user', JSON.stringify(this.user.toJson()));
  }

  getToken(): string {
    return this.token;
  }

  getUser(): User {
    return this.user;
  }

  getUserId(): number {
    if (!this.user) { return null; }
    return this.user.id;
  }

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
    return !!this.getToken();
  }
}
