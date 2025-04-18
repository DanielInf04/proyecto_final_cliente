import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Coupon } from '../../../interfaces/coupon';

@Injectable({
  providedIn: 'root'
})
export class AdminCouponService {

  private apiUrl = environment.apiUrl;

  constructor(private _http:HttpClient) { }

  public getCoupons():Observable<HttpResponse<Coupon[]>> {
    const token = localStorage.getItem('token');

    return this._http.get<Coupon[]>(`${this.apiUrl}api/coupons`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      observe: 'response'
    });
  }

  public createCoupon(coupon:any): Observable<HttpResponse<Coupon>> {
    const token = localStorage.getItem('token');

    return this._http.post<Coupon>(`${this.apiUrl}api/coupon`, coupon, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      observe: 'response'
    });
  }

  public deleteCoupon(id: any): Observable<HttpResponse<Coupon>> {
    const token = localStorage.getItem('token');

    return this._http.delete<Coupon>(`${this.apiUrl}api/coupon/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      observe: 'response'
    });
  }

}
