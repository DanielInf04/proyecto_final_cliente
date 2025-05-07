import { Injectable } from '@angular/core';
//import { environment } from '../environments/environment.development';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { IProduct } from '../../../../interfaces/product/iproduct';
//import { IProduct } from '../app/interfaces/iproduct';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = environment.apiUrl;

  // Contador observable
  private cartItemCount = new BehaviorSubject<number>(0);
  public cartItemCount$ = this.cartItemCount.asObservable();

  constructor(private _http:HttpClient) { }

  public addToCart(productoId: number, quantity: number): Observable<HttpResponse<IProduct>> {
    const token = localStorage.getItem('token');
  
    return new Observable(observer => {
      this._http.post<IProduct>(`${this.apiUrl}api/cart/add`,
        { producto_id: productoId, cantidad: quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          observe: 'response'
        }).subscribe(response => {
          this.updateCartCount(); // ✅ Actualiza el contador del badge
          observer.next(response);
          observer.complete();
        }, error => {
          observer.error(error);
        });
    });
  }

  /*public addToCart(productoId: number, quantity: number):Observable<HttpResponse<IProduct>> {
    const token = localStorage.getItem('token');

    return this._http.post<IProduct>(`${this.apiUrl}api/cart/add`,
      { producto_id: productoId, cantidad: quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        observe: 'response'
      });
  }*/

  public getCart(): Observable<HttpResponse<any>> {
    const token = localStorage.getItem('token');

    return this._http.get<any>(`${this.apiUrl}api/cart/`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      observe: 'response'
    });
  }

  mergeAnonCartIfExists(): Observable<any> {
    const anonCart = localStorage.getItem('anon_cart');

    if (!anonCart) return of(null);

    const productos = JSON.parse(anonCart);

    // Enviamos al backend para fusionar
    return this._http.post(`${this.apiUrl}api/user/cart/merge`, { productos });
  }

  public getAnonCart(): any[] {
    const carrito = localStorage.getItem('anon_cart');
    if (!carrito) return [];

    try {
      return JSON.parse(carrito);
    } catch (e) {
      console.warn('Error al parsear anon_cart:', e);
      return [];
    }
  }

  public updateCartCount(): void {
    const token = localStorage.getItem('token');
  
    this._http.get<any>(`${this.apiUrl}api/cart/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe(response => {
      const productos = response.items || [];
      const cantidadTotal = Array.isArray(productos) ? productos.length : 0;
      this.cartItemCount.next(cantidadTotal);
    }, error => {
      console.error('Error al actualizar contador del carrito', error);
    });
  }
  
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

  public deleteProduct(productId: number): Observable<HttpResponse<any>> {
    const token = localStorage.getItem('token');

    return new Observable(observer => {
      this._http.delete<any>(`${this.apiUrl}api/cart/remove`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: { producto_id: productId },
        observe: 'response'
      }).subscribe(response => {
        this.updateCartCount();
        observer.next(response);
        observer.complete();
      }, error => {
        observer.error(error);
      });
    });
  }

  /*public deleteProduct(productId: number):Observable<HttpResponse<any>> {
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
  }*/

}
