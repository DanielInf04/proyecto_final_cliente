import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProduct } from '../app/interfaces/iproduct';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = environment.apiUrl;

  constructor(private _http:HttpClient) { }

  public addToCart(productoId: number, quantity: number):Observable<HttpResponse<IProduct>> {
    const token = localStorage.getItem('token');

    return this._http.post<IProduct>(`${this.apiUrl}api/cart/add`,
      { producto_id: productoId, cantidad: quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        observe: 'response'
      });
  }

  public getCart(): Observable<HttpResponse<any>> {
    const token = localStorage.getItem('token');

    return this._http.get<any>(`${this.apiUrl}api/cart/`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      observe: 'response'
    });
  }

  // Agrega un producto al carrito
  /*public addToCart(productId: number, quantity: number):Observable<HttpResponse<IProduct>> {
    const token = localStorage.getItem('token');

    return this._http.post<IProduct>(`${this.apiUrl}api/cart/add`, 
      { producto_id: productId, cantidad: quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        observe: 'response'
      });
  }*/

  /*public getCart(): Observable<HttpResponse<any>> {
    const token = localStorage.getItem('token');

    return this._http.get<any>(`${this.apiUrl}api/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      observe: 'response'
    });
  }*/
  
  public updateProduct(productId: number, quantity: number): Observable<HttpResponse<any>> {
    const token = localStorage.getItem('token');
  
    return this._http.put<any>(
      `${this.apiUrl}api/cart/update`,
      { producto_id: productId, cantidad: quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        observe: 'response'
      }
    );
  }

  public deleteProduct(productId: number):Observable<HttpResponse<any>> {
    const token = localStorage.getItem('token');

    return this._http.delete<any>(`${this.apiUrl}api/cart/remove`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: { producto_id: productId },
        observe: 'response'
      }
    )
  }

}
