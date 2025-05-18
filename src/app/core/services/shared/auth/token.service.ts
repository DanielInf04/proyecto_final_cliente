import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from '../../../../interfaces/user/jwt-payload';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private decodeToken(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<JwtPayload>(token);
    } catch (error) {
      console.error('Error al decodificar token:', error);
      return null;
    }
  }

  /*getUserFromToken(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      //return jwtDecode(token);
      return jwtDecode<JwtPayload>(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }*/

  getUserData(): JwtPayload | null {
    return this.decodeToken();
  }

  getUserName(): string | null {
    return this.getUserData()?.name || null;
  }

  getUserEmail(): string | null {
    return this.getUserData()?.email || null;
  }

  getUserRole(): string | null {
    return this.getUserData()?.role || null;
  }

  /*getUserName(): string | null {
    const user = this.getUserFromToken();
    return user?.name || null;
  }*/

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

}
