import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaginatedProductsResponse } from '../../../interfaces/product/paginated-products-response';
import { IProduct } from '../../../interfaces/product/iproduct';
import { TokenService } from '../shared/auth/token.service';

@Injectable({
  providedIn: 'root'
})
export class ProductBusinessService {

  private apiUrl = environment.apiUrl;

  constructor(
    private _http:HttpClient
  ) { }

  // Obtener productos de una empresa
  public getProducts(page: number = 1, perPage: number = 10, estado: string): Observable<HttpResponse<PaginatedProductsResponse>> {

    return this._http.get<PaginatedProductsResponse>(`${this.apiUrl}api/company/products`, {
      observe: 'response',
      params: {
        page: page.toString(),
        per_page: perPage.toString(),
        estado: estado
      }
    });
  }

  // Buscar productos de mi empresa
  public searchMyProducts(
    termino: string,
    page: number = 1,
    perPage: number = 10
  ): Observable<HttpResponse<PaginatedProductsResponse>> {

    return this._http.get<PaginatedProductsResponse>(`${this.apiUrl}api/company/products/search`, {
      observe: 'response',
      params: {
        q: termino,
        page: page.toString(),
        per_page: perPage.toString()
      }
    });
  }

  // Crear un nuevo producto
  public createProduct(product:any): Observable<HttpResponse<IProduct>> {
  
      return this._http.post<IProduct>(`${this.apiUrl}api/company/product`, product, {
        observe: 'response'
      });
    }
  
    // Actualizar estado de un producto (activo / inactivo)
    public actualizarEstado(id:number, estado:string) {
  
      return this._http.patch<IProduct>(`${this.apiUrl}api/company/product/${id}`, { estado }, {
        observe: 'response'
      });
    }

    // Editar un producto existente
    public editProduct(id:any, datos:any): Observable<HttpResponse<IProduct>> {

      return this._http.post<IProduct>(`${this.apiUrl}api/company/product/${id}`, datos, {
        observe: 'response'
      });
    }
  
    // Eliminar un producto
    public deleteProduct(id:any): Observable<HttpResponse<IProduct>> {
  
      return this._http.delete<IProduct>(`${this.apiUrl}api/company/product/${id}`, {
        observe: 'response'
      });
    }

}
