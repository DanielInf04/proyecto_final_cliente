import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Icompany } from '../../../interfaces/user/icompany';
import { jwtDecode, JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private apiUrl = environment.apiUrl;

  private nombreEmpresaSubject = new BehaviorSubject<string | null>(null);
  public nombreEmpresa$ = this.nombreEmpresaSubject.asObservable();

  constructor(private _http:HttpClient) {
    const nombre = localStorage.getItem('empresaNombre');
    if (nombre) {
      this.nombreEmpresaSubject.next(nombre);
    }
  }

  // Retorna la empresa
  /*public getCompany(): Observable<HttpResponse<Icompany>> {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Token no encontrado');
    }

    const decoded = jwtDecode<JwtPayload>(token);
    const id = decoded.sub;

    return this._http.get<Icompany>(`${this.apiUrl}api/company/${id}`, { observe: 'response' });
  }*/

  public getMyCompany(): Observable<HttpResponse<Icompany>> {
    /*const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Token no encontrado');
    }*/

    return this._http.get<Icompany>(`${this.apiUrl}api/company/profile`, {
      /*headers: {
        Authorization: `Bearer ${token}`
      },*/
      observe: 'response'
    }).pipe(
      tap((resp) => {
        const nombre = resp.body?.nombre || null;
        if (nombre) {
          this.nombreEmpresaSubject.next(nombre);
          localStorage.setItem('empresaNombre', nombre);
        }
      })
    )

  }

  public getNombreEmpresaActual(): string | null {
    return this.nombreEmpresaSubject.value;
  }

  public updateCompany(datos: any): Observable<HttpResponse<Icompany>> {
    /*const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('Token no encontrado');
    }*/

    return this._http.put<Icompany>(`${this.apiUrl}api/company/profile`, datos, {
      /*headers: {
        Authorization: `Bearer ${token}`
      },*/
      observe: 'response'
    })

  }

}
