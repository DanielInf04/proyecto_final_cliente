import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../../shared/auth/token.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private apiUrl = environment.apiUrl;

  constructor(
    private _http:HttpClient,
    private tokenService: TokenService
  ) { }

  // Retorna los datos del usuario
  public getProfile(): Observable<HttpResponse<any>> {
    const token = this.tokenService.getToken();

    if (!token) {
      throw new Error('Token no encontrado');
    }

    return this._http.get<any>(`${this.apiUrl}api/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      observe: 'response'
    });
  }

}
