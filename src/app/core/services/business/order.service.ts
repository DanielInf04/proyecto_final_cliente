import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { PedidoEmpresa } from '../../../interfaces/order/iorder';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = environment.apiUrl;

  constructor(private _http:HttpClient) { }

  public getOrders(page: number = 1, perPage: number = 10, orden: string): Observable<any> {
    const token = localStorage.getItem('token');

    return this._http.get<any>(`${this.apiUrl}api/company/orders`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        page: page.toString(),
        per_page: perPage.toString(),
        orden: orden
      }
    });
  }

  public searchMyOrders(
    termino: string,
    page: number = 1,
    perPage: number = 10
  ): Observable<HttpResponse<any>> {
    const token = localStorage.getItem('token');

    return this._http.get<any>(`${this.apiUrl}api/company/orders/search`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      observe: 'response',
      params: {
        q: termino,
        page: page.toString(),
        per_page: perPage.toString()
      }
    });
  }
  
  public actualizarEstado(id: number, nuevoEstado: string) {
    const token = localStorage.getItem('token');
    return this._http.put(`${this.apiUrl}api/company/order/${id}/status`, 
      { estado_envio: nuevoEstado },
      { headers: { Authorization: `Bearrer ${token}` } 
    });
  }

}
