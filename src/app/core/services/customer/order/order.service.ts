import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { IUserOrder } from '../../../../interfaces/order/iuserorder';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = environment.apiUrl;

  constructor(private _http:HttpClient) { }

  getUserOrders(): Observable<{ pedidos: IUserOrder[] }> {
    const token = localStorage.getItem('token');

    return this._http.get<{ pedidos: IUserOrder[] }>(`${this.apiUrl}api/user/orders`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

}
