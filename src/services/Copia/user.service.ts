import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '../app/interfaces/iuser';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.apiUrl;

  constructor(private _http:HttpClient) { }

  public getUsers(): Observable<HttpResponse<IUser[]>> {
    const token = localStorage.getItem('token');

    return this._http.get<IUser[]>(`${this.apiUrl}api/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      observe: 'response'
    });
  }

  public actualizarEstado(id:number, status:string) {
      const token = localStorage.getItem('token');
  
      return this._http.patch<IUser>(`${this.apiUrl}api/user/${id}`, { status }, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        observe: 'response'
      });
  }

  public deleteUser(id:any): Observable<HttpResponse<IUser>> {
      const token = localStorage.getItem('token');
  
      return this._http.delete<IUser>(`${this.apiUrl}api/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        observe: 'response'
      });
  }

}
