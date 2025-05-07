import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { PedidoEmpresa } from '../../../interfaces/order/iorder';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = environment.apiUrl;

  constructor(private _http:HttpClient) { }

  public getOrders():Observable<{ pedidos: PedidoEmpresa[] }> {
      const token = localStorage.getItem('token');
  
      return this._http.get<{ pedidos: PedidoEmpresa[] }>(`${this.apiUrl}api/company/orders`, {
        headers: {
          Authorization: `Bearer ${token}`
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
