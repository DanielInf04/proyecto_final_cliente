import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProduct } from '../../../interfaces/product/iproduct';

interface IndexResponse {
  productos_sin_oferta: any[];
  productos_con_oferta: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = environment.apiUrl;

  constructor(private _http:HttpClient) { }

  // Retorna productos para página de inicio
  public getIndex(): Observable<HttpResponse<IndexResponse>> {
    return this._http.get<IndexResponse>(`${this.apiUrl}api/products`, { observe: 'response' });
  }

  // Retorna todos los productos (público)
  public getAllProducts(): Observable<HttpResponse<IProduct[]>> {
    return this._http.get<IProduct[]>(`${this.apiUrl}api/products`, { observe: 'response' });
  }

  // Buscar productos por término (público)
  public searchProductos(termino: string): Observable<HttpResponse<IProduct[]>> {
    return this._http.get<IProduct[]>(`${this.apiUrl}api/products/search`, {
      params: { query: termino },
      observe: 'response'
    });
  }

  // Retorna productos recomendados
  public getRecommendedProducts(context: 'search' | 'producto', id?: number): Observable<IProduct[]> {
    const params: any = { context };
    if (id) params.id = id;
    return this._http.get<IProduct[]>(`${this.apiUrl}api/products/recommended`, { params });
  }

  // Retorna todos los productos en oferta (público)
  public getAllProductsOffer(page: number = 1, perPage: number = 10): Observable<HttpResponse<any>> {
    return this._http.get<any>(`${this.apiUrl}api/products-offer`, {
      observe: 'response',
      params: {
        page: page.toString(),
        per_page: perPage.toString()
      }
    });
  }

  /*public getAllProductsOffer(): Observable<HttpResponse<IProduct[]>> {
    return this._http.get<IProduct[]>(`${this.apiUrl}api/products-offer`, { observe: 'response' });
  }*/

  // Retornar productos por categoria (público)
  public getProductsByCategory(id: number, page: number = 1, perPage: number = 10): Observable<HttpResponse<any>> {
    return this._http.get<any>(`${this.apiUrl}api/categories/${id}/products`, {
      observe: 'response',
      params: {
        page: page.toString(),
        perPage: perPage.toString()
      }
    });
  }

  /*public getProductsByCategory(id: number): Observable<HttpResponse<IProduct[]>> {
    return this._http.get<IProduct[]>(
      `${this.apiUrl}api/categories/${id}/products`,
      { observe: 'response' }
    );
  }*/

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

}
