import { Injectable } from '@angular/core';
import { environment } from '../../../../../../environments/environment.development';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DireccionService {

  private apiUrl = environment.apiUrl;

  constructor(private _http: HttpClient) { }

  obtenerDireccionGuardada(): Observable<HttpResponse<any>> {
    const token = localStorage.getItem('token');

    return this._http.get<any>(`${this.apiUrl}api/address-default`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      observe: 'response'
    });
  }

}
