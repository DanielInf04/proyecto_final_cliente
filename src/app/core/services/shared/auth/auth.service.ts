import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, Observable, of, switchMap, take, throwError } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  private refreshInProgress = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  private currentUserSubject = new BehaviorSubject<any | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private tokenService: TokenService,
    private _http:HttpClient
  ) { }

  initUserFromToken(): void {
    const token = this.tokenService.getToken();
    if (token) {
      //const user = this.tokenService.getUserFromToken();
      const user = this.tokenService.getUserData();
      if (user) {
        this.setCurrentUser(user);
      }
    }
  }

  login(email: string, password: string) {
    return this._http.post(`${this.apiUrl}api/auth/login`, { email, password });
  }

  setCurrentUser(user: any | null) {
    this.currentUserSubject.next(user);
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): Observable<any> {
    const token = this.tokenService.getToken();
    if (!token) {
      this.setCurrentUser(null);
      return of(null);
    }

    return this._http.post(`${this.apiUrl}api/auth/logout`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      switchMap(() => {
        localStorage.removeItem('token');
        this.setCurrentUser(null);
        return of(true);
      })
    );
  }

  register(userData: any): Observable<any> {
    return this._http.post(`${this.apiUrl}api/auth/register`, userData);
  }

  refreshToken(): Observable<string> {
    if (this.refreshInProgress) {
      // Si ya hay un refresh en progreso, esperar el nuevo token
      return this.refreshTokenSubject.pipe(
        filter(token => token !== null),
        take(1)
      );
    }

    this.refreshInProgress = true;
    this.refreshTokenSubject.next(null); // Reiniciar el subject

    const token = this.tokenService.getToken();
    console.log('[AuthService] Refrescando token...');
    console.log('[AuthService] Token enviado:', token);
    
    if (!token) {
      console.warn('[AuthService] No hay token para refrescar');
      return throwError(() => new Error('No hay token para refrescar'));
    }

    return this._http.post<any>(`${this.apiUrl}api/auth/refresh`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).pipe(
      switchMap(response => {
        const newToken = response.access_token;
        if (!newToken) {
          console.error('[AuthService] No se recibió nuevo token');
          return throwError(() => new Error('No se recibió nuevo token'));
        }

        console.log('[AuthService] Nuevo token recibido:', newToken);
        localStorage.setItem('token', newToken);
        this.refreshInProgress = false;
        this.refreshTokenSubject.next(newToken);
        return of(newToken);
      }),
      catchError(error => {
        this.refreshInProgress = false;
        this.refreshTokenSubject.next(null);
        return throwError(() => error);
      })
    );
  }

  /*refreshToken(): Observable<string> {
    console.log("Refrescando token");
    //const token = localStorage.getItem('token');
    const token = this.tokenService.getToken();
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
  }*/

}
