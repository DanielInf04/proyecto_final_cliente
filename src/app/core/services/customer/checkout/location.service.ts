import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private apiUrl = environment.apiUrl;

  constructor(private _http:HttpClient) { }

  public getProvincias():Observable<HttpResponse<any[]>> {
    return this._http.get<any[]>(`${this.apiUrl}api/provincias`, { observe: 'response' });
  }

  public getPoblacionPorProvincia(id: any):Observable<HttpResponse<any[]>> {
    return this._http.get<any[]>(`${this.apiUrl}api/poblaciones/${id}`, { observe: 'response' });
  }

}
