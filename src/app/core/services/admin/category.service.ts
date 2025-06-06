import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Icategory } from '../../../interfaces/product/category/icategory';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = environment.apiUrl;

  constructor(private _http:HttpClient) { }

  public getCategories():Observable<HttpResponse<Icategory[]>> {
    return this._http.get<Icategory[]>(`${this.apiUrl}api/categories`, { observe: 'response' });
  }

  public getCategory(id: any): Observable<HttpResponse<Icategory>> {
    return this._http.get<Icategory>(`${this.apiUrl}api/category/${id}`, { observe: 'response' });
  }

  public createCategory(category:any): Observable<HttpResponse<Icategory>> {
    //const token = localStorage.getItem('token');

    return this._http.post<Icategory>(`${this.apiUrl}api/admin/category`, category, {
      /*headers: {
        Authorization: `Bearer ${token}`
      },*/
      observe: 'response'
    });
  }

  public editCategory(id: any, datos: any): Observable<HttpResponse<Icategory>> {
    //const token = localStorage.getItem('token');

    return this._http.post<Icategory>(`${this.apiUrl}api/admin/category/${id}`, datos, {
      /*headers: {
        Authorization: `Bearer ${token}`
      },*/
      observe: 'response'
    });
  }

  public deleteCategory(id: any): Observable<HttpResponse<Icategory>> {
    //const token = localStorage.getItem('token');

    return this._http.delete<Icategory>(`${this.apiUrl}api/admin/category/${id}`, {
      /*headers: {
        Authorization: `Bearer ${token}`
      },*/
      observe: 'response'
    });
  }

}
