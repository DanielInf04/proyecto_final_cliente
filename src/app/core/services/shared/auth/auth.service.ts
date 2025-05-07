import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable, of, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(private _http:HttpClient) { }

  login(email: string, password: string) {
    return this._http.post(`${this.apiUrl}api/auth/login`, { email, password });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) return new Observable(observer => observer.complete());

    return this._http.post(`${this.apiUrl}api/auth/logout`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  register(userData: any): Observable<any> {
    return this._http.post(`${this.apiUrl}api/auth/register`, userData);
  }

  refreshToken(): Observable<string> {
    console.log("Refrescando token");
    const token = localStorage.getItem('token');
    console.log("Token enviado", token);
  
    if (!token) {
      return throwError(() => new Error('No hay token para refrescar'));
    }
  
    return this._http.post<any>(`${this.apiUrl}api/auth/refresh`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      switchMap(response => {
        const newToken = response.access_token;
        if (newToken) {
          console.log('Nuevo token recibido:', newToken); // Debug
          localStorage.setItem('token', newToken);
          return of(newToken);
        }
        return throwError(() => new Error('Token no recibido'));
      })
    );
  }

}
