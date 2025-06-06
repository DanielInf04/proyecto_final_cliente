import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IReviewPost } from '../../../../interfaces/review/ireviewpost';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  private apiUrl = environment.apiUrl;

  constructor(private _http:HttpClient) { }

  public createReview(reviewData: IReviewPost): Observable<any> {
    const token = localStorage.getItem('token');

    return this._http.post(`${this.apiUrl}api/user/review`, reviewData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

}
