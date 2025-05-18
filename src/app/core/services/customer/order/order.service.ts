import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { IPaginatedOrders, IUserOrder } from '../../../../interfaces/order/iuserorder';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = environment.apiUrl;

  constructor(private _http:HttpClient) { }

  getUserOrders(page: number = 1, perPage: number = 5): Observable<IPaginatedOrders> {
    const token = localStorage.getItem('token');

    return this._http.get<IPaginatedOrders>(`${this.apiUrl}api/user/orders`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        page: page.toString(),
        per_page: perPage.toString()
      }
    });
  }

  getOrderById(id: number): Observable<{ pedido: IUserOrder }> {
    const token = localStorage.getItem('token');

    return this._http.get<{ pedido: IUserOrder }>(`${this.apiUrl}api/user/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

}
