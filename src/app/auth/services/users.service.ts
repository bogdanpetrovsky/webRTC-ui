import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { IUser } from '../../blocks/data-models/User';


export interface UsersResponseInterface {
  data: IUser[];
  total: number;
  offset: number;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private http: HttpClient) {}

  update(id: number, user: IUser): any {
    return this.http.patch<IUser>(environment.apiUrl + '/users/' + id, user);
  }

  getById(id: number): any {
    return this.http.get<IUser>(environment.apiUrl + '/users/' + id);
  }

  getList(limit: number, offset: number): any {
    return this.http.get<UsersResponseInterface>(`${environment.apiUrl}/users`, {
      params: {
        limit: limit.toString(),
        offset: offset.toString()
      }
    });
  }
}
