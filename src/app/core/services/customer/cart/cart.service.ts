import { Injectable } from '@angular/core';
//import { environment } from '../environments/environment.development';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';
import { IProduct } from '../../../../interfaces/product/iproduct';
import { TokenService } from '../../shared/auth/token.service';
//import { IProduct } from '../app/interfaces/iproduct';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = environment.apiUrl;

  // Contador observable
  private cartItemCount = new BehaviorSubject<number>(0);
  public cartItemCount$ = this.cartItemCount.asObservable();

  private cartLoadedSubject = new BehaviorSubject<boolean>(false);
  cartLoaded$ = this.cartLoadedSubject.asObservable();

  private cartStateSubject = new BehaviorSubject<any[]>([]);
  public cartState$ = this.cartStateSubject.asObservable();

  constructor(
    private _http:HttpClient,
    private tokenService: TokenService
  ) { }

  // Resetear estado carrito
  public resetCartState(): void {
    this.cartStateSubject.next([]);
    this.cartItemCount.next(0);
  }

  // Refrescamos el estado del carrito según si el usuario está logueado o no
  public refreshCart(): void {
    const token = this.tokenService.getToken();
    const role = this.tokenService.getUserRole();

    if (token && role === 'cliente') {
      this._http.get<any>(`${this.apiUrl}api/cart/`, {
        headers: { Authorization: `Bearer ${token}` }
      }).subscribe({
        next: (res) => {
          const productos = res.items || [];
          this.cartStateSubject.next([...productos]);
          
          const cantidadTotal = productos.reduce((acc: number, item: any) => acc + item.cantidad, 0);
          this.cartItemCount.next(cantidadTotal);

          this.cartLoadedSubject.next(true);
        },
        error: (err) => {
          console.error('Error al obtener carrito del backend', err);
          this.cartStateSubject.next([]);
          this.cartItemCount.next(0);

          this.cartLoadedSubject.next(true);
        }
      });
    } else {
      const productos = this.getAnonCart();
      this.cartStateSubject.next([...productos]);
      this.cartItemCount.next(productos.reduce((acc, item) => acc + item.cantidad, 0));
      
      this.cartLoadedSubject.next(true);
    }
  }

  // Obtener carrito desde backend
  public getCart(): Observable<HttpResponse<any>> {
    //const token = localStorage.getItem('token');

    return this._http.get<any>(`${this.apiUrl}api/cart/`, {
      /*headers: {
        Authorization: `Bearer ${token}`
      },*/
      observe: 'response'
    });
  }

  // Agregar producto (para usuarios logueados)
  public addToCart(productoId: number, quantity: number): Observable<HttpResponse<IProduct>> {
    //const token = localStorage.getItem('token');

    return new Observable(observer => {
      this._http.post<IProduct>(`${this.apiUrl}api/cart/add`,
        { producto_id: productoId, cantidad: quantity },
        {
          //headers: { Authorization: `Bearer ${token}` },
          observe: 'response'
        }).subscribe(response => {
          this.refreshCart(); // Sincroniza después de agregar
          observer.next(response);
          observer.complete();
        }, error => {
          observer.error(error);
        });
    });
  }

  // Actualizar cantidad (logueado)
  public updateProduct(productId: number, quantity: number): Observable<HttpResponse<any>> {
    //const token = localStorage.getItem('token');

    return new Observable(observer => {
      this._http.put<any>(`${this.apiUrl}api/cart/update`,
        { producto_id: productId, cantidad: quantity },
        {
          //headers: { Authorization: `Bearer ${token}` },
          observe: 'response'
        }).subscribe(response => {
          this.refreshCart();
          observer.next(response);
          observer.complete();
        }, error => {
          observer.error(error);
        });
    });
  }

  // Eliminar producto (logueado)
  public deleteProduct(productId: number): Observable<HttpResponse<any>> {
    //const token = localStorage.getItem('token');

    return new Observable(observer => {
      this._http.delete<any>(`${this.apiUrl}api/cart/remove`, {
        //headers: { Authorization: `Bearer ${token}` },
        body: { producto_id: productId },
        observe: 'response'
      }).subscribe(response => {
        this.refreshCart();
        observer.next(response);
        observer.complete();
      }, error => {
        observer.error(error);
      });
    });
  }
  

  mergeAnonCartIfExists(): Observable<any> {
    const anonCart = localStorage.getItem('anon_cart');

    if (!anonCart) return of(null);

    const productos = JSON.parse(anonCart);

    // Enviamos al backend para fusionar
    return this._http.post(`${this.apiUrl}api/user/cart/merge`, { productos });
  }

  // Carrito anónimo
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

  public addToAnonCart(producto: any, cantidad: number): void {
    const carrito = this.getAnonCart();
    const index = carrito.findIndex((p: any) => p.producto_id === producto.producto_id);

    if (index !== -1) {
      carrito[index].cantidad += cantidad;
    } else {
      producto.cantidad = cantidad;
      carrito.push(producto);
    }

    localStorage.setItem('anon_cart', JSON.stringify(carrito));
    this.refreshCart();
  }

  public updateAnonCart(productId: number, cantidad: number): void {
    const carrito = this.getAnonCart();
    const index = carrito.findIndex(p => p.producto_id === productId);

    if (index !== -1) {
      carrito[index].cantidad = cantidad;
      localStorage.setItem('anon_cart', JSON.stringify(carrito));
      this.refreshCart();
    }
  }

  public deleteFromAnonCart(productId: number): void {
    const carrito = this.getAnonCart().filter(p => p.producto_id !== productId);
    localStorage.setItem('anon_cart', JSON.stringify(carrito));
    this.refreshCart();
  }
}
