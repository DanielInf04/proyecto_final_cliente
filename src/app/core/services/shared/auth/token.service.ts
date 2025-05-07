import { Injectable } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserFromToken(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getUserName(): string | null {
    const user = this.getUserFromToken();
    return user?.name || null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /*jwtHelper = new JwtHelperService();

  getUserName(): string | null {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.name;
    }
    return null;
  }

  getUserFromToken(): any {
      const token = localStorage.getItem('token');
      if (!token) return null;
    
      try {
        const decoded: any = jwtDecode(token);
        return decoded;
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }*/

}
