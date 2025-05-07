import { Injectable } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Icategory } from '../app/interfaces/icategory';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = environment.apiUrl;

  constructor(private _http:HttpClient) { }

  public getCategories():Observable<HttpResponse<Icategory[]>> {
    return this._http.get<Icategory[]>(`${this.apiUrl}api/categories`, { observe: 'response' });
  }

}
