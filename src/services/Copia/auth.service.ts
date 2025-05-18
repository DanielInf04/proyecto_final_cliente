import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from "../environments/environment.development";
import { Observable, switchMap } from "rxjs";
import { jwtDecode } from "jwt-decode";
import { throwError } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = 'http://localhost:8000';

  jwtHelper = new JwtHelperService();

  constructor(
    private http: HttpClient,
  ) {}

  /*login(email: string, password: string) {
    return this.http.get(`${this.apiUrl}/sanctum/csrf-cookie`, { withCredentials: true }).pipe(
      switchMap(() =>
        this.http.post(`${this.apiUrl}/api/login`, { email, password }, { withCredentials: true })
      )
    );
  }*/

  /*login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/api/auth/login`, { email, password });
  }*/

  refreshToken(): Observable<string> {
    const token = localStorage.getItem('token');

    if (!token) {
      return throwError(() => new Error('No hay token para refrescar'));
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(`${this.apiUrl}/api/auth/refresh`, {}, { headers }).pipe(
      switchMap(response => {
        const newToken = response.access_token;
        if (newToken) {
          console.log('Nuevo token recibido:', newToken); // Debug
          localStorage.setItem('token', newToken);
          return [newToken];
        }
        return throwError(() => new Error('Token no recibido'));
      })
    )
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/register`, userData);
  }

  /*logout(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) return new Observable(observer => observer.complete());

    return this.http.post(`${this.apiUrl}/api/auth/logout`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }*/

  sendGoogleTokenToBackend(idToken: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/google/login`, { token: idToken });
  }

  /*login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/api/login`, { email, password });
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
  }*/

  isLoggedIn():boolean {
    const token = localStorage.getItem('token');
    return token != null && !this.jwtHelper.isTokenExpired(token);
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
  }

  /*logout() {
    localStorage.removeItem('token');
  }*/
}