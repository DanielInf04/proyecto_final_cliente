import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JwtHelperService } from '@auth0/angular-jwt';
//import { environment } from "../../../environments/environment.development";
import { Observable, switchMap } from "rxjs";
import { jwtDecode } from "jwt-decode";
import { of, throwError } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = 'http://localhost:8000';

  jwtHelper = new JwtHelperService();

  constructor(
    private http: HttpClient,
  ) {}

  /*login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/api/auth/login`, { email, password });
  }*/

  /*getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }*/

  /*refreshToken(): Observable<string> {
    console.log("Refrescando token");
    const token = localStorage.getItem('token');
    console.log("Token enviado", token);
  
    if (!token) {
      return throwError(() => new Error('No hay token para refrescar'));
    }
  
    return this.http.post<any>(`${this.apiUrl}/api/auth/refresh`, {}, {
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

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/register`, userData);
  }

  logout(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) return new Observable(observer => observer.complete());

    return this.http.post(`${this.apiUrl}/api/auth/logout`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }*/

  /*sendGoogleTokenToBackend(idToken: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/google/login`, { token: idToken });
  }*/

  /*getUserFromToken(): any {
    const token = localStorage.getItem('token');
    if (!token) return null;
  
    try {
      const decoded: any = jwtDecode(token);
      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getUser() {
    const token = localStorage.getItem('token');
    return this.http.get(`${this.apiUrl}/user`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getUserName(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.name; // Laravel debe enviar name dentro del token
    }
    return null;
  }*/
}