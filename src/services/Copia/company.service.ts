import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Icompany } from '../app/interfaces/icompany';
import { jwtDecode, JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private apiUrl = environment.apiUrl;

  constructor(private _http:HttpClient) { }

  // Retorna la empresa
  public getCompany(): Observable<HttpResponse<Icompany>> {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Token no encontrado');
    }

    const decoded = jwtDecode<JwtPayload>(token);
    const id = decoded.sub;

    return this._http.get<Icompany>(`${this.apiUrl}api/company/${id}`, { observe: 'response' });
  }

  public updateCompany(datos: any): Observable<HttpResponse<Icompany>> {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Token no encontrado');
    }

    const decoded = jwtDecode<JwtPayload>(token);
    const id = decoded.sub;

    return this._http.put<Icompany>(`${this.apiUrl}api/company/${id}`, datos, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      observe: 'response'
    });
  }

}
