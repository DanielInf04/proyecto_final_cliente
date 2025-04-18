import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Coupon } from '../../../interfaces/coupon';

@Injectable({
  providedIn: 'root'
})
export class CouponService {

  private apiUrl = environment.apiUrl;

  constructor(private _http:HttpClient) { }

  public validarCodigo(codigo: string): Observable<{ success: boolean; data?: Coupon; message?: string }> {
    return this._http.post<{ success: boolean; data?: Coupon; message?: string }>(
      `${this.apiUrl}api/validate-coupon`,
      { codigo }
    );
  }

  public checkWelcomeCouponStatus(): Observable<{ mostrarBanner: boolean; cupon: string | null; porcentaje_descuento: number }> {
    const token = localStorage.getItem('token');

    return this._http.get<{ mostrarBanner: boolean; cupon: string | null; porcentaje_descuento: number }>(
      `${this.apiUrl}api/cupon-bienvenida`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
  }

}
