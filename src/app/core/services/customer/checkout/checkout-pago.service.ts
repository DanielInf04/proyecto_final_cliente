import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';
import { CheckoutPayload } from '../../../../interfaces/cart/checkout-payload';

@Injectable({
  providedIn: 'root'
})
export class CheckoutPagoService {

  private apiUrl = environment.apiUrl;

  constructor(
    private _http: HttpClient
  ) { }

  procesarCheckout(payload: CheckoutPayload): Observable<any> {
    const token = localStorage.getItem('token');
    console.log(token);

    return this._http.post<any>(`${this.apiUrl}api/checkout`, payload, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      observe: 'response'
    });

  }

}