import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Coupon } from '../../../../interfaces/coupon/coupon';
import { TokenService } from '../../shared/auth/token.service';

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  private apiUrl = environment.apiUrl;

  constructor(
    private _http:HttpClient,
    private tokenService: TokenService
  ) { }

  public validarCodigo(codigo: string): Observable<{ success: boolean; data?: Coupon; message?: string }> {
    const userLogueado = this.tokenService.isLoggedIn();
    const url = userLogueado
      ? `${this.apiUrl}api/user/validate-coupon`
      : `${this.apiUrl}api/validate-coupon`;

    return this._http.post<{ success: boolean; data?: Coupon; message?: string }>(
      url,
      { codigo }
    );
  }

  /*public checkWelcomeCouponStatus(): Observable<{ mostrarBanner: boolean; cupon: string | null; porcentaje_descuento: number }> {
    const token = localStorage.getItem('token');
    const role = this.tokenService.getUserRole();

    // Si no es cliente, devolvemos un observable con valores por defecto
    if (role !== 'cliente') {
      return of({
        mostrarBanner: false,
        cupon: null,
        porcentaje_descuento: 0
      });
    }

    return this._http.get<{ mostrarBanner: boolean; cupon: string | null; porcentaje_descuento: number }>(
      `${this.apiUrl}api/cupon-bienvenida`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }*/

  public checkWelcomeCouponStatus(): Observable<{ mostrarBanner: boolean; cupon: string | null; porcentaje_descuento: number }> {
    const token = localStorage.getItem('token');
    const role = this.tokenService.getUserRole();

    return this._http.get<{ mostrarBanner: boolean; cupon: string | null; porcentaje_descuento: number }>(
      `${this.apiUrl}api/cupon-bienvenida`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
  }

}
