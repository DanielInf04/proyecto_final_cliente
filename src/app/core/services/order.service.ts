import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PedidoEmpresa } from '../../interfaces/iorder';
import { IUserOrder } from '../../interfaces/iuserorder';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = environment.apiUrl;

  constructor(private _http:HttpClient) { }

  public getOrders():Observable<{ pedidos: PedidoEmpresa[] }> {
    const token = localStorage.getItem('token');

    return this._http.get<{ pedidos: PedidoEmpresa[] }>(`${this.apiUrl}api/my-orders`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  public actualizarEstado(id: number, nuevoEstado: string) {
    const token = localStorage.getItem('token');
    return this._http.put(`${this.apiUrl}api/my-orders/${id}/status`, 
      { estado_envio: nuevoEstado },
      { headers: { Authorization: `Bearrer ${token}` } 
    });
  }

  getUserOrders(): Observable<{ pedidos: IUserOrder[] }> {
    const token = localStorage.getItem('token');

    return this._http.get<{ pedidos: IUserOrder[] }>(`${this.apiUrl}api/user-orders`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

}
