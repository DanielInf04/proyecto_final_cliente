import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OauthService {

  private apiUrl = environment.apiUrl;

  constructor(private _http:HttpClient) { }

  sendGoogleTokenToBackend(idToken: string): Observable<any> {
      return this._http.post(`${this.apiUrl}api/auth/google/login`, { token: idToken });
  }

}
