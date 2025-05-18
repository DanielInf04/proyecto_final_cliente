import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { AuthService } from '../services/auth.service';
import { AuthService } from '../services/shared/auth/auth.service';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');
    let authReq = req;

    if (token) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 &&
          token && 
          !req.url.includes('/auth/login') &&
          !req.url.includes('/auth/refresh')
        
        ) {
          // Si el token está expirado, intentamos renovarlo
          return this.authService.refreshToken().pipe(
            switchMap((newToken: string) => {
              localStorage.setItem('token', newToken);
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` }
              });
              return next.handle(retryReq);
            }),
            catchError(err => {
              this.authService.logout(); // Si falla el refresh, se cierra sesión
              this.router.navigate(['/login']);
              return throwError(() => err);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }

}