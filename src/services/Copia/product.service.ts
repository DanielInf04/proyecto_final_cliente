import { Injectable } from '@angular/core';
//import { environment } from '../environments/environment.development';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
//import { IProduct } from '../app/interfaces/iproduct';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  /*private apiUrl = environment.apiUrl;

  constructor(private _http:HttpClient) { }

  // Retorna todos los productos (público)
  public getAllProducts(): Observable<HttpResponse<IProduct[]>> {
    return this._http.get<IProduct[]>(`${this.apiUrl}api/products`, { observe: 'response' });
  }

  // Retorna todos los productos de la empresa
  public getProducts(): Observable<HttpResponse<IProduct[]>> {
    const token = localStorage.getItem('token');

    return this._http.get<IProduct[]>(`${this.apiUrl}api/my/products`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      observe: 'response'
    });
  }

  // Crear un producto
  public createProduct(product:any): Observable<HttpResponse<IProduct>> {
    const token = localStorage.getItem('token');

    return this._http.post<IProduct>(`${this.apiUrl}api/company/product`, product, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      observe: 'response'
    });
  }

  public actualizarEstado(id:number, estado:string) {
    const token = localStorage.getItem('token');

    return this._http.patch<IProduct>(`${this.apiUrl}api/product/${id}`, { estado }, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      observe: 'response'
    });
  }

  // Retornar el producto
  public getProduct(id:any): Observable<HttpResponse<IProduct>> {
    return this._http.get<IProduct>(`${this.apiUrl}api/product/${id}`, { observe: 'response' });
  }

  // Retornar la imagen del producto
  public getImagen(id:any): Observable<Blob> {
    return this._http.get(`${this.apiUrl}api/product/image/${id}`, { responseType: 'blob' });
  }

  public getImagenesDeProducto(id: any): Observable<{ producto_id: number; imagenes: string[] }> {
    return this._http.get<{ producto_id: number; imagenes: string[] }>(`${this.apiUrl}api/products/images/${id}`);
  }

  // Editar un producto
  public editProduct(id:any, datos:any): Observable<HttpResponse<IProduct>> {
    const token = localStorage.getItem('token');

    return this._http.post<IProduct>(`${this.apiUrl}api/company/product/${id}`, datos, { // ?_method=PUT
      headers: {
        Authorization: `Bearer ${token}`
      },
      observe: 'response'
    });
  }

  // Eliminar un producto
  public deleteProduct(id:any): Observable<HttpResponse<IProduct>> {
    const token = localStorage.getItem('token');

    return this._http.delete<IProduct>(`${this.apiUrl}api/product/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      observe: 'response'
    });
  }*/

}
