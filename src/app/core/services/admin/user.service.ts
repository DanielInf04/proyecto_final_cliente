import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '../../../interfaces/user/iuser';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.apiUrl;

  constructor(private _http:HttpClient) { }

  public getUsers(page: number = 1, perPage: number = 10, role: string): Observable<HttpResponse<any>> {
    const token = localStorage.getItem('token');

    return this._http.get<any>(`${this.apiUrl}api/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      observe: 'response',
      params: {
        page: page.toString(),
        per_page: perPage.toString(),
        role: role
      }
    });
  }

  /*public getUsers(page: number = 1, perPage: number = 10): Observable<HttpResponse<any>> {
    const token = localStorage.getItem('token');

    return this._http.get<any>(`${this.apiUrl}api/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      observe: 'response',
      params: {
        page: page.toString(),
        per_page: perPage.toString()
      }
    });
  }*/

  public searchMyUsers(
    termino: string,
    page: number = 1,
    perPage: number = 10
  ): Observable<HttpResponse<any>> {
    const token = localStorage.getItem('token');

    return this._http.get<any>(`${this.apiUrl}api/admin/users/search`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      observe: 'response',
      params: {
        query: termino,
        page: page.toString(),
        per_page: perPage.toString()
      }
    });
  }

  public actualizarEstado(id:number, status:string) {
      const token = localStorage.getItem('token');
  
      return this._http.patch<IUser>(`${this.apiUrl}api/admin/user/${id}`, { status }, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        observe: 'response'
      });
  }

  public deleteUser(id:any): Observable<HttpResponse<IUser>> {
      const token = localStorage.getItem('token');
  
      return this._http.delete<IUser>(`${this.apiUrl}api/admin/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        observe: 'response'
      });
  }

}
